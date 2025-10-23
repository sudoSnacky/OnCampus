
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
import { useClubs, type Club } from "../hooks/use-clubs";
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
  name: z.string().min(3, "Club name is required."),
  category: z.string().min(2, "Category is required."),
  description: z.string().min(10, "Description is required."),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
  instagramUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  linkedinUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type FormData = z.infer<typeof FormSchema>;

export default function AdminClubsTab() {
  const { toast } = useToast();
  const { clubs, addClub, removeClub, updateClub, isInitialized, isClubsLoading } = useClubs();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      imageUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
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
      await addClub({
        ...data,
        instagramUrl: data.instagramUrl || '',
        linkedinUrl: data.linkedinUrl || '',
      }, data.imageFile);
      toast({
        title: "Club Added!",
        description: `"${data.name}" has been added.`,
      });
      form.reset();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Could not add club.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const onEditSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data.id) return;
    setIsSubmitting(true);
    try {
        await updateClub(data.id, {
            ...data,
            instagramUrl: data.instagramUrl || '',
            linkedinUrl: data.linkedinUrl || '',
        }, data.imageFile);
        toast({
          title: "Club Updated!",
          description: `"${data.name}" has been updated.`,
        });
        setIsEditDialogOpen(false);
    } catch(error: any) {
         toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Could not update club.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleEditClick = (club: Club) => {
    editForm.reset(club);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = async (clubId: string, clubName: string) => {
    try {
        await removeClub(clubId);
        toast({
            title: "Club Removed",
            description: `"${clubName}" has been removed.`,
        });
    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Could not remove club.",
        });
    }
  };

  return (
    <div className="space-y-6 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle />
            Add New Club
          </CardTitle>
          <CardDescription>
            Fill in the details to add a new student club.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Coding Circle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Describe the club..."
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
                        <FormLabel>Club Image</FormLabel>
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
                        <FormDescription>Upload an image for the club.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/yourclub" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/company/yourclub" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit" disabled={!isInitialized || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Club
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Clubs</CardTitle>
          <CardDescription>
            Here is a list of all current clubs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClubsLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/></div>}
          {!isClubsLoading && clubs.length === 0 && <p className="text-center text-muted-foreground">No clubs found.</p>}
          <ul className="space-y-4">
            {clubs.map((club) => (
              <li
                key={club.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <p className="font-semibold">{club.name}</p>
                   <p className="text-sm text-muted-foreground">{club.category}</p>
                </div>
                 <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(club)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(club.id, club.name)}
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
            <DialogTitle>Edit Club</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-6">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                        <FormLabel>New Club Image (Optional)</FormLabel>
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
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL (Optional)</FormLabel>
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
