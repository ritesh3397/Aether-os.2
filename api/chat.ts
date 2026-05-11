import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

// AI Logic Inlined for Vercel Deployment Reliability
async function handleAIRequest(prompt: string, isJson: boolean = true) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  console.log('Vercel Execution - Starting AI request. OpenRouter:', !!openRouterKey, 'Gemini:', !!geminiKey);

  if (openRouterKey) {
    try {
      console.log('Attempting OpenRouter call...');
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://google.aistudio.com",
          "X-Title": "Aether Lead Gen"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: prompt }],
          response_format: isJson ? { type: "json_object" } : undefined
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error:', errorText);
        throw new Error(`OpenRouter returned ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty response from OpenRouter");
      
      return isJson ? JSON.parse(text.replace(/```json|```/g, '').trim()) : text;
    } catch (error: any) {
      console.error('OpenRouter failed:', error.message);
      if (!geminiKey) throw error;
      console.log('Falling back to Gemini...');
    }
  }

  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: isJson ? "application/json" : "text/plain",
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      return isJson ? JSON.parse(text.replace(/```json|```/g, '').trim()) : text;
    } catch (error: any) {
      console.error('Gemini failed:', error.message);
      throw error;
    }
  }

  throw new Error("Missing AI API Keys (OPENROUTER_API_KEY or GEMINI_API_KEY)");
}

async function handleLeadGen(niche: string, location: string, count: number) {
  const systemPrompt = `You are an advanced lead generation AI system.
Your job is to generate HIGH-QUALITY, RELEVANT, and REALISTIC business leads.

STRICT RULES:
- Never generate fake emails
- Never generate fake websites
- Never hallucinate obviously fake companies
- If exact contact data is unavailable, return empty string instead
- Prefer real publicly-known businesses
- Return only clean structured JSON
- No extra text

INPUT:
- niche: ${niche}
- location: ${location}
- numberOfLeads: ${count}

OUTPUT FORMAT:
{
  "leads": [
    {
      "company": "",
      "ownerName": "",
      "website": "",
      "email": "",
      "instagram": "",
      "location": "",
      "category": "",
      "summary": ""
    }
  ]
}
STRICTLY RETURN JSON ONLY.`;

  return await handleAIRequest(systemPrompt, true);
}

async function handleOutreachGen(lead: any) {
  const prompt = `Generate a high-conversion outreach strategy for "${lead.company}" (Owner: ${lead.ownerName || 'Unknown'}) in the "${lead.category}" niche based in ${lead.location}.
Summary: ${lead.summary}

Format:
{
  "coldEmail": "subject and body",
  "linkedinDm": "short personalizada dm (max 200 chars)",
  "shortPitch": "2-sentence elevator pitch"
}
STRICTLY RETURN JSON ONLY.`;

  return await handleAIRequest(prompt, true);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { niche, location, count = 10, task = 'leads', lead } = req.body;

  try {
    console.log(`Vercel API handling task: ${task}`);
    console.log(`Request parameters - niche: ${niche}, location: ${location}, count: ${count}`);
    if (lead) console.log(`Lead context: ${lead.company}`);

    if (task === 'leads') {
      const data = await handleLeadGen(niche, location, count);
      console.log(`Leads success: ${data.leads?.length || 0}`);
      return res.status(200).json({ success: true, leads: data.leads });
    } else if (task === 'outreach' && lead) {
      const data = await handleOutreachGen(lead);
      console.log(`Outreach success`);
      return res.status(200).json({ success: true, ...data });
    } else {
      console.warn("Invalid task or missing lead data in request body");
      return res.status(400).json({ success: false, error: "Invalid task or missing lead data" });
    }
  } catch (error: any) {
    console.error("Vercel API Execution Crash:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
