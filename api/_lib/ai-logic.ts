import { GoogleGenAI } from "@google/genai";

export const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined in environment variables');
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error('Failed to initialize GoogleGenAI:', error);
    return null;
  }
};

export async function handleAIRequest(prompt: string, isJson: boolean = true) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  console.log('Starting AI request. OpenRouter:', !!openRouterKey, 'Gemini:', !!geminiKey);

  // Try OpenRouter first if key is available
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
          model: "google/gemini-2.0-flash-001", // Default good model on OpenRouter
          messages: [{ role: "user", content: prompt }],
          response_format: isJson ? { type: "json_object" } : undefined
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter error response:', errorText);
        throw new Error(`OpenRouter returned ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      console.log('OpenRouter success');
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty response from OpenRouter");
      
      return isJson ? JSON.parse(text.replace(/```json|```/g, '').trim()) : text;
    } catch (error: any) {
      console.error('OpenRouter failed:', error.message);
      if (!geminiKey) throw error;
      console.log('Falling back to Gemini...');
    }
  }

  // Fallback to Gemini
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
      console.log('Gemini success');
      return isJson ? JSON.parse(text.replace(/```json|```/g, '').trim()) : text;
    } catch (error: any) {
      console.error('Gemini failed:', error.message);
      throw error;
    }
  }

  throw new Error("No AI API keys configured (GEMINI_API_KEY or OPENROUTER_API_KEY)");
}

export async function handleLeadGen(niche: string, location: string, count: number) {
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

  const result = await handleAIRequest(systemPrompt, true);
  return result;
}

export async function handleOutreachGen(lead: any) {
  const prompt = `Generate a high-conversion, professional outreach strategy for a business called "${lead.company}" in the "${lead.category}" niche based in ${lead.location}.
Company Summary: ${lead.summary}

Generate three distinct scripts in JSON format:
{
  "coldEmail": "subject and body",
  "linkedinDm": "short personalized dm",
  "shortPitch": "2-sentence elevator pitch"
}

Keep it professional, high-intent, and focused on value. Use placeholders like [Your Name].`;

  const result = await handleAIRequest(prompt, true);
  return result;
}
