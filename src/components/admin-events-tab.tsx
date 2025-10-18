
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
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
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
import { useEffect } from "react";

const FormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  location: z.string().min(2, "Location is required."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long."),
  date: z.date({
    required_error: "A date for the event is required.",
  }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type FormData = z.infer<typeof FormSchema>;

export default function AdminEventsTab() {
  const { toast } = useToast();
  const { events, addEvent, removeEvent, isInitialized } = useEvents();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        title: "",
        location: "",
        description: "",
        imageUrl: "",
    }
  });

  useEffect(() => {
    form.reset({
      title: "",
      location: "",
      description: "",
      date: new Date(),
      imageUrl: "",
    });
  }, [form]);


  const onSubmit: SubmitHandler<FormData> = (data) => {
    addEvent({
      ...data,
      date: data.date.toISOString(),
      imageId: data.imageUrl || '',
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
            Fill in the details to add a new event to the calendar. You can use a site like ImgBB to upload images and get a URL.
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Describe the event..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={!isInitialized}>
                Create Event
              </Button>
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
                   <p className="text-sm text-muted-foreground">{format(new Date(event.date), "PPP")}</p>
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
