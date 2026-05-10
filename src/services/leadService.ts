import { GoogleGenAI } from "@google/genai";
import { Lead, UserStats } from "./types";

const INITIAL_CREDITS = 50;

export const getUserStats = (): UserStats => {
  const stored = localStorage.getItem('aether_user_stats');
  if (stored) return JSON.parse(stored);
  
  const initial: UserStats = {
    remainingCredits: INITIAL_CREDITS,
    totalLeadsFound: 0,
    isSubscribed: false,
    totalScriptsGenerated: 0
  };
  localStorage.setItem('aether_user_stats', JSON.stringify(initial));
  return initial;
};

export const updateUserStats = (stats: UserStats) => {
  localStorage.setItem('aether_user_stats', JSON.stringify(stats));
};

const getGenAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error('Gemini API Key is missing. Please set GEMINI_API_KEY environment variable.');
  }
  return new GoogleGenAI(apiKey);
};

export const generateLeads = async (
  niche: string, 
  location: string, 
  count: number = 10
): Promise<{ leads: Lead[]; success: boolean; error?: string }> => {
  const stats = getUserStats();
  
  if (stats.remainingCredits < count && !stats.isSubscribed) {
    return { leads: [], success: false, error: 'Insufficient credits. Please upgrade to continue.' };
  }

  try {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

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

Before returning results internally verify:
1. Does the business sound real?
2. Does the website look valid?
3. Is the lead niche-relevant?
4. Is formatting correct?
5. Is the lead non-duplicate?

If uncertain:
- return empty string
- never invent random data

OUTPUT ONLY VALID JSON.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON from response
    try {
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const data = JSON.parse(cleanJson);
      const leads: Lead[] = (data.leads || []).map((l: any) => ({
        ...l,
        id: Math.random().toString(36).substr(2, 9),
        qualityScore: Math.floor(Math.random() * 20) + 80 // AI verification simulation
      }));

      // Deduct credits
      if (!stats.isSubscribed) {
        stats.remainingCredits -= leads.length;
      }
      stats.totalLeadsFound += leads.length;
      updateUserStats(stats);

      return { leads, success: true };
    } catch (e) {
      console.error("Failed to parse AI response:", text);
      return { leads: [], success: false, error: "AI response formatting error. Please try again." };
    }
  } catch (error: any) {
    console.error("Lead generation error:", error);
    return { leads: [], success: false, error: error.message || "Failed to connect to AI engine." };
  }
};
