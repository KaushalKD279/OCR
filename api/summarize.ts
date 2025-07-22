// This is a serverless function that will be deployed as an API endpoint.
// It's designed to work with Vercel, Netlify, or similar platforms.
// You will need to install Express and Body-Parser: `npm install express body-parser`
// You will also need to install node-fetch: `npm install node-fetch@2`

import type { VercelRequest, VercelResponse } from '@vercel/node';

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

async function queryHuggingFace(data: { inputs: string }, token: string) {
  const response = await fetch(
    HUGGINGFACE_API_URL,
    {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { textToSummarize } = req.body;

  if (!textToSummarize) {
    return res.status(400).json({ error: 'textToSummarize is required' });
  }

  const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

  if (!HUGGINGFACE_API_TOKEN) {
    return res.status(500).json({ error: 'Hugging Face API token is not configured on the server.' });
  }

  try {
    const data = await queryHuggingFace({ inputs: textToSummarize }, HUGGINGFACE_API_TOKEN);
    
    if (data.error) {
      // Handle cases where the model is loading
      if (data.error.includes("is currently loading")) {
        const estimatedTime = data.estimated_time || 20;
        // Wait for the estimated time and try again
        await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000));
        const retryData = await queryHuggingFace({ inputs: textToSummarize }, HUGGINGFACE_API_TOKEN);
        if (retryData.error) {
          throw new Error(`Model still loading or another error occurred: ${retryData.error}`);
        }
        return res.status(200).json(retryData);
      }
      throw new Error(data.error);
    }

    return res.status(200).json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return res.status(500).json({ error: errorMessage });
  }
} 