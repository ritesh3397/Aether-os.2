import { Lead, OutreachScripts } from "../types";
import { getUserStats, updateUserStats } from "./leadService";

export const generateOutreach = async (lead: Lead): Promise<OutreachScripts> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead, task: 'outreach' }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Server returned ${response.status}: ${errorText.slice(0, 100)}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error("Server returned an invalid response format (not JSON).");
    }

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
      followUp: data.followUp
    };
  } catch (e: any) {
    console.error("Outreach generation error:", e);
    throw new Error(e.message || "Failed to generate personalized scripts.");
  }
};
