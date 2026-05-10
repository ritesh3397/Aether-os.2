import { GoogleGenAI } from "@google/genai";
import { Lead, OutreachScripts } from "./types";
import { getUserStats, updateUserStats } from "./leadService";

const getGenAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'undefined') {
    throw new Error('Gemini API Key is missing.');
  }
  return new GoogleGenAI(apiKey);
};

export const generateOutreach = async (lead: Lead): Promise<OutreachScripts> => {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  
  try {
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleanJson);
    
    // Track script generation
    const stats = getUserStats();
    stats.totalScriptsGenerated += 1;
    updateUserStats(stats);
    
    return data;
  } catch (e) {
    throw new Error("Failed to generate personalized scripts.");
  }
};
