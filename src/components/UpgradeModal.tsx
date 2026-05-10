import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Zap, Star, Shield } from 'lucide-react';

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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#27272A] rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-[#71717A] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/20">
                  <Zap className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Upgrade to Pro</h2>
                  <p className="text-sm text-[#71717A]">Scale your lead generation efforts</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "Unlimited high-intent leads",
                  "AI Search Grounding with Maps",
                  "Advanced personalization engine",
                  "Bulk CSV Export",
                  "Priority support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[#E5E5E5]">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="bg-[#161618] border border-[#27272A] rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-3xl font-bold text-white">$49</span>
                    <span className="text-[#A1A1AA] text-sm">/month</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-md">Save 20% yearly</span>
                </div>
                <p className="text-xs text-[#71717A]">Cancel anytime. 7-day money-back guarantee.</p>
              </div>

              <button
                onClick={onUpgrade}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                Start Free Trial
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
