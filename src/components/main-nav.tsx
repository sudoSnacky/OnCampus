"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";

const links = [
  {
    href: "/benefits",
    label: "Benefits",
    color: "blue",
  },
  {
    href: "/clubs",
    label: "Clubs",
    color: "green",
  },
  {
    href: "/events",
    label: "Events",
    color: "red",
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
            "justify-start text-base font-medium transition-all duration-300",
            `hover:shadow-glow-${link.color}`
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
