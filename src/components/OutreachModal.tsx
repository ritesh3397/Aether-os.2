import React, { useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OutreachScripts, Lead } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface OutreachModalProps {
  lead: Lead | null;
  scripts: OutreachScripts | null;
  isOpen: boolean;
  isGenerating: boolean;
  onClose: () => void;
}

export default function OutreachModal({ lead, scripts, isOpen, isGenerating, onClose }: OutreachModalProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'linkedin' | 'pitch'>('email');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    if (!text) return;
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
          className="w-full max-w-xl bg-[#080808] border border-[#1A1A1A] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-6 border-b border-[#1A1A1A] flex justify-between items-center bg-[#0D0D0D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">{lead?.company || 'AI Discovery'}</h3>
                <p className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold">Personalized Outreach Engine</p>
              </div>
            </div>
            <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-[#71717A] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex gap-2 p-1 bg-[#111111] border border-[#1A1A1A] rounded-xl w-fit">
              {[
                { id: 'email', label: 'Cold Email' },
                { id: 'linkedin', label: 'LinkedIn DM' },
                { id: 'pitch', label: 'Elevator Pitch' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 uppercase tracking-tight",
                    activeTab === tab.id 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                      : "text-[#71717A] hover:text-[#A1A1AA]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative group min-h-[200px]">
              <div className="relative h-full p-6 bg-[#0D0D0D] rounded-2xl border border-[#1A1A1A] text-xs leading-relaxed text-[#A1A1AA] font-sans">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-[160px] gap-4">
                     <div className="relative w-10 h-10">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                        />
                        <Sparkles className="absolute inset-0 m-auto w-4 h-4 text-indigo-400 animate-pulse" />
                     </div>
                     <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">Forging Strategy...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {getActiveContent() || "No content generated yet."}
                  </div>
                )}
              </div>
              
              {!isGenerating && scripts && (
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => handleCopy(getActiveContent())}
                    className={cn(
                        "p-2 rounded-lg transition-all border",
                        copied ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-[#111111] border-[#1A1A1A] text-[#71717A] hover:text-white"
                    )}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border border-[#080808] bg-zinc-800" />
                 ))}
                 <div className="pl-4 text-[10px] text-[#71717A] font-medium flex items-center">Verified by Aether AI</div>
               </div>
               <div className="flex gap-3">
                 <button 
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#71717A] hover:text-[#A1A1AA] transition-colors"
                 >
                  Dismiss
                 </button>
                 <button 
                  disabled={isGenerating || !scripts}
                  onClick={() => handleCopy(getActiveContent())}
                  className="bg-white text-black px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#E5E5E5] disabled:opacity-50 transition-all flex items-center gap-2"
                 >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Script
                 </button>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
