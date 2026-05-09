export interface Lead {
  id: string;
  name: string;
  niche: string;
  location: string;
  website: string;
  email: string;
  linkedin: string;
  status: 'new' | 'contacted' | 'interested' | 'rejected';
  qualityScore: number;
}

export interface OutreachScripts {
  coldEmail: string;
  linkedinDm: string;
  shortPitch: string;
}

export type View = 'dashboard' | 'search' | 'saved' | 'settings' | 'billing';
