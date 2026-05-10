import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGenAI, handleLeadGen, handleOutreachGen } from '../src/lib/ai-logic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { niche, location, count = 10, task = 'leads', lead } = req.body;

  try {
    const ai = getGenAI();

    if (task === 'leads') {
      const data = await handleLeadGen(ai, niche, location, count);
      return res.status(200).json({ success: true, leads: data.leads });
    } else if (task === 'outreach' && lead) {
      const data = await handleOutreachGen(ai, lead);
      return res.status(200).json({ success: true, ...data });
    } else {
      return res.status(400).json({ success: false, error: "Invalid task or missing lead data" });
    }
  } catch (error: any) {
    console.error("Vercel AI Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
