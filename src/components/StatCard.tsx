import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

export default function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0D0D0D] border border-brand-border p-5 rounded-xl flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="p-2 bg-brand-accent/10 rounded-lg">
          <Icon className="w-4 h-4 text-brand-accent" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-[#71717A] text-[10px] uppercase tracking-widest font-bold mb-1">{label}</div>
        <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold text-white tracking-tight">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}
