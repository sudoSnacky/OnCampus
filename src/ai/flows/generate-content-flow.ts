'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating event content.
 * It uses AI to create a description and an image URL based on an event title.
 *
 * - generateEventContent: The main function to call the AI flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the output schema for the content generation prompt.
const ContentGenerationSchema = z.object({
  description: z.string().describe('A short, engaging description for the event, suitable for a summary card. Max 2-3 sentences.'),
  longDescription: z.string().describe('A longer, more detailed description for an event details page. Can be a few paragraphs.'),
  imagePrompt: z.string().describe('A creative, descriptive prompt for a text-to-image model to generate a visually appealing and relevant image for the event. This should be abstract or conceptual, not literal.'),
});

// Define and export the main function that runs the flow.
export async function generateEventContent(title: string): Promise<{ description: string; longDescription: string; imageUrl: string }> {
  // 1. Generate the text content (description and image prompt)
  const contentPrompt = ai.definePrompt({
    name: 'contentGenerationPrompt',
    input: { schema: z.string() },
    output: { schema: ContentGenerationSchema },
    prompt: `You are an expert event planner and marketer for a college campus in India.
    Given the event title "{{query}}", generate a short description, a long description, and a creative image prompt.
    The tone should be exciting and tailored to students.`,
  });

  const { output: contentOutput } = await contentPrompt(title);

  if (!contentOutput) {
    throw new Error('Failed to generate text content.');
  }

  // 2. Generate the image using the prompt from the previous step
  const { media } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: contentOutput.imagePrompt,
  });

  const imageUrl = media.url;
  if (!imageUrl) {
    throw new Error('Failed to generate image.');
  }

  return {
    description: contentOutput.description,
    longDescription: contentOutput.longDescription,
    imageUrl: imageUrl,
  };
}
