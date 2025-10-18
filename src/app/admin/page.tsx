"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, ArrowLeft, Trash2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminEventsTab from "@/components/admin-events-tab";
import AdminClubsTab from "@/components/admin-clubs-tab";
import AdminBenefitsTab from "@/components/admin-benefits-tab";
import { DinoLoader } from "@/components/dino-loader";

const AUTH_KEY = "campusconnect_auth";

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_KEY) === "true";
    if (!authStatus) {
      router.replace("/login");
    } else {
      setIsAuthenticating(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.replace("/login");
  };

  if (isAuthenticating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <DinoLoader />
        <p className="mt-4 text-lg text-foreground/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>
      <main className="flex items-start justify-center">
        <Card className="w-full max-w-4xl shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Manage Content</CardTitle>
            <CardDescription>
              Add, remove, or edit benefits, clubs, and events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="events">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="clubs">Clubs</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>
              <TabsContent value="events">
                <AdminEventsTab />
              </TabsContent>
              <TabsContent value="clubs">
                <AdminClubsTab />
              </TabsContent>
              <TabsContent value="benefits">
                <AdminBenefitsTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
