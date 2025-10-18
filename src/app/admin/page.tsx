"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useToast } from "../../hooks/use-toast";
import { LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import AdminEventsTab from "../../components/admin-events-tab";
import AdminClubsTab from "../../components/admin-clubs-tab";
import AdminBenefitsTab from "../../components/admin-benefits-tab";

const AUTH_KEY = "oncampus_auth";

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_KEY) === "true";
    if (!authStatus) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
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

  if (!isAuthenticated) {
    return null; // Don't render anything until authenticated
  }

  return (
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-20 items-center justify-between">
                <h1 className="font-headline text-2xl font-bold">Admin Dashboard</h1>
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
            </div>
        </header>
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Card className="w-full shadow-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Manage Content</CardTitle>
                    <CardDescription>
                    Add, remove, or edit benefits, clubs, and events.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="events" className="w-full">
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
