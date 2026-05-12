export interface Lead {
  id: string;
  company: string;
  ownerName?: string;
  website: string;
  email: string;
  instagram: string;
  location: string;
  category: string;
  summary: string;
  qualityScore: number;
  status: 'verified' | 'unverified' | 'contacted' | 'high-intent';
  outreach?: OutreachScripts;
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
  followUp: string;
}

export type View = 'dashboard' | 'search' | 'saved' | 'settings' | 'billing';
