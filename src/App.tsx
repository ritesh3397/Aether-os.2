/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Bookmark, 
  Download, 
  TrendingUp, 
  Search as SearchIcon,
  Filter,
  RefreshCw,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import LeadTable from './components/LeadTable';
import OutreachModal from './components/OutreachModal';
import { Lead, OutreachScripts, View } from './types';
import { cn } from './lib/utils';

// Mock initial data
const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'FitFlow Gyms', niche: 'Fitness', location: 'Mumbai, MH', website: 'https://fitflow.in', email: 'hello@fitflow.in', linkedin: 'https://linkedin.com/company/fitflow', status: 'new', qualityScore: 94 },
  { id: '2', name: 'TechSpire Solutions', niche: 'SaaS', location: 'Bangalore, KA', website: 'https://techspire.io', email: 'info@techspire.io', linkedin: 'https://linkedin.com/company/techspire', status: 'new', qualityScore: 88 },
  { id: '3', name: 'GreenRoots Organic', niche: 'Retail', location: 'Pune, MH', website: 'https://greenroots.com', email: 'sales@greenroots.com', linkedin: 'https://linkedin.com/company/greenroots', status: 'new', qualityScore: 72 },
  { id: '4', name: 'CloudScale Systems', niche: 'IT Services', location: 'Hyderabad, TS', website: 'https://cloudscale.tech', email: 'connect@cloudscale.tech', linkedin: 'https://linkedin.com/company/cloudscale', status: 'new', qualityScore: 91 },
  { id: '5', name: 'DineDash Delivery', niche: 'Logistics', location: 'Delhi, DL', website: 'https://dinedash.app', email: 'biz@dinedash.app', linkedin: 'https://linkedin.com/company/dinedash', status: 'new', qualityScore: 65 },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [outreachScripts, setOutreachScripts] = useState<OutreachScripts | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize Gemini safely
  const getGenAI = () => {
    const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'undefined') {
      throw new Error('Gemini API Key is missing. Please set GEMINI_API_KEY environment variable.');
    }
    return new GoogleGenAI({ apiKey });
  };

  const handleGenerateOutreach = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsGenerating(true);
    setOutreachScripts(null);

    try {
      const genAI = getGenAI();
      const prompt = `Generate a high-conversion, professional outreach strategy for a business called "${lead.name}" in the "${lead.niche}" niche based in ${lead.location}.
      Their website is ${lead.website}. 
      
      Provide 3 formats in JSON:
      1. coldEmail (subject and body)
      2. linkedinDm (short, conversational)
      3. shortPitch (30-second elevator pitch)
      
      Format the response as raw JSON without markdown blocks:
      {
        "coldEmail": "...",
        "linkedinDm": "...",
        "shortPitch": "..."
      }`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);
      setOutreachScripts(data);
    } catch (error) {
      console.error('Error generating outreach:', error);
      setOutreachScripts({
        coldEmail: "Failed to generate. Please check your API key.",
        linkedinDm: "Failed to generate.",
        shortPitch: "Failed to generate."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    // Simulation of lead discovery
    setTimeout(() => {
        setIsSearching(false);
        // Add one new mock lead based on search
        const newLead: Lead = {
            id: Math.random().toString(36).substr(2, 9),
            name: searchQuery.split(' ')[0] + ' Partners',
            niche: 'Research',
            location: 'Remote',
            website: `https://${searchQuery.replace(/\s+/g, '').toLowerCase()}.com`,
            email: `contact@${searchQuery.replace(/\s+/g, '').toLowerCase()}.com`,
            linkedin: 'https://linkedin.com',
            status: 'new',
            qualityScore: Math.floor(Math.random() * 30) + 70
        };
        setLeads([newLead, ...leads]);
    }, 1500);
  };

  const exportLeads = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Niche,Location,Website,Email,Score"].join(",") + "\n"
      + leads.map(l => `${l.name},${l.niche},${l.location},${l.website},${l.email},${l.qualityScore}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "aetheros_leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex bg-[#050505] min-h-screen text-[#E5E5E5] font-sans">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="flex-1 lg:ml-60 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#1A1A1A] px-4 lg:px-8 flex items-center justify-between bg-[#050505]/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-[#111111] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-[#A1A1AA]" />
            </button>
            <div className="flex items-center gap-2 text-sm text-[#71717A] font-medium overflow-hidden whitespace-nowrap">
              <span className="hidden sm:inline">Dashboard</span>
              <span className="hidden sm:inline text-[#3F3F46] font-light">/</span>
              <span className="text-white capitalize tracking-tight font-semibold">{currentView.replace('-', ' ')}</span>
            </div>
          </div>
          <div className="flex gap-2 lg:gap-3">
             <button 
                onClick={() => setCurrentView('saved')}
                className="hidden sm:block px-4 py-1.5 text-xs font-bold bg-[#111111] border border-[#27272A] rounded-lg hover:border-[#3F3F46] transition-colors"
             >
                Saved Leads
             </button>
             <button 
                onClick={exportLeads}
                className="px-3 lg:px-4 py-1.5 text-xs font-bold bg-white text-black rounded-lg hover:bg-[#E5E5E5] transition-colors"
             >
                Export CSV
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 CustomScrollbar">
          {currentView === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Leads Found" value="12,481" icon={Users} trend="+12%" />
                <StatCard label="Scripts Generated" value="983" icon={Sparkles} trend="92% Rank" />
                <StatCard label="Conversion Rate" value="14.2%" icon={TrendingUp} trend="AI Optimized" />
              </div>

              {/* Advanced Search Controls */}
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-1.5 rounded-2xl flex items-center shadow-2xl shadow-indigo-500/5 transition-all focus-within:border-brand-accent/50">
                <form onSubmit={handleSearch} className="flex-1 flex items-center px-4 gap-3">
                  <SearchIcon className="w-4 h-4 text-[#3F3F46]" />
                  <input 
                    type="text" 
                    placeholder="Find gyms in Mumbai with over 4.5 stars..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-sm w-full focus:outline-none text-white placeholder:text-[#3F3F46]"
                  />
                </form>
                <div className="w-[1px] h-8 bg-[#1A1A1A] mx-2"></div>
                <div className="hidden md:flex items-center px-4 gap-2 text-xs font-bold text-[#71717A]">
                  <span>Niche:</span>
                  <span className="text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md border border-indigo-500/20">All Verticals</span>
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSearching ? 'Analyzing...' : 'Run AI Search'}
                </button>
              </div>

              {/* Main Content Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LeadTable 
                        leads={leads} 
                        onGenerateOutreach={handleGenerateOutreach}
                        onSaveLead={(lead) => console.log('Saved', lead)}
                    />
                </div>

                <div className="flex flex-col gap-6">
                    {/* AI Sidebar Analysis */}
                    <div className="bg-gradient-to-b from-[#0D0D0D] to-[#080808] border border-[#1A1A1A] rounded-2xl p-6 h-fit sticky top-20">
                      <div className="flex items-center gap-2 mb-6 text-brand-accent">
                        <Sparkles className="w-4 h-4" />
                        <h3 className="text-sm font-bold uppercase tracking-widest">Aether Insight</h3>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <p className="text-[10px] uppercase text-[#71717A] tracking-widest font-bold mb-3">Best Outreach Angle</p>
                          <div className="p-3 bg-[#111111] border border-indigo-500/10 rounded-xl">
                            <p className="text-[11px] leading-relaxed text-[#D4D4D8] font-medium">
                              Focus on <span className="text-indigo-300">automated check-in</span> features. Multi-location gyms are reporting up to 22% scalability issues this quarter.
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase text-[#71717A] tracking-widest font-bold mb-3">AI Draft Snippet</p>
                          <div className="p-3 bg-[#111111] border border-[#1A1A1A] rounded-xl relative overflow-hidden group">
                            <div className="text-[10px] text-[#52525B] leading-relaxed font-mono">
                              Subject: Scaling your Mumbai operations...<br/><br/>
                              Hi team, noticed you're expanding. We've helped regional gyms reduce operational friction by...
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="bg-indigo-600 text-[10px] font-bold px-3 py-1 rounded-md text-white shadow-lg">View Full</button>
                            </div>
                          </div>
                        </div>

                        <button className="w-full py-2.5 bg-brand-accent hover:brightness-110 text-white rounded-xl text-[11px] font-bold shadow-lg shadow-indigo-600/10 transition-all">
                          Personalize Campaign
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}

        {currentView === 'saved' && (
          <div className="space-y-6">
            <h3 className="text-xl font-display font-bold tracking-tight mb-1">Bookmarked Prospects</h3>
            <p className="text-sm text-zinc-500 font-medium">Leads you've identified for follow-up</p>
            <LeadTable 
                leads={leads.slice(0, 2)} 
                onGenerateOutreach={handleGenerateOutreach}
                onSaveLead={(lead) => console.log('Removed from saved', lead)}
            />
          </div>
        )}

        {currentView === 'billing' && (
          <div className="max-w-4xl mx-auto py-10">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">Scale your outreach</h2>
                <p className="text-zinc-500 font-medium max-w-lg mx-auto text-lg">Choose the perfect plan for your sales team and start closing more deals today.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                {/* Pro Plan */}
                <div className="glass-card p-8 rounded-[2rem] border-brand-accent/50 relative">
                    <div className="absolute top-0 right-0 p-6">
                        <span className="bg-brand-accent text-white text-[10px] font-bold px-3 py-1 rounded-full glow-accent">CURRENT PLAN</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold">$49</span>
                        <span className="text-zinc-500 font-medium">/month</span>
                    </div>
                    <ul className="space-y-4 mb-10">
                        {[
                            '1,000 lead searches / mo',
                            'AI outreach generation',
                            'LinkedIn integration',
                            'Team collaboration',
                            'Priority support'
                        ].map((feat, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                                <Sparkles className="w-4 h-4 text-brand-accent" />
                                {feat}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-3 bg-zinc-800 rounded-xl font-bold text-sm text-zinc-400 cursor-not-allowed">Active</button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-zinc-100 p-8 rounded-[2rem] text-zinc-900 shadow-2xl scale-105">
                    <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold">$199</span>
                        <span className="text-zinc-500 font-medium">/month</span>
                    </div>
                    <ul className="space-y-4 mb-10">
                        {[
                            'Unlimited searches',
                            'Custom AI models',
                            'API access',
                            'Dedicated account manager',
                            'White-label reports'
                        ].map((feat, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-semibold">
                                <Sparkles className="w-4 h-4 text-brand-accent fill-brand-accent" />
                                {feat}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-3 bg-brand-accent text-white rounded-xl font-bold text-sm shadow-xl hover:brightness-110 transition-all glow-accent">Upgrade Now</button>
                </div>
            </div>
          </div>
        )}

        {currentView === 'search' && (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#0D0D0D] p-12 rounded-[2.5rem] border border-brand-border text-center max-w-3xl mx-auto bg-gradient-to-b from-brand-accent/5 to-transparent relative overflow-hidden">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-accent/10 blur-[100px] pointer-events-none" />
                     
                     <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-brand-accent/20">
                        <SearchIcon className="w-6 h-6 text-brand-accent" />
                     </div>
                     <h2 className="text-3xl font-display font-bold mb-4 tracking-tight text-white">Discover high-intent prospects</h2>
                     <p className="text-[#71717A] font-medium mb-10 max-w-md mx-auto text-sm">Target business leads based on vertical, location, and intent signals identified by Aether AI.</p>
                     
                     <form onSubmit={handleSearch} className="max-w-lg mx-auto relative group">
                        <div className="relative flex gap-2">
                             <input 
                                type="text" 
                                placeholder="e.g. SaaS companies in London"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-zinc-950 border border-brand-border rounded-xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-accent transition-all placeholder:text-[#3F3F46] text-white"
                            />
                            <button 
                                type="submit"
                                disabled={isSearching}
                                className="bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center justify-center min-w-[100px] text-sm"
                            >
                                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : 'Run search'}
                            </button>
                        </div>
                     </form>
                </div>
                
                {leads.length > INITIAL_LEADS.length && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#71717A]">Most Recent Candidates</h4>
                        <LeadTable leads={leads.filter(l => !INITIAL_LEADS.find(il => il.id === l.id))} onGenerateOutreach={handleGenerateOutreach} onSaveLead={() => {}} />
                    </motion.div>
                )}
            </div>
        )}

        {currentView === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <h3 className="text-xl font-display font-bold tracking-tight mb-1">Account & Preference</h3>
            <div className="glass-card p-6 rounded-2xl space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-brand-border">
                    <div>
                        <div className="font-semibold">AI Generation Style</div>
                        <div className="text-xs text-zinc-500">Choose the tone for your outreach outputs</div>
                    </div>
                    <select className="bg-zinc-900 border border-brand-border rounded-lg px-3 py-1.5 text-sm text-zinc-300">
                        <option>Authoritative & Bold</option>
                        <option>Friendly & Conversational</option>
                        <option>Minimalist & Sharp</option>
                    </select>
                </div>
                <div className="flex justify-between items-center pb-6 border-b border-brand-border">
                    <div>
                        <div className="font-semibold">Personalized Signature</div>
                        <div className="text-xs text-zinc-500">Append this to every AI draft</div>
                    </div>
                    <button className="text-sm text-brand-accent font-bold">Edit Signature</button>
                </div>
            </div>
          </div>
        )}
      </div>
    </main>

      <OutreachModal 
        lead={selectedLead}
        scripts={outreachScripts}
        isLoading={isGenerating}
        onClose={() => {
            setSelectedLead(null);
            setOutreachScripts(null);
        }}
      />
    </div>
  );
}
