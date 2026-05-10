import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGenAI, handleLeadGen } from '../src/lib/ai-logic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { niche, location, count = 10 } = req.body;

  try {
    const data = await handleLeadGen(niche, location, count);
    return res.status(200).json({ success: true, leads: data.leads });
  } catch (error: any) {
    console.error("Vercel Leads Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
