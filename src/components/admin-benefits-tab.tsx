
"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { type Benefit, useBenefits } from "../hooks/use-benefits";
import { PlusCircle, Edit, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Skeleton } from "./ui/skeleton";

const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is required."),
  provider: z.string().min(2, "Provider is required."),
  category: z.string().min(2, "Category is required."),
  description: z.string().min(10, "Description is required."),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
  redirectUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type FormData = z.infer<typeof FormSchema>;

export default function AdminBenefitsTab() {
  const { data: benefits, isLoading, add, remove, update, isInitialized } = useBenefits();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addForm = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: "", provider: "", category: "", description: "", redirectUrl: "" },
  });

  const editForm = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, form: typeof addForm | typeof editForm) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("imageFile", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
        const { id, imageFile, imageUrl, ...data } = formData;
        if (!imageFile) {
            addForm.setError("imageFile", { type: "manual", message: "An image is required."});
            return;
        }
        await add(data, imageFile);
        toast({ title: "Benefit Added", description: `"${data.title}" has been successfully created.` });
        addForm.reset();
        setImagePreview(null);
        (addForm.control as any)._fields.imageFile._f.value = null;
        setIsAddDialogOpen(false);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: errorMessage });
    }
  };

  const handleEditSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { id, imageFile, ...data } = formData;
      if (!id) throw new Error("ID not found");
      await update(id, data, imageFile);
      toast({ title: "Benefit Updated", description: `"${data.title}" has been successfully updated.` });
      setIsEditDialogOpen(false);
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: errorMessage });
    }
  };
  
  const handleDeleteClick = async (item: Benefit) => {
    try {
      await remove(item.id);
      toast({ title: "Benefit Removed", description: `"${item.title}" has been successfully removed.` });
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Uh oh! Something went wrong.", description: errorMessage });
    }
  };
  
  const openEditDialog = (item: Benefit) => {
    editForm.reset(item);
    setImagePreview(item.imageUrl);
    setIsEditDialogOpen(true);
  };
  
  const openAddDialog = () => {
    addForm.reset({ title: "", provider: "", category: "", description: "", redirectUrl: "" });
    setImagePreview(null);
    setIsAddDialogOpen(true);
  };

  return (
    <div>
        <div className="flex justify-end mb-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={openAddDialog} className="btn-animated-gradient w-48">
                    <PlusCircle className="mr-2" /> Add Benefit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add New Benefit</DialogTitle>
                    <DialogDescription>Fill in the details for the new student benefit.</DialogDescription>
                </DialogHeader>
                <Form {...addForm}>
                    <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={addForm.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Benefit Title</FormLabel>
                                    <FormControl><Input placeholder="e.g., Student Discount" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={addForm.control} name="provider" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Provider</FormLabel>
                                    <FormControl><Input placeholder="e.g., BookMyShow" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={addForm.control} name="category" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Category</FormLabel>
                                    <FormControl><Input placeholder="e.g. Entertainment, Food, Travel" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={addForm.control} name="description" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea rows={3} placeholder="Describe the benefit..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={addForm.control} name="redirectUrl" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Redirect URL</FormLabel>
                                    <FormControl><Input placeholder="https://example.com/offer" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                           <FormField
                                control={addForm.control}
                                name="imageFile"
                                render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Benefit Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, addForm)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {imagePreview && (
                                <div className="md:col-span-2 relative h-48 w-full rounded-md overflow-hidden">
                                    <Image src={imagePreview} alt="Image preview" fill style={{ objectFit: 'contain' }} />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={addForm.formState.isSubmitting}>
                                {addForm.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                                Add Benefit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
            </Dialog>
        </div>
        <ScrollArea className="h-96 pr-4">
            <div className="space-y-2">
                {isLoading && !isInitialized ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </div>
                    ))
                ) : (
                    benefits.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                                    {item.imageUrl ? <Image src={item.imageUrl} alt={item.title} fill style={{ objectFit: 'cover'}} /> : <div className="flex h-full w-full items-center justify-center"><ImageIcon className="text-muted-foreground" /></div>}
                                </div>
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.provider}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}><Edit className="h-4 w-4" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>This will permanently delete the benefit "{item.title}". This action cannot be undone.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteClick(item)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ScrollArea>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Edit Benefit</DialogTitle>
                    <DialogDescription>Update the details for this benefit.</DialogDescription>
                </DialogHeader>
                <Form {...editForm}>
                    <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={editForm.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Benefit Title</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={editForm.control} name="provider" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Provider</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={editForm.control} name="category" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Category</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={editForm.control} name="description" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={editForm.control} name="redirectUrl" render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Redirect URL</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField
                                control={editForm.control}
                                name="imageFile"
                                render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Change Image (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, editForm)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {imagePreview && (
                                <div className="md:col-span-2 relative h-48 w-full rounded-md overflow-hidden">
                                    <Image src={imagePreview} alt="Image preview" fill style={{ objectFit: 'contain' }} />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={editForm.formState.isSubmitting}>
                                {editForm.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    </div>
  );
}
