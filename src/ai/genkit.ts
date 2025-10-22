'use server';

import { genkit, type Plugin } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const plugins: Plugin<any>[] = [];

// In development, you can set the API key in .env.local
// In production, you will need to set the GEMINI_API_KEY environment variable
if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  plugins.push(googleAI());
} else if (process.env.NODE_ENV === 'development') {
    console.log("NEXT_PUBLIC_GEMINI_API_KEY not found. AI features will be disabled. Please add it to your .env.local file.");
} else {
    console.error("NEXT_PUBLIC_GEMINI_API_KEY is not set in production environment.");
}

export const ai = genkit({
  plugins: plugins,
  enableTracingAndMetrics: true,
});
