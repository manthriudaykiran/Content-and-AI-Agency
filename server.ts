import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini if key exists
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with key:', err);
  }
}

// Server API endpoint for Gemini Generation
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  const { prompt, systemInstruction } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      return res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API call failed:', error);
      // Fallback gracefully with error context
      return res.status(500).json({ error: error.message || 'Gemini call failed' });
    }
  }

  // Fallback response if no API key is provided
  return res.json({
    text: `[AetherOS Intelligent Engine Output]\nSynthesized response for: "${prompt.slice(0, 80)}..."\n\n- Key Strategy: Target high-intent operational friction with tangible ROI proof.\n- Core Deliverable: Multi-channel authority breakdown removing prospect skepticism.\n- Next Action: Dispatched to Content Strategist & Outreach Agent queue for approval.`,
  });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    geminiConfigured: !!ai,
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint for client-side Supabase configuration
app.get('/api/config/supabase', (_req: Request, res: Response) => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';

  res.json({
    url,
    publishableKey,
    configured: Boolean(url && publishableKey),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
