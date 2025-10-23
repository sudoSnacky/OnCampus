
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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
import { useBenefits, type Benefit } from "../hooks/use-benefits";
import { PlusCircle, Trash2, Pencil, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { useState, useEffect } from "react";

const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is required."),
  provider: z.string().min(2, "Provider is required."),
  tags: z.string().min(2, "Tags are required."),
  description: z.string().min(10, "Description is required."),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
  redirectUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type FormData = z.infer<typeof FormSchema>;

export default function AdminBenefitsTab() {
  const { toast } = useToast();
  const { benefits, addBenefit, removeBenefit, updateBenefit, isInitialized, isBenefitsLoading } = useBenefits();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      provider: "",
      tags: "",
      description: "",
      imageUrl: "",
      redirectUrl: "",
    },
  });

  const editForm = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    if (!isEditDialogOpen) {
        editForm.reset();
    }
  }, [isEditDialogOpen, editForm]);

  const onAddSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    if (!data.imageFile) {
        toast({
            variant: "destructive",
            title: "Image required",
            description: "Please select an image file to upload.",
        });
        setIsSubmitting(false);
        return;
    }
    try {
      const { imageFile, ...benefitData } = data;
      await addBenefit({
        ...benefitData,
        redirectUrl: data.redirectUrl || '',
      }, imageFile);
      toast({
        title: "Benefit Added!",
        description: `"${data.title}" has been added.`,
      });
      form.reset();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Could not add benefit.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const onEditSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.id) return;
    setIsSubmitting(true);
    try {
        await updateBenefit(data.id, {
            ...data,
            redirectUrl: data.redirectUrl || '',
        }, data.imageFile);
        toast({
          title: "Benefit Updated!",
          description: `"${data.title}" has been updated.`,
        });
        setIsEditDialogOpen(false);
    } catch(error: any) {
         toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Could not update benefit.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleEditClick = (benefit: Benefit) => {
    editForm.reset(benefit);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = async (benefitId: string, benefitTitle: string) => {
    try {
        await removeBenefit(benefitId);
        toast({
            title: "Benefit Removed",
            description: `"${benefitTitle}" has been removed.`,
        });
    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Could not remove benefit.",
        });
    }
  };


  return (
    <div className="space-y-6 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle />
            Add New Benefit
          </CardTitle>
          <CardDescription>
            Fill in the details to add a new student benefit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefit Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Student Discount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BookMyShow" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Entertainment, Food, Travel" {...field} />
                    </FormControl>
                     <FormDescription>
                        Separate tags with a comma.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Describe the benefit..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Benefit Image</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept="image/png, image/jpeg, image/gif"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        onChange(e.target.files[0]);
                                    }
                                }}
                                {...rest}
                            />
                        </FormControl>
                        <FormDescription>Upload an image for the benefit.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/offer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isInitialized || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Benefit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Benefits</CardTitle>
          <CardDescription>
            Here is a list of all current benefits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isBenefitsLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/></div>}
          {!isBenefitsLoading && benefits.length === 0 && <p className="text-center text-muted-foreground">No benefits found.</p>}
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li
                key={benefit.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <p className="font-semibold">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground">{benefit.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(benefit)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(benefit.id, benefit.title)}
                    >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Benefit</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefit Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                     <FormDescription>
                        Separate tags with a comma.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="imageFile"
                render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>New Benefit Image (Optional)</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept="image/png, image/jpeg, image/gif"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        onChange(e.target.files[0]);
                                    }
                                }}
                                {...rest}
                            />
                        </FormControl>
                        <FormDescription>Upload a new image to replace the existing one.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={editForm.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
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
