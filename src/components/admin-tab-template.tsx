
"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import { useForm, type SubmitHandler, type UseFormReturn, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, type ZodType } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useToast } from "../hooks/use-toast";
import { PlusCircle, Trash2, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";

// Base type for data items, they must have an id
interface DataItem {
  id: string;
  [key: string]: any;
}

// Props for the generic AdminTab component
export interface AdminTabProps<T extends DataItem, TSchema extends ZodType<any, any, any>> {
  title: string;
  description: string;
  dataHook: {
    data: T[];
    isLoading: boolean;
    isInitialized: boolean;
    add: (item: Omit<T, 'id' | 'imageUrl'>, imageFile: File) => Promise<void>;
    remove: (id: string) => Promise<void>;
    update: (id: string, item: Partial<Omit<T, 'id'>>, imageFile?: File) => Promise<void>;
  };
  formSchema: TSchema;
  formFields: {
      name: Path<z.infer<TSchema>>;
      label: string;
      description?: string;
      colSpan?: string;
      render: (field: any) => React.ReactNode;
  }[];
  renderItem: (item: T) => React.ReactNode;
  getDisplayName?: (item: T) => string;
  transformSubmitData?: (data: z.infer<TSchema>) => T;
  transformLoadData?: (item: T) => z.infer<TSchema>;
}

const MemoizedFormFields = memo(({ form, fields }: { form: UseFormReturn<any>, fields: AdminTabProps<any, any>['formFields'] }) => {
    return (
        <>
            {fields.map(({ name, label, description, colSpan, render }) => (
                <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                        <FormItem className={colSpan}>
                            <FormLabel>{label}</FormLabel>
                            {render(field)}
                            {description && <FormDescription>{description}</FormDescription>}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
        </>
    );
});
MemoizedFormFields.displayName = "MemoizedFormFields";


export function AdminTab<T extends DataItem, TSchema extends ZodType<any, any, any>>({
  title,
  description,
  dataHook,
  formSchema,
  formFields,
  renderItem,
  getDisplayName,
  transformSubmitData,
  transformLoadData,
}: AdminTabProps<T, TSchema>) {
    const { toast } = useToast();
    const { data, isLoading, isInitialized, add, remove, update } = dataHook;
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultValues = useMemo(() => {
        const values = Object.fromEntries(formFields.map(f => {
            const fieldSchema = (formSchema as z.AnyZodObject).shape[f.name];
            if (fieldSchema instanceof z.ZodDate) return [f.name, undefined];
            if (fieldSchema instanceof z.ZodString) return [f.name, ''];
            return [f.name, undefined]
        }));
        if (title === 'Event') {
            values.time = '12:00';
        }
        return values;
    }, [formFields, formSchema, title]);

    const addForm = useForm<z.infer<TSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const editForm = useForm<z.infer<TSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (!isEditDialogOpen) {
            editForm.reset();
        }
    }, [isEditDialogOpen, editForm]);

    const handleAddSubmit: SubmitHandler<z.infer<TSchema>> = async (formData) => {
        setIsSubmitting(true);
        const { imageFile, ...itemData } = formData;
        if (!imageFile) {
            toast({
                variant: "destructive",
                title: "Image required",
                description: `Please select an image file to upload for the new ${title}.`,
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const finalData = transformSubmitData ? transformSubmitData(itemData as any) : itemData;
            await add(finalData as any, imageFile as File);
            const displayName = getDisplayName ? getDisplayName(formData as T) : title;
            toast({
                title: `${title} Added!`,
                description: `"${displayName}" has been added.`,
            });
            addForm.reset(defaultValues);
            (addForm.control as any)._fields.imageFile._f.value = null;
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: `Uh oh! Something went wrong.`,
                description: error.message || `Could not add ${title}.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit: SubmitHandler<z.infer<TSchema>> = async (formData) => {
        if (!formData.id) return;
        setIsSubmitting(true);
        const { id, imageFile, ...itemData } = formData;
        
        try {
            const finalData = transformSubmitData ? transformSubmitData(itemData as any) : itemData;
            await update(id, finalData as any, imageFile as File | undefined);
            const displayName = getDisplayName ? getDisplayName(formData as T) : title;
            toast({
                title: `${title} Updated!`,
                description: `"${displayName}" has been updated.`,
            });
            setIsEditDialogOpen(false);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message || `Could not update ${title}.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (item: T) => {
        const loadData = transformLoadData ? transformLoadData(item) : item;
        editForm.reset(loadData as any);
        setIsEditDialogOpen(true);
    };
    
    const handleDeleteClick = async (item: T) => {
        const displayName = getDisplayName ? getDisplayName(item) : title;
        if(!confirm(`Are you sure you want to delete "${displayName}"?`)) return;
        try {
            await remove(item.id);
            toast({
                title: `${title} Removed`,
                description: `"${displayName}" has been removed.`,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: `Uh oh! Something went wrong.`,
                description: error.message || `Could not remove ${title}.`,
            });
        }
    };
    
    return (
        <div className="space-y-6 pt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PlusCircle /> Add New {title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...addForm}>
                        <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <MemoizedFormFields form={addForm} fields={formFields} />
                            </div>
                            <FormField
                                control={addForm.control}
                                name="imageFile"
                                render={({ field: { onChange, value, ...rest } }) => (
                                    <FormItem>
                                        <FormLabel>{title} Image</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="file" 
                                                accept="image/png, image/jpeg, image/gif"
                                                onChange={(e) => onChange(e.target.files?.[0])}
                                                {...rest}
                                            />
                                        </FormControl>
                                        <FormDescription>Upload an image for the {title}.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={!isInitialized || isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add {title}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Existing {title}s</CardTitle>
                    <CardDescription>Here is a list of all current {title.toLowerCase()}s.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/></div>}
                    {!isLoading && data.length === 0 && <p className="text-center text-muted-foreground">No {title.toLowerCase()}s found.</p>}
                    <ul className="space-y-4">
                        {data.map((item) => (
                            <li key={item.id} className="flex items-center justify-between rounded-md border p-4">
                                <div>{renderItem(item)}</div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}><Pencil className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
      
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Edit {title}</DialogTitle></DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <MemoizedFormFields form={editForm} fields={formFields} />
                            </div>
                            <FormField
                                control={editForm.control}
                                name="imageFile"
                                render={({ field: { onChange, value, ...rest } }) => (
                                    <FormItem>
                                        <FormLabel>New {title} Image (Optional)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="file" 
                                                accept="image/png, image/jpeg, image/gif"
                                                onChange={(e) => onChange(e.target.files?.[0])}
                                                {...rest}
                                            />
                                        </FormControl>
                                        <FormDescription>Upload a new image to replace the existing one.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
