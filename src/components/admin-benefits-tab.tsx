
"use client";

import { z } from "zod";
import { type Benefit, useBenefits } from "../hooks/use-benefits";
import { AdminTab, type AdminTabProps } from "./admin-tab-template";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const FormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title is required."),
  provider: z.string().min(2, "Provider is required."),
  category: z.string().min(2, "Category is required."),
  description: z.string().min(10, "Description is required."),
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().optional(),
  redirectUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

const formFields: AdminTabProps<Benefit, typeof FormSchema>['formFields'] = [
    {
        name: "title",
        label: "Benefit Title",
        description: "The main title of the benefit.",
        render: (field) => <Input placeholder="e.g., Student Discount" {...field} />,
        colSpan: "md:col-span-1"
    },
    {
        name: "provider",
        label: "Provider",
        description: "The company or service providing the benefit.",
        render: (field) => <Input placeholder="e.g., BookMyShow" {...field} />,
        colSpan: "md:col-span-1"
    },
    {
        name: "category",
        label: "Category",
        description: "A category to group the benefit (e.g., Entertainment, Food).",
        render: (field) => <Input placeholder="e.g. Entertainment, Food, Travel" {...field} />,
    },
    {
        name: "description",
        label: "Description",
        description: "A detailed description of the benefit.",
        render: (field) => <Textarea rows={3} placeholder="Describe the benefit..." {...field} />,
    },
    {
        name: "redirectUrl",
        label: "Redirect URL",
        description: "The link to redeem or learn more about the benefit.",
        render: (field) => <Input placeholder="https://example.com/offer" {...field} />,
    },
];


export default function AdminBenefitsTab() {
  const benefitHook = useBenefits();

  return (
    <AdminTab
      title="Benefit"
      description="Add, remove, or edit student benefits."
      dataHook={benefitHook}
      formSchema={FormSchema}
      formFields={formFields}
      renderItem={(item) => (
        <>
          <p className="font-semibold">{item.title}</p>
          <p className="text-sm text-muted-foreground">{item.provider}</p>
        </>
      )}
    />
  );
}

