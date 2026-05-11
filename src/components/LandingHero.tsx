import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Shield, Zap, Globe, Layers } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export default function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Cinematic Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mixed-blend-overlay" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Intelligence Layer v2.0</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-display font-extrabold tracking-tight text-gradient leading-[1.05]">
            The Intelligence Layer <br /> for Global Outreach.
          </h1>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-sans">
            AetherOS automates the entire lead lifecycle with cinematic precision. 
            Find, engage, and convert leads at the speed of thought.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-brand-accent text-white font-bold rounded-2xl glow-accent hover:scale-[1.02] transition-all flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10">Initialize Workspace</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
          
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-bold rounded-2xl transition-all">
            Watch Architecture
          </button>
        </motion.div>

        {/* Floating Panels Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative pt-12"
        >
          <div className="relative group mx-auto max-w-4xl">
             <div className="absolute -inset-1 bg-linear-to-r from-brand-accent to-accent-secondary rounded-[2.5rem] opacity-20 blur-2xl group-hover:opacity-30 transition duration-1000" />
             <div className="relative glass-card border-white/10 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                   </div>
                   <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Aether_System_UI</div>
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-black/40">
                   <div className="col-span-1 h-64 bg-white/5 animate-pulse rounded-lg" />
                   <div className="col-span-2 h-64 bg-white/5 animate-pulse rounded-lg" style={{ animationDelay: '1s' }} />
                </div>
             </div>
             
             {/* Floating elements around the preview */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute -top-12 -right-8 glass-card p-4 shadow-2xl hidden md:block"
             >
                <Zap className="w-5 h-5 text-brand-accent mb-2" />
                <div className="h-1 w-12 bg-white/20 rounded-full" />
             </motion.div>

             <motion.div 
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 5, repeat: Infinity }}
               className="absolute top-32 -left-12 glass-card p-4 shadow-2xl hidden md:block"
             >
                <Shield className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="h-1 w-12 bg-white/20 rounded-full" />
             </motion.div>
          </div>
        </motion.div>

        {/* Feature Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-24 text-left">
           <FeatureCard 
             icon={<Globe className="w-6 h-6 text-brand-accent" />}
             title="Precise Global Reach"
             description="Deep-scan target markets with unparalleled granularity across 180+ regions."
           />
           <FeatureCard 
             icon={<Sparkles className="w-6 h-6 text-accent-secondary" />}
             title="AI Outreach Forge"
             description="Every script is unique, context-aware, and optimized for maximum conversion."
           />
           <FeatureCard 
             icon={<Layers className="w-6 h-6 text-text-primary" />}
             title="Enterprise Stack"
             description="Built for scale. Manage 10k+ leads with a fluid, high-performance interface."
           />
        </div>
      </div>

      {/* Footer link style */}
      <div className="absolute bottom-12 text-text-secondary text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
        Engineered with Aether Core Tech
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 glass-card hover:border-white/20 hover:scale-[1.02] transition-all group">
      <div className="mb-6 p-3 bg-white/5 rounded-2xl w-fit group-hover:glow-accent transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
