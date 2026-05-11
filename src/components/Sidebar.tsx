import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Bookmark, 
  Settings, 
  CreditCard,
  X,
  Zap,
  Globe,
  Layers,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { View, UserStats } from '../types';
import { getUserStats } from '../services/leadService';
import { motion } from 'motion/react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const loadStats = () => setStats(getUserStats());
    loadStats();
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'dashboard' as View, label: 'Control Center', icon: Layers },
    { id: 'search' as View, label: 'Lead Scan', icon: Globe },
    { id: 'saved' as View, label: 'Vault', icon: Bookmark },
    { id: 'billing' as View, label: 'Subscription', icon: CreditCard },
    { id: 'settings' as View, label: 'CoreConfig', icon: Settings },
  ];

  const creditPercentage = stats ? (stats.remainingCredits / 50) * 100 : 0;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[50] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-[60] w-64 glass-card !rounded-none !border-y-0 !border-l-0 transition-transform duration-500 lg:translate-x-0 bg-brand-bg/80 shadow-2xl overflow-hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full relative">
          {/* Subtle logo glow */}
          <div className="absolute top-0 left-0 w-full h-64 bg-brand-accent/5 blur-[100px] pointer-events-none" />

          {/* Logo Section */}
          <div className="p-8 border-b border-brand-border relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onViewChange('dashboard')}>
                <div className="relative">
                   <div className="absolute -inset-2 bg-brand-accent rounded-xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
                   <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500 font-display font-black text-xl">
                     Æ
                   </div>
                </div>
                <div>
                  <h1 className="text-xl font-display font-extrabold tracking-tighter text-white">AetherOS</h1>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-text-secondary opacity-50">Intelligence.v2</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-text-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-brand-accent/10 border border-brand-accent/20 text-white" 
                      : "text-text-secondary hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-brand-accent" : "text-text-secondary group-hover:text-white"
                    )} />
                    <span className={cn(
                      "text-[10px] uppercase font-black tracking-[0.2em]",
                      isActive ? "text-white" : "text-text-secondary group-hover:text-white"
                    )}>
                      {item.label}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="w-1 h-1 rounded-full bg-brand-accent glow-accent"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer User Panel */}
          <div className="p-6 border-t border-brand-border relative z-10">
            <div className="p-5 glass-card bg-white/5 border-white/10 space-y-5 group overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-brand-accent/40 to-transparent" />
               
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-text-secondary">Network Status</span>
                    <div className="flex gap-1">
                       <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                 </div>
                 
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats?.isSubscribed ? 100 : creditPercentage}%` }}
                      className={cn("h-full", stats?.isSubscribed ? "bg-brand-accent" : "bg-white/40")} 
                    />
                 </div>
                 <div className="flex justify-between text-[7px] font-black uppercase tracking-widest text-text-secondary/60">
                    <span>{stats?.isSubscribed ? 'Unlimited Access' : 'Credit Pool'}</span>
                    <span>{stats?.isSubscribed ? 'PRO' : `${stats?.remainingCredits || 0}/50`}</span>
                 </div>
               </div>
               
               <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-text-secondary font-bold text-[10px]">
                    {stats?.totalLeadsFound || 0}
                  </div>
                  <div className="flex-1 min-w-0">
                     <p className="text-[10px] font-bold text-white truncate">Founder_Entity</p>
                     <p className="text-[8px] font-medium text-brand-accent uppercase tracking-widest">
                       {stats?.isSubscribed ? 'Pro Node Active' : 'Free Explorer'}
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
