import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    return new GoogleGenAI(apiKey);
  };

  async function handleLeadGen(model: any, niche: string, location: string, count: number) {
    const systemPrompt = `You are an advanced lead generation AI system.
Your job is to generate HIGH-QUALITY, RELEVANT, and REALISTIC business leads.

STRICT RULES:
- Never generate fake emails
- Never generate fake websites
- Never hallucinate obviously fake companies
- If exact contact data is unavailable, return empty string instead
- Prefer real publicly-known businesses
- Avoid outdated businesses
- Avoid duplicates
- Return only clean structured JSON
- No markdown
- No explanations
- No extra text

INPUT VARIABLES:
- niche: ${niche}
- location: ${location}
- targetAudience: decision makers in ${niche}
- numberOfLeads: ${count}

OUTPUT FORMAT:
{
  "leads": [
    {
      "company": "",
      "website": "",
      "email": "",
      "instagram": "",
      "location": "",
      "category": "",
      "summary": ""
    }
  ]
}

RULES:
- website must start with https://
- email must look valid
- instagram should contain proper handle or URL
- summary should be short
- category must match niche
- return exact requested number of leads

OUTPUT ONLY VALID JSON.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  }

  async function handleOutreachGen(model: any, lead: any) {
    const prompt = `Generate a high-conversion, professional outreach strategy for a business called "${lead.company}" in the "${lead.category}" niche based in ${lead.location}.
Company Summary: ${lead.summary}

Generate three distinct scripts in JSON format:
{
  "coldEmail": "subject and body",
  "linkedinDm": "short personalized dm",
  "shortPitch": "2-sentence elevator pitch"
}

Keep it professional, high-intent, and focused on value. Use placeholders like [Your Name].`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  }

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { niche, location, count = 10, task = 'leads', lead } = req.body;

    try {
      const ai = getGenAI();
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      if (task === 'leads') {
        const data = await handleLeadGen(model, niche, location, count);
        return res.json({ success: true, leads: data.leads });
      } else if (task === 'outreach' && lead) {
        const data = await handleOutreachGen(model, lead);
        return res.json({ success: true, ...data });
      } else {
        return res.status(400).json({ success: false, error: "Invalid task or missing lead data" });
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Legacy endpoints (forward to /api/chat)
  app.post("/api/leads", async (req, res) => {
    req.body.task = 'leads';
    // Manually trigger chat handler logic or just let it fall through
    // For simplicity, we just keep the separate routes too but make them robust
    const { niche, location, count = 10 } = req.body;
    try {
      const ai = getGenAI();
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      // ... same logic ...
      // I'll just use a shared helper function for lead gen
      const data = await handleLeadGen(model, niche, location, count);
      res.json({ success: true, leads: data.leads });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/outreach", async (req, res) => {
    const { lead } = req.body;
    try {
      const ai = getGenAI();
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const data = await handleOutreachGen(model, lead);
      res.json({ success: true, ...data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.all("/api/*", (req, res) => {
    res.status(404).json({ success: false, error: "API endpoint not found" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
