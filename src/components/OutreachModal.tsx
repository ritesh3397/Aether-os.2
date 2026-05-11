import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Wand2, Terminal, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OutreachScripts, Lead } from '../types';
import { cn } from '../lib/utils';

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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-md">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-2xl glass-card !bg-brand-surface shadow-[0_0_80px_-20px_rgba(45,91,255,0.2)] overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 blur-3xl pointer-events-none" />
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group">
                   <Wand2 className="w-5 h-5 text-brand-accent group-hover:rotate-12 transition-transform" />
                </div>
                <div>
                   <h3 className="font-display font-bold text-xl text-white tracking-tight">{lead?.company || 'AI Drafting Agent'}</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                      {lead?.ownerName && (
                        <>
                          <span className="text-[10px] text-brand-accent font-black uppercase tracking-[0.2em]">{lead.ownerName}</span>
                          <span className="text-white/20">•</span>
                        </>
                      )}
                      <Terminal className="w-3 h-3 text-text-secondary" />
                      <span className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-black">Strategic_Payload_Generator</span>
                   </div>
                </div>
             </div>
             <button 
                onClick={onClose}
                className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-text-secondary hover:text-white border border-transparent hover:border-white/10"
             >
               <X className="w-5 h-5" />
             </button>
          </div>

          {/* Controls */}
          <div className="p-8 space-y-8">
            <div className="flex flex-wrap gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit">
              {[
                { id: 'email', label: 'Synthetic Email' },
                { id: 'linkedin', label: 'Tactical DM' },
                { id: 'pitch', label: 'Elevator Flash' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest",
                    activeTab === tab.id 
                      ? "bg-brand-accent text-white glow-accent shadow-xl active:scale-95" 
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-brand-accent/20 to-accent-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />
              <div className="relative min-h-[300px] p-8 glass-card border-white/10 text-sm leading-relaxed text-text-secondary font-medium font-mono CustomScrollbar max-h-[400px] overflow-y-auto">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-[240px] gap-6">
                     <div className="relative w-16 h-16">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                          className="absolute inset-0 border-3 border-brand-accent/10 border-t-brand-accent rounded-full"
                        />
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-brand-accent animate-float" />
                     </div>
                     <div className="space-y-2 text-center">
                        <p className="text-white text-xs font-black uppercase tracking-[0.4em] animate-pulse">Forging Outreach Layer</p>
                        <p className="text-[10px] text-text-secondary/60 animate-pulse">Synchronizing with target context...</p>
                     </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap selection:bg-brand-accent/30 selection:text-white">
                    {getActiveContent() || "Intelligence buffer empty. Re-initialize generation."}
                  </div>
                )}
              </div>
              
              {!isGenerating && scripts && (
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => handleCopy(getActiveContent())}
                    className={cn(
                        "p-3 rounded-xl transition-all border shadow-2xl",
                        copied ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-text-secondary hover:text-white hover:scale-110 active:scale-90"
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-between items-center pt-4">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 glass-card bg-white/5 border-white/5 rounded-lg">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[9px] text-text-secondary font-black uppercase tracking-widest">Context_Safe</span>
                  </div>
                  <div className="text-[10px] text-text-secondary font-bold flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                     Aether AI Analysis Complete
                  </div>
               </div>
               <div className="flex gap-4 w-full sm:w-auto">
                 <button 
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-white transition-all"
                 >
                  Deactivate
                 </button>
                 <button 
                  disabled={isGenerating || !scripts}
                  onClick={() => handleCopy(getActiveContent())}
                  className="flex-1 sm:flex-none bg-white text-black px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-2xl"
                 >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Extract Script'}
                 </button>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
