import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGenAI, handleOutreachGen } from '../src/lib/ai-logic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { lead } = req.body;

  try {
    const ai = getGenAI();
    const data = await handleOutreachGen(ai, lead);
    return res.status(200).json({ success: true, ...data });
  } catch (error: any) {
    console.error("Vercel Outreach Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
