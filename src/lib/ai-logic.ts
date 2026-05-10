import { GoogleGenAI } from "@google/genai";

export const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  return new GoogleGenAI({ apiKey });
};

export async function handleLeadGen(ai: any, niche: string, location: string, count: number) {
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

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: systemPrompt,
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  const cleanJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
}

export async function handleOutreachGen(ai: any, lead: any) {
  const prompt = `Generate a high-conversion, professional outreach strategy for a business called "${lead.company}" in the "${lead.category}" niche based in ${lead.location}.
Company Summary: ${lead.summary}

Generate three distinct scripts in JSON format:
{
  "coldEmail": "subject and body",
  "linkedinDm": "short personalized dm",
  "shortPitch": "2-sentence elevator pitch"
}

Keep it professional, high-intent, and focused on value. Use placeholders like [Your Name].`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  const cleanJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
}
