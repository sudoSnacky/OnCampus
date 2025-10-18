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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useToast } from "../hooks/use-toast";
import { useClubs } from "../hooks/use-clubs";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect } from "react";

const FormSchema = z.object({
  name: z.string().min(3, "Club name is required."),
  category: z.string().min(2, "Category is required."),
  description: z.string().min(10, "Description is required."),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type FormData = z.infer<typeof FormSchema>;

export default function AdminClubsTab() {
  const { toast } = useToast();
  const { clubs, addClub, removeClub, isInitialized } = useClubs();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: "",
      category: "",
      description: "",
      imageUrl: "",
    });
  }, [form]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    addClub({
      ...data,
      imageId: data.imageUrl || '',
    });
    toast({
      title: "Club Added!",
      description: `"${data.name}" has been added.`,
    });
    form.reset();
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
            Fill in the details to add a new student club. You can use a site like ImgBB to upload images and get a URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeClub(club.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
