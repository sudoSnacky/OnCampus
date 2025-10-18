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
import { useBenefits } from "../hooks/use-benefits";
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
  title: z.string().min(3, "Title is required."),
  provider: z.string().min(2, "Provider is required."),
  category: z.string().min(2, "Category is required."),
  description: z.string().min(10, "Description is required."),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  redirectUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type FormData = z.infer<typeof FormSchema>;

export default function AdminBenefitsTab() {
  const { toast } = useToast();
  const { benefits, addBenefit, removeBenefit, isInitialized } = useBenefits();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      provider: "",
      category: "",
      description: "",
      imageUrl: "",
      redirectUrl: "",
    },
  });

   useEffect(() => {
    form.reset({
      title: "",
      provider: "",
      category: "",
      description: "",
      imageUrl: "",
      redirectUrl: "",
    });
  }, [form]);


  const onSubmit: SubmitHandler<FormData> = (data) => {
    addBenefit({
      ...data,
      imageId: data.imageUrl || '',
      redirectUrl: data.redirectUrl || '',
    });
    toast({
      title: "Benefit Added!",
      description: `"${data.title}" has been added.`,
    });
    form.reset();
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
            Fill in the details to add a new student benefit. You can use a site like ImgBB to upload images and get a URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Entertainment" {...field} />
                    </FormControl>
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
              <Button type="submit" disabled={!isInitialized}>
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBenefit(benefit.id)}
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
