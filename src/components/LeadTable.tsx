import React from 'react';
import { ExternalLink, Mail, Linkedin, MoreHorizontal, Sparkles, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface LeadTableProps {
  leads: Lead[];
  onGenerateOutreach: (lead: Lead) => void;
  onSaveLead: (lead: Lead) => void;
}

export default function LeadTable({ leads, onGenerateOutreach, onSaveLead }: LeadTableProps) {
  return (
    <div className="w-full overflow-hidden bg-[#0D0D0D] border border-brand-border rounded-2xl flex flex-col">
      <div className="p-4 border-b border-brand-border bg-[#0F0F0F] flex justify-between items-center">
        <h3 className="text-sm font-semibold text-white">Active Results</h3>
        <span className="text-[10px] text-[#71717A] bg-[#1A1A1A] px-2 py-1 rounded font-bold uppercase tracking-tight">Real-time stream</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-border bg-[#080808] text-[#71717A]">
              <th className="px-6 py-4 font-bold uppercase tracking-widest">Lead Name</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest">Contact Info</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest">Quality</th>
              <th className="px-6 py-4 font-bold uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            <AnimatePresence>
              {leads.map((lead, idx) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-[#141414] transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{lead.name}</span>
                      <span className="text-[10px] text-[#71717A] font-medium">{lead.niche} • {lead.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <a href={`mailto:${lead.email}`} className="text-[#A1A1AA] hover:text-brand-accent transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                        </a>
                        <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-brand-accent transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={cn(
                        "inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border",
                        lead.qualityScore > 80 ? "text-emerald-400 bg-emerald-400/5 border-emerald-500/20" : 
                        lead.qualityScore > 60 ? "text-amber-400 bg-amber-400/5 border-amber-500/20" : "text-rose-400 bg-rose-400/5 border-rose-500/20"
                    )}>
                        {lead.qualityScore}% Match
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onGenerateOutreach(lead)}
                            className="text-brand-accent font-bold hover:underline transition-all"
                        >
                            Gen Script
                        </button>
                        <button 
                            onClick={() => onSaveLead(lead)}
                            className="text-[#3F3F46] hover:text-white transition-colors"
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
