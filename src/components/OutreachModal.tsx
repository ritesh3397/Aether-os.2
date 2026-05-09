import React, { useState } from 'react';
import { X, Copy, Check, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OutreachScripts, Lead } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface OutreachModalProps {
  lead: Lead | null;
  scripts: OutreachScripts | null;
  isLoading: boolean;
  onClose: () => void;
}

export default function OutreachModal({ lead, scripts, isLoading, onClose }: OutreachModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'linkedin' | 'pitch'>('email');
  const [copied, setCopied] = useState(false);

  if (!lead && !isLoading) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveContent = () => {
    if (!scripts) return '';
    switch (activeTab) {
      case 'email': return scripts.coldEmail;
      case 'linkedin': return scripts.linkedinDm;
      case 'pitch': return scripts.shortPitch;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="w-full max-w-xl bg-[#080808] border border-brand-border rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-brand-border flex justify-between items-center bg-[#0D0D0D]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-[10px] text-white">✨</div>
              <div>
                <h3 className="font-display font-semibold text-base text-white">AI Strategy Generation</h3>
                <p className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold">{lead?.name}</p>
              </div>
            </div>
            <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-zinc-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex gap-2 p-1 bg-[#111111] border border-brand-border rounded-xl w-fit">
              {[
                { id: 'email', label: 'Cold Email' },
                { id: 'linkedin', label: 'LinkedIn DM' },
                { id: 'pitch', label: 'Short Pitch' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200",
                    activeTab === tab.id 
                      ? "bg-brand-accent text-white shadow-sm" 
                      : "text-[#71717A] hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative group min-h-[240px]">
              <div className="absolute -inset-0.5 bg-brand-accent/10 rounded-2xl blur-lg transition-all duration-1000 group-hover:bg-brand-accent/20" />
              <div className="relative h-full p-5 bg-[#0D0D0D] rounded-2xl border border-brand-border/50 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-zinc-300">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[200px] gap-3">
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full"
                     />
                     <span className="text-brand-accent text-[10px] font-bold uppercase tracking-widest animate-pulse">Analyzing Lead Intent</span>
                  </div>
                ) : (
                  getActiveContent()
                )}
              </div>
              
              {!isLoading && scripts && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleCopy(getActiveContent())}
                    className="p-2 bg-[#111111] hover:bg-[#1A1A1A] rounded-lg text-zinc-100 transition-colors border border-brand-border"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
               <button 
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold text-[#71717A] hover:text-white transition-colors"
               >
                Close
               </button>
               <button 
                disabled={isLoading || !scripts}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-accent text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-accent/20 hover:brightness-110 disabled:opacity-50 transition-all"
               >
                Copy Full Strategy
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
