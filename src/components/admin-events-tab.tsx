
"use client";

import { z } from "zod";
import { type CampusEvent, useEvents } from "../hooks/use-events";
import { AdminTab, type AdminTabProps } from "./admin-tab-template";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FormControl } from "./ui/form";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters long."),
  location: z.string().min(2, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  date: z.date({
    required_error: "A date for the event is required.",
  }),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
});

const formFields: AdminTabProps<CampusEvent, typeof FormSchema>['formFields'] = [
    {
        name: "title",
        label: "Event Title",
        render: (field) => <Input placeholder="e.g., Annual Tech Fest" {...field} />,
    },
    {
        name: "location",
        label: "Location",
        render: (field) => <Input placeholder="e.g., Main Auditorium" {...field} />,
    },
    {
        name: "date",
        label: "Event Date",
        colSpan: "md:col-span-2",
        render: (field) => (
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
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        ),
    },
    {
        name: "description",
        label: "Description",
        render: (field) => <Textarea rows={3} placeholder="A brief summary of the event..." {...field} />,
    },
];

export default function AdminEventsTab() {
  const eventHook = useEvents();

  return (
    <AdminTab
      title="Event"
      description="Add, remove, or edit campus events."
      dataHook={eventHook}
      formSchema={FormSchema}
      formFields={formFields}
      getDisplayName={(item) => item.title}
      renderItem={(item) => (
        <>
          <p className="font-semibold">{item.title}</p>
          <p className="text-sm text-muted-foreground">{format(new Date(item.date), "PPP")}</p>
        </>
      )}
    />
  );
}
