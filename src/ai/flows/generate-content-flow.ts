'use server';
/**
 * @fileOverview This file defines a generic Genkit flow for generating content.
 * It uses AI to create descriptions and image prompts based on a title and entity type.
 *
 * - generateEntityDescription: Generates text content for an entity.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the input schema for the content generation flow.
const GenerateContentInputSchema = z.object({
    title: z.string(),
    type: z.enum(['Event', 'Club', 'Benefit']),
});

// Define the output schema for the content generation flow.
const GeneratedContentSchema = z.object({
  description: z.string().describe('A short, engaging description for the entity, suitable for a summary card. Max 2-3 sentences.'),
  longDescription: z.string().describe('A longer, more detailed description for the entity details page. Can be a few paragraphs.'),
  imagePrompt: z.string().describe('A creative, descriptive prompt for a text-to-image model to generate a visually appealing and relevant image for the entity. This should be abstract or conceptual, not literal.'),
});

export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;

// Define the prompt using the schemas.
const contentGenerationPrompt = ai.definePrompt({
    name: 'contentGenerationPrompt',
    input: { schema: GenerateContentInputSchema },
    output: { schema: GeneratedContentSchema },
    prompt: `You are an expert marketer for a college campus in India.
    Given the {{type}} titled "{{title}}", generate a short description, a long description, and a creative image prompt.
    The tone should be exciting and tailored to students.`,
});


/**
 * Generates textual content for an event, club, or benefit.
 * @param title The title of the entity.
 * @param type The type of entity ('Event', 'Club', or 'Benefit').
 * @returns An object containing a short description, long description, and an image prompt.
 */
export async function generateEntityDescription(title: string, type: 'Event' | 'Club' | 'Benefit'): Promise<GeneratedContent> {
  const { output } = await contentGenerationPrompt({ title, type });

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
