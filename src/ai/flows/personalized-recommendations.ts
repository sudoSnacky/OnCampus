'use server';

/**
 * @fileOverview Provides personalized recommendations for benefits, clubs, and events based on user profile and location in India.
 *
 * - `getPersonalizedRecommendations` - A function to fetch personalized recommendations.
 * - `PersonalizedRecommendationsInput` - The input type for the `getPersonalizedRecommendations` function.
 * - `PersonalizedRecommendationsOutput` - The return type for the `getPersonalizedRecommendations` function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  studentProfile: z
    .string()
    .describe('Detailed profile of the student, including interests, academic program, and year of study.'),
  locationInIndia: z
    .string()
    .describe('The city or region in India where the student is located.'),
  pastActivity: z
    .string()
    .optional()
    .describe('Optional history of student interactions within the app.'),
});

export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendedBenefits: z
    .array(z.string())
    .describe('A list of recommended benefits relevant to the student.'),
  recommendedClubs: z
    .array(z.string())
    .describe('A list of recommended clubs and societies for the student.'),
  recommendedEvents: z
    .array(z.string())
    .describe('A list of recommended events happening on or near campus.'),
  reasoning: z
    .string()
    .describe('Explanation of why these specific recommendations were made'),
});

export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a recommendation engine for a college campus in India.

  Based on the student's profile, location, and past activity, provide personalized recommendations for benefits, clubs, and events.

  Consider both campus-related and local opportunities relevant to the student's location in India.
  The recommendations should be tailored to the student's interests and academic pursuits.

  Student Profile: {{{studentProfile}}}
  Location in India: {{{locationInIndia}}}
  Past Activity: {{{pastActivity}}}

  Provide a short explanation of your reasoning, and why you are recommending these items.

  Format your answer as a JSON object.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
