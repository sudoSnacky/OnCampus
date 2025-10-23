
"use client";

import { z } from "zod";
import { type Club, useClubs } from "../hooks/use-clubs";
import { AdminTab, type AdminTabProps } from "./admin-tab-template";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

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

const formFields: AdminTabProps<Club, typeof FormSchema>['formFields'] = [
    {
        name: "name",
        label: "Club Name",
        render: (field) => <Input placeholder="e.g., The Coding Circle" {...field} />,
        colSpan: "md:col-span-1"
    },
    {
        name: "category",
        label: "Category",
        render: (field) => <Input placeholder="e.g., Technology, Coding" {...field} />,
        colSpan: "md:col-span-1"
    },
    {
        name: "description",
        label: "Description",
        render: (field) => <Textarea rows={3} placeholder="Describe the club..." {...field} />,
    },
    {
        name: "instagramUrl",
        label: "Instagram URL (Optional)",
        render: (field) => <Input placeholder="https://instagram.com/yourclub" {...field} />,
    },
    {
        name: "linkedinUrl",
        label: "LinkedIn URL (Optional)",
        render: (field) => <Input placeholder="https://linkedin.com/company/yourclub" {...field} />,
    },
];

export default function AdminClubsTab() {
  const clubHook = useClubs();

  return (
    <AdminTab
      title="Club"
      description="Add, remove, or edit student clubs."
      dataHook={clubHook}
      formSchema={FormSchema}
      formFields={formFields}
      getDisplayName={(item) => item.name}
      renderItem={(item) => (
        <>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-muted-foreground">{item.category}</p>
        </>
      )}
    />
  );
}
