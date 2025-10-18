import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { PageHeader } from "@/components/page-header";
import { ArrowLeft } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="font-headline text-xl font-bold tracking-tight text-sidebar-foreground">
                CampusConnect
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <PageHeader>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
                <Link href="/">
                    <ArrowLeft />
                    <span className="sr-only">Back to Home</span>
                </Link>
              </Button>
            </div>
          </PageHeader>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
