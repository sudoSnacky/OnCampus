'use server';
/**
 * @fileoverview This file initializes the Genkit AI framework with the Google AI plugin.
 * It configures the AI instance and exports it for use in other parts of the application.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Check if the API key is available.
const isApiKeyAvailable = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize Genkit with the Google AI plugin if the API key is provided.
export const ai = genkit({
  plugins: [
    isApiKeyAvailable && googleAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
