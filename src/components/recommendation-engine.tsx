"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generateInitialProfile,
  type InitialProfileOutput,
} from "../ai/flows/generate-initial-profile";
import {
  getPersonalizedRecommendations,
  type PersonalizedRecommendationsOutput,
} from "../ai/flows/personalized-recommendations";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useToast } from "../hooks/use-toast";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";

const FormSchema = z.object({
  interests: z.string().min(10, {
    message: "Please tell us a bit more about your interests (at least 10 characters).",
  }).max(500, {
    message: "That's a lot! Please keep it under 500 characters."
  }),
});

type FormData = z.infer<typeof FormSchema>;

type CombinedOutput = InitialProfileOutput & PersonalizedRecommendationsOutput;

const RecommendationSkeleton = () => (
  <div className="space-y-4 mt-6">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);

export default function RecommendationEngine() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CombinedOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      interests: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setRecommendations(null);

    try {
      // Step 1: Generate initial profile to get structured data
      const profile = await generateInitialProfile({ interests: data.interests });

      // Step 2: Use the generated profile to get personalized recommendations
      const studentProfileString = `
        Name: ${profile.name}, 
        Major: ${profile.major}, 
        University: ${profile.university},
        Interests: ${data.interests},
        Suggested Clubs: ${profile.clubs.join(", ")},
        Suggested Benefits: ${profile.benefits.join(", ")},
        Suggested Events: ${profile.events.join(", ")}
      `;

      const finalRecs = await getPersonalizedRecommendations({
        studentProfile: studentProfileString,
        locationInIndia: "Delhi", // Hardcoded for this example
      });
      
      // Combine results for display
      setRecommendations({ ...profile, ...finalRecs });

    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating your recommendations. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-headline">Your Interests</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'I'm a computer science student who loves cricket, sci-fi movies, and learning about startups in India...'"
                      className="resize-none text-base"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate My Recommendations
                </>
              )}
            </Button>
          </form>
        </Form>
        
        {loading && <RecommendationSkeleton />}

        {recommendations && (
          <div className="mt-8">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="font-headline text-blue-700 dark:text-blue-300">Here are your personalized recommendations!</AlertTitle>
              <AlertDescription className="text-blue-700/80 dark:text-blue-300/80">
                {recommendations.reasoning}
              </AlertDescription>
            </Alert>
            
            <Accordion type="single" collapsible className="w-full mt-6" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-headline">Recommended Benefits</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                    {recommendations.recommendedBenefits.map((item, i) => (
                      <li key={`benefit-${i}`}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-headline">Recommended Clubs</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                    {recommendations.recommendedClubs.map((item, i) => (
                      <li key={`club-${i}`}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-headline">Recommended Events</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                    {recommendations.recommendedEvents.map((item, i) => (
                      <li key={`event-${i}`}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
    </>
  );
}
