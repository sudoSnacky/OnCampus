
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
import { PlusCircle, Trash2, Upload, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "./ui/dialog";
import { useState, useEffect } from "react";

const FormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Club name is required."),
  category: z.string().min(2, "Category is required."),
  description: z.string().min(10, "Description is required."),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
});

type FormData = z.infer<typeof FormSchema>;

export default function AdminClubsTab() {
  const { toast } = useToast();
  const { clubs, addClub, removeClub, updateClub, isInitialized } = useClubs();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      imageUrl: ""
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
  
  const onAddSubmit: SubmitHandler<FormData> = (data) => {
    addClub(data);
    toast({
      title: "Club Added!",
      description: `"${data.name}" has been added.`,
    });
    form.reset();
  };

  const onEditSubmit: SubmitHandler<FormData> = (data) => {
    if (!data.id) return;
    updateClub(data.id, data);
    toast({
      title: "Club Updated!",
      description: `"${data.name}" has been updated.`,
    });
    setIsEditDialogOpen(false);
  };
  
  const handleEditClick = (club: Club) => {
    editForm.reset(club);
    setIsEditDialogOpen(true);
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
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                     <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="https://example.com/image.png" {...field} />
                        </FormControl>
                        <Button variant="outline" asChild>
                            <Link href="https://postimages.org/" target="_blank">
                                <Upload className="mr-2 h-4 w-4" /> Upload
                            </Link>
                        </Button>
                    </div>
                    <FormDescription>
                      The URL of an image for the club.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isInitialized}>
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
                    onClick={() => removeClub(club.id)}
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
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
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
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    