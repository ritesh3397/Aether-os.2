import { Lead, UserStats } from "../types";

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
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, location, count, task: 'leads' }),
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
      throw new Error(data.error || "Failed to generate leads");
    }

    const leads: Lead[] = (data.leads || []).map((l: any) => ({
      ...l,
      id: Math.random().toString(36).substr(2, 9),
      qualityScore: Math.floor(Math.random() * 20) + 80,
      status: (['verified', 'high-intent', 'unverified'])[Math.floor(Math.random() * 3)] as Lead['status']
    }));

    // Deduct credits
    if (!stats.isSubscribed) {
      stats.remainingCredits -= leads.length;
    }
    stats.totalLeadsFound += leads.length;
    updateUserStats(stats);

    return { leads, success: true };
  } catch (error: any) {
    console.error("Lead generation error:", error);
    return { leads: [], success: false, error: error.message || "Failed to connect to AI engine." };
  }
};
