
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
import { PlusCircle, Sparkles, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { generateContent } from "@/ai/flows/generate-content-flow";
import { useState } from "react";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const isAiEnabled = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

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

  const handleGenerateContent = async () => {
    const title = form.getValues("title");
    if (!title) {
      toast({
        variant: "destructive",
        title: "Title is required",
        description: "Please enter a title to generate content.",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateContent({ name: title, type: "Benefit" });
      form.setValue("description", result.description);
      form.setValue("imageUrl", `https://source.unsplash.com/800x600/?${encodeURIComponent(result.imageQuery)}`);
      toast({
        title: "Content Generated!",
        description: "Description and image URL have been filled in.",
      });
    } catch (error) {
      console.error("Failed to generate content:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate content. Is the Gemini API key configured?",
      });
    } finally {
      setIsGenerating(false);
    }
  };


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
                    <div className="flex items-center justify-between">
                      <FormLabel>Description</FormLabel>
                       <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateContent}
                        disabled={isGenerating || !isAiEnabled}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGenerating ? "Generating..." : "Generate with AI"}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Describe the benefit..."
                        {...field}
                      />
                    </FormControl>
                    {!isAiEnabled && <p className="text-xs text-muted-foreground">To enable AI generation, add your Gemini API Key to the .env.local file.</p>}
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
