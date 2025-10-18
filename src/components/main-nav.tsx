"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket, Users, Calendar } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const links = [
  {
    href: "/benefits",
    label: "Benefits",
    icon: <Ticket />,
  },
  {
    href: "/clubs",
    label: "Clubs",
    icon: <Users />,
  },
  {
    href: "/events",
    label: "Events",
    icon: <Calendar />,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            className={cn(
              "justify-start text-base font-medium",
              pathname === link.href && "bg-accent text-accent-foreground"
            )}
          >
            <Link href={link.href}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
