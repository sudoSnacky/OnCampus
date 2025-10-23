
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
import { format, setHours, setMinutes, parse } from "date-fns";
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
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time in HH:mm format."),
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
        colSpan: "md:col-span-1",
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
        name: "time",
        label: "Event Time",
        colSpan: "md:col-span-1",
        render: (field) => <Input type="time" {...field} />,
    },
    {
        name: "description",
        label: "Description",
        render: (field) => <Textarea rows={3} placeholder="A brief summary of the event..." {...field} />,
    },
];

export default function AdminEventsTab() {
  const eventHook = useEvents();

  const transformSubmitData = (data: z.infer<typeof FormSchema>) => {
    const [hours, minutes] = data.time.split(':').map(Number);
    const combinedDate = setMinutes(setHours(data.date, hours), minutes);
    return {
        ...data,
        date: combinedDate.toISOString(),
    };
  };

  const transformLoadData = (item: CampusEvent) => {
    const date = new Date(item.date);
    return {
        ...item,
        date: date,
        time: format(date, "HH:mm"),
    }
  };


  return (
    <AdminTab
      title="Event"
      description="Add, remove, or edit campus events."
      dataHook={eventHook}
      formSchema={FormSchema}
      formFields={formFields}
      getDisplayName={(item) => item.title}
      transformSubmitData={transformSubmitData as any}
      transformLoadData={transformLoadData}
      renderItem={(item) => (
        <>
          <p className="font-semibold">{item.title}</p>
          <p className="text-sm text-muted-foreground">{format(new Date(item.date), "PPP p")}</p>
        </>
      )}
    />
  );
}
