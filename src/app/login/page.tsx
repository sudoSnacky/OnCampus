"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const FormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof FormSchema>;

const AUTH_KEY = "campusconnect_auth";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check auth status on mount
    const isAuthenticated = localStorage.getItem(AUTH_KEY) === "true";
    if (isAuthenticated) {
        router.replace("/admin");
    }
  }, [router]);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        if (data.username === "ABC1234" && data.password === "ABC1234") {
          localStorage.setItem(AUTH_KEY, "true");
          toast({
            title: "Login Successful",
            description: "Redirecting to admin dashboard...",
          });
          router.push("/admin");
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Incorrect username or password.",
          });
          setIsLoading(false);
        }
    }, 500);
  };


  return (
    <div className="flex min-h-screen flex-col">
        <header className="absolute top-0 left-0 w-full p-4">
            <Button variant="ghost" asChild>
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
            </Button>
        </header>
        <main className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        <Icons.logo className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ABC1234" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
