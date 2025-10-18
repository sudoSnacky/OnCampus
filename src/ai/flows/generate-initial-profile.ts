'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating an initial user profile based on a short prompt.
 *
 * It exports:
 * - `generateInitialProfile`: An async function that takes a prompt and returns a generated user profile.
 * - `InitialProfileInput`: The input type for the prompt, which is a simple string.
 * - `InitialProfileOutput`: The output type for the flow, representing the generated user profile.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const InitialProfileInputSchema = z.object({
  interests: z
    .string()
    .describe(
      'A short prompt describing the users interests, hobbies, and aspirations.'
    ),
});
export type InitialProfileInput = z.infer<typeof InitialProfileInputSchema>;

const InitialProfileOutputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  major: z.string().describe('The major of the user.'),
  university: z.string().describe('The university of the user.'),
  clubs: z
    .array(z.string())
    .describe('A list of clubs that the user might be interested in.'),
  benefits: z
    .array(z.string())
    .describe('A list of benefits that the user might be interested in.'),
  events: z
    .array(z.string())
    .describe('A list of events that the user might be interested in.'),
});
export type InitialProfileOutput = z.infer<typeof InitialProfileOutputSchema>;

export async function generateInitialProfile(
  input: InitialProfileInput
): Promise<InitialProfileOutput> {
  return generateInitialProfileFlow(input);
}

const initialProfilePrompt = ai.definePrompt({
  name: 'initialProfilePrompt',
  input: {schema: InitialProfileInputSchema},
  output: {schema: InitialProfileOutputSchema},
  prompt: `You are an AI assistant designed to create initial user profiles for the OnCampus India application.

  Based on the users provided interests, generate a user profile that contains their name, major, university, and lists of suggested clubs, benefits, and events.

  Interests: {{{interests}}}

  Output: User profile as a JSON object.`,
});

const generateInitialProfileFlow = ai.defineFlow(
  {
    name: 'generateInitialProfileFlow',
    inputSchema: InitialProfileInputSchema,
    outputSchema: InitialProfileOutputSchema,
  },
  async input => {
    const {output} = await initialProfilePrompt(input);
    return output!;
  }
);
