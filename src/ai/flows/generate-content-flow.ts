'use server';

/**
 * @fileOverview A flow for generating content for the admin panel.
 *
 * - generateContent - A function that generates a description and image query.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateContentInputSchema = z.object({
  name: z.string().describe('The name of the item to generate content for.'),
  type: z.enum(['Event', 'Club', 'Benefit']).describe('The type of item.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

export const GenerateContentOutputSchema = z.object({
  description: z.string().describe('A compelling and concise description for the item. Should be around 2-3 sentences.'),
  imageQuery: z.string().describe('A 1-2 word query for Unsplash to find a suitable background image.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentPrompt',
  input: { schema: GenerateContentInputSchema },
  output: { schema: GenerateContentOutputSchema },
  prompt: `You are a creative assistant for a college campus application in India.
Your task is to generate a short, engaging description and a suitable image search query for a given item.

Item Type: {{{type}}}
Item Name: {{{name}}}

Generate a description that would appeal to college students in India.
Generate an image search query that is 1 or 2 words and would find a good, modern, and vibrant image for a card background on Unsplash.
`,
});

const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
