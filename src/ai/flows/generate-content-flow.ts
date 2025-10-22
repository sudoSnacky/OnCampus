'use server';
/**
 * @fileOverview This file defines Genkit flows for generating event content.
 * It uses AI to create descriptions and image URLs based on an event title.
 *
 * - generateEventDescription: Generates text content (descriptions, image prompt).
 * - generateEventImage: Generates an image from a given prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the output schema for the description generation prompt.
const DescriptionGenerationSchema = z.object({
  description: z.string().describe('A short, engaging description for the event, suitable for a summary card. Max 2-3 sentences.'),
  longDescription: z.string().describe('A longer, more detailed description for an event details page. Can be a few paragraphs.'),
  imagePrompt: z.string().describe('A creative, descriptive prompt for a text-to-image model to generate a visually appealing and relevant image for the event. This should be abstract or conceptual, not literal.'),
});

export type EventDescription = z.infer<typeof DescriptionGenerationSchema>;


/**
 * Generates textual content for an event based on its title.
 * @param title The title of the event.
 * @returns An object containing a short description, long description, and an image prompt.
 */
export async function generateEventDescription(title: string): Promise<EventDescription> {
  const descriptionPrompt = ai.definePrompt({
    name: 'descriptionGenerationPrompt',
    input: { schema: z.string() },
    output: { schema: DescriptionGenerationSchema },
    prompt: `You are an expert event planner and marketer for a college campus in India.
    Given the event title "{{query}}", generate a short description, a long description, and a creative image prompt.
    The tone should be exciting and tailored to students.`,
  });

  const { output } = await descriptionPrompt(title);

  if (!output) {
    throw new Error('Failed to generate text content.');
  }

  return output;
}

/**
 * Generates an image URL from a given text prompt.
 * @param prompt The text prompt for the text-to-image model.
 * @returns An object containing the generated image URL.
 */
export async function generateEventImage(prompt: string): Promise<{ imageUrl: string }> {
  const { media } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: prompt,
  });

  const imageUrl = media.url;
  if (!imageUrl) {
    throw new Error('Failed to generate image.');
  }

  return { imageUrl };
}
