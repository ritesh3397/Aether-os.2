export interface Lead {
  id: string;
  company: string;
  website: string;
  email: string;
  instagram: string;
  location: string;
  category: string;
  summary: string;
  qualityScore: number;
}

export interface UserStats {
  remainingCredits: number;
  totalLeadsFound: number;
  isSubscribed: boolean;
  totalScriptsGenerated: number;
}

export interface OutreachScripts {
  coldEmail: string;
  linkedinDm: string;
  shortPitch: string;
}

export type View = 'dashboard' | 'search' | 'saved' | 'settings' | 'billing';
