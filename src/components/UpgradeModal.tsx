import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Zap, Star, Shield, Layers, Sparkles } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-xl glass-card !bg-brand-surface border-white/10 shadow-[0_0_100px_-20px_rgba(139,92,246,0.3)] overflow-hidden"
          >
            {/* Header with glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-secondary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-white/5 rounded-xl text-text-secondary hover:text-white transition-all border border-transparent hover:border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-10 relative z-10">
              <div className="flex flex-col items-center text-center gap-6 mb-12">
                <div className="w-16 h-16 bg-accent-secondary/10 rounded-2xl flex items-center justify-center border border-accent-secondary/20 glow-violet rotate-6">
                  <Star className="w-8 h-8 text-accent-secondary" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-display font-extrabold text-white tracking-tight leading-tight">Expansion Protocol</h2>
                  <p className="text-text-secondary text-sm font-medium max-w-sm">Evolve your outreach system with unbounded computational power.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-10">
                {[
                  { icon: Zap, label: "Unlimited Lead Extraction", desc: "No daily credit lockdowns" },
                  { icon: Layers, label: "Deep Core Intelligence", desc: "Access to advanced Reasoning models" },
                  { icon: Shield, label: "Priority Infrastructure", desc: "Server bypass during peak hours" },
                  { icon: Sparkles, label: "Strategic Exports", desc: "Unlock unlimited CSV buffer" }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-5 p-4 glass-card bg-white/[0.03] border-white/5 hover:border-accent-secondary/20 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white group-hover:text-accent-secondary transition-colors">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black uppercase tracking-widest text-white">{feature.label}</p>
                       <p className="text-[10px] text-text-secondary font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card p-8 bg-white/[0.02] border-white/10 mb-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-accent-secondary to-brand-accent group-hover:scale-x-110 transition-transform duration-700" />
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-black text-white tracking-tighter">$49</span>
                      <span className="text-text-secondary text-[10px] font-black uppercase tracking-widest">/ Month</span>
                    </div>
                    <p className="text-[8px] text-text-secondary/60 mt-1 uppercase font-black tracking-widest">Cancel anytime • Instant activation</p>
                  </div>
                  <div className="text-right">
                     <span className="text-[9px] font-black text-accent-secondary bg-accent-secondary/10 px-3 py-1.5 rounded-lg border border-accent-secondary/20 uppercase tracking-[0.2em] glow-violet">Enterprise_Ready</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onUpgrade}
                className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                Initiate Upgrade Sequence
                <Zap className="w-4 h-4 fill-black" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
