import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// AI Logic Inlined
async function handleAIRequest(prompt: string, isJson: boolean = true) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (openRouterKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: prompt }],
          response_format: isJson ? { type: "json_object" } : undefined
        })
      });

      if (!response.ok) throw new Error(`OpenRouter error: ${response.status}`);
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty response from OpenRouter");
      return isJson ? JSON.parse(text.replace(/```json|```/g, '').trim()) : text;
    } catch (error: any) {
      if (!geminiKey) throw error;
    }
  }

  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: isJson ? "application/json" : "text/plain" }
      });
      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      return isJson ? JSON.parse(text.replace(/```json|```/g, '').trim()) : text;
    } catch (error: any) { throw error; }
  }
  throw new Error("Missing API Keys");
}

async function handleLeadGen(niche: string, location: string, count: number) {
  const prompt = `Generate ${count} real-sounding leads for "${niche}" in "${location}".
  JSON Format: { "leads": [{ "company": "", "website": "", "email": "", "location": "${location}", "category": "${niche}", "summary": "" }] }`;
  return await handleAIRequest(prompt, true);
}

async function handleOutreachGen(lead: any) {
  const prompt = `Generate outreach for ${lead.company} (${lead.category}) in ${lead.location}.
  JSON: { "coldEmail": "", "linkedinDm": "", "shortPitch": "" }`;
  return await handleAIRequest(prompt, true);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { niche, location, count = 10, task = 'leads', lead } = req.body;

    try {
      if (task === 'leads') {
        const data = await handleLeadGen(niche, location, count);
        return res.json({ success: true, leads: data.leads });
      } else if (task === 'outreach' && lead) {
        const data = await handleOutreachGen(lead);
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
    const { niche, location, count = 10 } = req.body;
    try {
      const data = await handleLeadGen(niche, location, count);
      res.json({ success: true, leads: data.leads });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/outreach", async (req, res) => {
    const { lead } = req.body;
    try {
      const data = await handleOutreachGen(lead);
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
