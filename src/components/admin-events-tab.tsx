
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
import { useEvents } from "../hooks/use-events";
import { Calendar as CalendarIcon, Image as ImageIcon, PlusCircle, Sparkles, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Timestamp } from "firebase/firestore";
import { generateEntityDescription, generateEventImage } from "@/ai/flows/generate-content-flow";
import { useState } from "react";

const FormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  location: z.string().min(2, "Location is required."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long."),
  longDescription: z
    .string()
    .optional(),
  date: z.date({
    required_error: "A date for the event is required.",
  }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imagePrompt: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

// Check if the Gemini API key is available in the environment
const isAiEnabled = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;


export default function AdminEventsTab() {
  const { toast } = useToast();
  const { events, addEvent, removeEvent, isInitialized } = useEvents();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        title: "",
        location: "",
        description: "",
        longDescription: "",
        imageUrl: "",
        imagePrompt: "",
    }
  });

  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    if (!title) {
      toast({
        variant: "destructive",
        title: "Title is missing",
        description: "Please enter a title to generate content.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateEntityDescription(title, 'Event');
      if (result) {
        form.setValue("description", result.description, { shouldValidate: true });
        form.setValue("longDescription", result.longDescription, { shouldValidate: true });
        form.setValue("imagePrompt", result.imagePrompt, { shouldValidate: true });
        toast({
          title: "Content Generated!",
          description: "AI has created the description and image prompt.",
        });
      }
    } catch (error) {
      console.error("AI Description Generation Error:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate text content. Please check your API key and try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    const imagePrompt = form.getValues("imagePrompt");
    if (!imagePrompt) {
      toast({
        variant: "destructive",
        title: "Image Prompt is missing",
        description: "Please generate a description first to get an image prompt.",
      });
      return;
    }

    setIsGeneratingImg(true);
    try {
      const result = await generateEventImage(imagePrompt);
      if (result) {
        form.setValue("imageUrl", result.imageUrl, { shouldValidate: true });
        toast({
          title: "Image Generated!",
          description: "AI has created a new image for your event.",
        });
      }
    } catch (error) {
      console.error("AI Image Generation Error:", error);
      toast({
        variant: "destructive",
        title: "AI Image Generation Failed",
        description: "Could not generate an image. Please try again.",
      });
    } finally {
      setIsGeneratingImg(false);
    }
  };


  const onSubmit: SubmitHandler<FormData> = (data) => {
    addEvent({
      ...data,
      imageId: data.imageUrl || '',
      longDescription: data.longDescription || '',
    });
    toast({
      title: "Event Created!",
      description: `"${data.title}" has been added to the calendar.`,
    });
    form.reset();
  };

  return (
    <div className="space-y-6 pt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle />
            Add New Event
          </CardTitle>
          <CardDescription>
            Fill in the details to add a new event to the calendar. You can use AI to help with content creation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Annual Tech Fest" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Main Auditorium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isAiEnabled && (
                <div className="flex items-center justify-center rounded-lg border border-dashed p-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || isGeneratingImg}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating Text..." : "Generate Descriptions with AI"}
                  </Button>
                </div>
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>Short Description</FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder="A brief summary of the event for the card view..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Provide more details about the event for the 'Learn More' dialog..."
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
                      <div className="flex items-center gap-2">
                        <Input placeholder="https://example.com/image.png" {...field} />
                         {isAiEnabled && (
                           <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImg || isGenerating || !form.watch("imagePrompt")}
                            title="Generate Image with AI"
                           >
                            <ImageIcon className="h-4 w-4"/>
                           </Button>
                         )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full sm:w-auto" disabled={!isInitialized}>
                  Create Event
                </Button>
              </div>
              {!isAiEnabled && (
                <p className="text-xs text-muted-foreground text-center">
                  To enable AI generation, add your Gemini API key to the .env.local file.
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Existing Events</CardTitle>
          <CardDescription>
            Here is a list of all current events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <p className="font-semibold">{event.title}</p>
                   <p className="text-sm text-muted-foreground">{format(event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date), "PPP")}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEvent(event.id)}
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
