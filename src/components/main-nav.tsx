"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";

const links = [
  {
    href: "/benefits",
    label: "Benefits",
  },
  {
    href: "/clubs",
    label: "Clubs",
  },
  {
    href: "/events",
    label: "Events",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-2">
      {links.map((link) => (
        <Button
          key={link.href}
          asChild
          variant={pathname === link.href ? "secondary" : "ghost"}
          className={cn(
            "justify-start text-base font-medium",
          )}
        >
          <Link href={link.href}>
            {link.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
