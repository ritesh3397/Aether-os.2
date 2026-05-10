import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleLeadGen, handleOutreachGen } from './_lib/ai-logic';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { niche, location, count = 10, task = 'leads', lead } = req.body;

  try {
    console.log(`Vercel API handling task: ${task}`);
    console.log(`Request parameters - niche: ${niche}, location: ${location}, count: ${count}`);
    if (lead) console.log(`Lead context: ${lead.company}`);

    if (task === 'leads') {
      const data = await handleLeadGen(niche, location, count);
      console.log(`Lead generation success: ${data.leads?.length || 0} leads found`);
      return res.status(200).json({ success: true, leads: data.leads });
    } else if (task === 'outreach' && lead) {
      const data = await handleOutreachGen(lead);
      console.log(`Outreach generation success`);
      return res.status(200).json({ success: true, ...data });
    } else {
      console.warn("Invalid task or missing lead data in request body");
      return res.status(400).json({ success: false, error: "Invalid task or missing lead data" });
    }
  } catch (error: any) {
    console.error("Vercel API Execution Crash:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
