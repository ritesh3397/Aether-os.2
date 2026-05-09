import React from 'react';
import { LayoutDashboard, Search, Bookmark, Settings, CreditCard, LogOut, Zap, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { View } from '@/src/types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as View, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'search' as View, icon: Search, label: 'Lead Search' },
    { id: 'saved' as View, icon: Bookmark, label: 'Saved Leads' },
    { id: 'billing' as View, icon: CreditCard, label: 'Subscription' },
    { id: 'settings' as View, icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-60 border-r border-brand-border bg-[#080808] flex flex-col h-screen fixed left-0 top-0 z-[70] font-sans transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-accent rounded-md flex items-center justify-center font-bold text-[10px] text-white">Æ</div>
              <span className="text-lg font-semibold tracking-tight text-white font-display">AetherOS</span>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-[#111111] rounded-md">
              <X className="w-4 h-4 text-[#71717A]" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium",
                  currentView === item.id
                    ? "bg-brand-accent/10 text-brand-accent"
                    : "text-[#A1A1AA] hover:bg-[#111111] hover:text-white"
                )}
              >
                <item.icon className={cn("w-4 h-4", currentView === item.id ? "text-brand-accent" : "opacity-50")} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-brand-border">
          <div className="mb-6">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#71717A] mb-2 font-bold">
              <span>Credits Used</span>
              <span className="hidden sm:inline">1,284 / 5,000</span>
              <span className="sm:hidden">1.2k/5k</span>
            </div>
            <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[25.6%]" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-sm" />
            <div className="text-[11px]">
              <p className="font-semibold text-white">Founder Account</p>
              <p className="text-[#71717A]">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
