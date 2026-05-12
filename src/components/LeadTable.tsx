import React from 'react';
import { ExternalLink, Mail, Instagram, Bookmark, Sparkles, MapPin, Target, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead } from '../types';
import { cn } from '../lib/utils';

interface LeadTableProps {
  leads: Lead[];
  onGenerateOutreach: (lead: Lead) => void;
  onSaveLead: (lead: Lead) => void;
}

export default function LeadTable({ leads, onGenerateOutreach, onSaveLead }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="w-full p-20 text-center glass-card border-white/5 bg-white/[0.02]">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
          <Target className="w-8 h-8 text-text-secondary/40" />
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">No Active Prospects</h3>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">Initialize a scan to populate the intelligence buffer with target leads.</p>
      </div>
    );
  }

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest leading-none">Verified_IO</span>;
      case 'high-intent':
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-[8px] font-black uppercase tracking-widest leading-none">High_Intent</span>;
      case 'contacted':
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 text-text-secondary border border-white/10 text-[8px] font-black uppercase tracking-widest leading-none">Contacted</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 text-text-secondary/40 border border-white/5 text-[8px] font-black uppercase tracking-widest leading-none">Discovery</span>;
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-text-secondary">
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] w-[25%]">Business_Identity</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] w-[15%]">Key_Node</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] w-[12%]">Status</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] w-[15%]">Vertical</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] w-[13%]">Geo_Loc</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] w-[10%] text-center">Score</th>
              <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {leads.map((lead, idx) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-white/[0.03] transition-all duration-300 group cursor-default"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <span className="text-[13px] font-bold text-white tracking-tight group-hover:text-brand-accent transition-colors truncate">{lead.company}</span>
                      <div className="flex items-center gap-2.5">
                        {lead.website && (
                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-text-secondary/30 hover:text-white transition-colors">
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                        {lead.email && (
                            <a href={`mailto:${lead.email}`} className="text-text-secondary/30 hover:text-white transition-colors">
                                <Mail className="w-3 h-3" />
                            </a>
                        )}
                        {lead.instagram && (
                            <a href={lead.instagram} target="_blank" rel="noopener noreferrer" className="text-text-secondary/30 hover:text-instagram transition-colors">
                                <Instagram className="w-3 h-3" />
                            </a>
                        )}
                        <span className="text-[10px] text-text-secondary/20 font-mono truncate">{lead.website.replace('https://', '')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-white tracking-tight">{lead.ownerName || 'Unknown_Node'}</span>
                       <span className="text-[9px] text-text-secondary font-black uppercase tracking-widest opacity-40">Decision_Maker</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider truncate block">
                      {lead.category || 'UNTITLED'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[10px] text-text-secondary font-medium uppercase tracking-widest truncate">
                       <MapPin className="w-2.5 h-2.5 text-brand-accent/50" />
                       {lead.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                        "text-[11px] font-mono font-black",
                        lead.qualityScore >= 90 ? "text-brand-accent glow-accent" : lead.qualityScore >= 80 ? "text-white" : "text-text-secondary"
                    )}>
                        {lead.qualityScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button 
                            onClick={() => onGenerateOutreach(lead)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-brand-accent text-white rounded-lg text-[9px] font-black uppercase tracking-widest glow-accent hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            <Send className="w-3 h-3" />
                            Outreach
                        </button>
                        <button 
                            onClick={() => onSaveLead(lead)}
                            title="Save Lead"
                            className="p-2 text-text-secondary/40 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-white/10"
                        >
                            <Bookmark className="w-3.5 h-3.5" />
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
