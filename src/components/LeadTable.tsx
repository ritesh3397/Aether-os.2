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

  return (
    <div className="w-full flex flex-col">
      <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-accent glow-accent animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                Intelligence Stream
            </h3>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[8px] font-bold text-text-secondary uppercase tracking-widest px-2 py-1 glass-card border-white/5">Auto_Verified</span>
           <span className="text-[8px] font-bold text-brand-accent uppercase tracking-widest px-2 py-1 glass-card border-brand-accent/20">High_Intent</span>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01] text-text-secondary">
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] w-1/3">Identity</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em]">Vertical</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em]">Geo_Code</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em]">Match_Score</th>
              <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {leads.map((lead, idx) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="hover:bg-white/[0.03] transition-all duration-300 group"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-bold text-white tracking-tight group-hover:text-brand-accent transition-colors">{lead.company}</span>
                      <div className="flex items-center gap-3">
                        {lead.email && (
                            <a href={`mailto:${lead.email}`} className="text-text-secondary/40 hover:text-white transition-colors">
                                <Mail className="w-3.5 h-3.5" />
                            </a>
                        )}
                        {lead.website && (
                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-text-secondary/40 hover:text-white transition-colors">
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                        {lead.instagram && (
                            <a href={lead.instagram} target="_blank" rel="noopener noreferrer" className="text-text-secondary/40 hover:text-instagram transition-colors">
                                <Instagram className="w-3.5 h-3.5" />
                            </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 glass-card bg-brand-accent/5 border-brand-accent/10 rounded-lg text-[10px] text-white font-bold uppercase tracking-wider">
                      {lead.category || 'UNTITLED'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-[11px] text-text-secondary font-medium uppercase tracking-widest">
                       <MapPin className="w-3 h-3 text-brand-accent" />
                       {lead.location}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${lead.qualityScore}%` }}
                                className="h-full bg-brand-accent glow-accent"
                            />
                        </div>
                        <span className="text-[10px] text-white font-mono font-bold">{lead.qualityScore}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button 
                            onClick={() => onGenerateOutreach(lead)}
                            className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Send className="w-3 h-3" />
                            Draft
                        </button>
                        <button 
                            onClick={() => onSaveLead(lead)}
                            className="p-2.5 text-text-secondary/40 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10"
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
