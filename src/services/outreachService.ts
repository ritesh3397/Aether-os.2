import { Lead, OutreachScripts } from "../types";
import { getUserStats, updateUserStats } from "./leadService";

export const generateOutreach = async (lead: Lead): Promise<OutreachScripts> => {
  try {
    const response = await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to generate outreach scripts");
    }
    
    // Track script generation
    const stats = getUserStats();
    stats.totalScriptsGenerated += 1;
    updateUserStats(stats);
    
    return {
      coldEmail: data.coldEmail,
      linkedinDm: data.linkedinDm,
      shortPitch: data.shortPitch
    };
  } catch (e: any) {
    console.error("Outreach generation error:", e);
    throw new Error(e.message || "Failed to generate personalized scripts.");
  }
};
