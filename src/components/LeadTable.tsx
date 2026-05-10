import React from 'react';
import { ExternalLink, Mail, Instagram, Bookmark, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface LeadTableProps {
  leads: Lead[];
  onGenerateOutreach: (lead: Lead) => void;
  onSaveLead: (lead: Lead) => void;
}

export default function LeadTable({ leads, onGenerateOutreach, onSaveLead }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="w-full bg-[#0D0D0D] border border-brand-border rounded-2xl p-12 text-center">
        <div className="w-12 h-12 bg-[#161618] rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#27272A]">
          <Bookmark className="w-6 h-6 text-[#3F3F46]" />
        </div>
        <h3 className="text-sm font-semibold text-white mb-1">No leads found</h3>
        <p className="text-xs text-[#71717A]">Try a different niche or location to discover more prospects.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-[#0D0D0D] border border-brand-border rounded-2xl flex flex-col">
      <div className="p-4 border-b border-brand-border bg-[#0F0F0F] flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Active Discovery Results
        </h3>
        <span className="text-[10px] text-indigo-400 bg-indigo-400/5 px-2 py-1 rounded border border-indigo-500/10 font-bold uppercase tracking-tight">AI Verified</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-[#080808] text-[#71717A]">
              <th className="px-6 py-4 font-bold uppercase tracking-widest">Company</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest">Score</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-right">Outreach</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            <AnimatePresence>
              {leads.map((lead, idx) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-[#141414] transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#E5E5E5] tracking-tight">{lead.company}</span>
                      <div className="flex items-center gap-2 mt-1">
                        {lead.email && (
                            <a href={`mailto:${lead.email}`} className="text-[#71717A] hover:text-white transition-colors">
                                <Mail className="w-3 h-3" />
                            </a>
                        )}
                        {lead.website && (
                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-[#71717A] hover:text-white transition-colors">
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                        {lead.instagram && (
                            <a href={lead.instagram} target="_blank" rel="noopener noreferrer" className="text-[#71717A] hover:text-white transition-colors">
                                <Instagram className="w-3 h-3" />
                            </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-[#111111] border border-[#27272A] rounded text-[9px] text-[#A1A1AA] font-bold uppercase tracking-wider">
                      {lead.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[11px] text-[#A1A1AA] font-medium">
                    {lead.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 font-mono">
                        <div className="w-8 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500"
                                style={{ width: `${lead.qualityScore}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-indigo-400 font-bold">{lead.qualityScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onGenerateOutreach(lead)}
                            className="text-white bg-[#1A1A1A] px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-brand-accent transition-all"
                        >
                            Draft
                        </button>
                        <button 
                            onClick={() => onSaveLead(lead)}
                            className="p-1.5 text-[#3F3F46] hover:text-white transition-colors"
                        >
                            <Bookmark className="w-4 h-4" />
                        </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
