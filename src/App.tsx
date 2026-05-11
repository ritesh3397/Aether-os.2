import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  Bookmark, 
  TrendingUp, 
  Search as SearchIcon,
  RefreshCw,
  Menu,
  X,
  CreditCard,
  Zap,
  ChevronRight,
  Shield,
  Layers,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import LeadTable from './components/LeadTable';
import OutreachModal from './components/OutreachModal';
import UpgradeModal from './components/UpgradeModal';
import LandingHero from './components/LandingHero';
import { Lead, OutreachScripts, View, UserStats } from './types';
import { generateLeads, getUserStats, updateUserStats } from './services/leadService';
import { generateOutreach } from './services/outreachService';
import { cn } from './lib/utils';

export default function App() {
  const [isLanding, setIsLanding] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [outreachScripts, setOutreachScripts] = useState<OutreachScripts | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedLeads = localStorage.getItem('aether_saved_leads');
    if (storedLeads) setSavedLeads(JSON.parse(storedLeads));
    setStats(getUserStats());

    // Auto-start if they visited before
    const hasVisited = localStorage.getItem('aether_visited');
    if (hasVisited) setIsLanding(false);
  }, []);

  const handleStart = () => {
    setIsLanding(false);
    localStorage.setItem('aether_visited', 'true');
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    if (stats.remainingCredits <= 0 && !stats.isSubscribed) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsSearching(true);
    setError(null);
    setCurrentView('search');

    try {
      const result = await generateLeads(searchQuery, "Global Context", 10);
      
      if (result.success) {
        setLeads(result.leads);
        setStats(getUserStats()); 
      } else {
        if (result.error?.includes('credits')) {
          setIsUpgradeModalOpen(true);
        } else {
          setError(result.error || "Search failed.");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateOutreach = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsGenerating(true);
    setOutreachScripts(null);

    try {
      const scripts = await generateOutreach(lead);
      setOutreachScripts(scripts);
      setStats(getUserStats());
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLead = (lead: Lead) => {
    const updated = [...savedLeads, lead];
    setSavedLeads(updated);
    localStorage.setItem('aether_saved_leads', JSON.stringify(updated));
  };

  const handleUpgrade = () => {
    const updatedStats = { ...stats, isSubscribed: true, remainingCredits: 9999 };
    updateUserStats(updatedStats);
    setStats(updatedStats);
    setIsUpgradeModalOpen(false);
  };

  const exportLeads = () => {
    const dataToExport = currentView === 'saved' ? savedLeads : leads;
    if (dataToExport.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Company,Website,Email,Instagram,Location,Category\n"
      + dataToExport.map(l => `"${l.company}","${l.website}","${l.email}","${l.instagram}","${l.location}","${l.category}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aether_leads_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLanding) {
    return <LandingHero onStart={handleStart} />;
  }

  return (
    <div className="flex bg-[#050505] min-h-screen text-[#FFFFFF] font-sans selection:bg-brand-accent/30 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="flex-1 lg:ml-60 flex flex-col h-screen relative">
        {/* Cinematic Background elements for main app */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
           <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-accent/10 rounded-full blur-[100px]" />
           <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-accent-secondary/5 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <header className="h-20 border-b border-brand-border px-8 flex items-center justify-between glass-card !rounded-none !border-x-0 !border-t-0 sticky top-0 z-40 bg-brand-bg/60">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </button>
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
                <span>Aether</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white capitalize">{currentView.replace('-', ' ')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 glass-card rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent glow-accent" />
                <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                  {stats.isSubscribed ? 'Pro Node Active' : `${stats.remainingCredits} Units Remaining`}
                </span>
             </div>
             
             <div className="h-8 w-[1px] bg-white/10 hidden md:block mx-1" />

             {!stats.isSubscribed && (
               <button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-5 py-2 text-[10px] font-bold bg-white text-black rounded-xl hover:bg-[#E5E5E5] transition-all shadow-xl"
               >
                  Go Pro
               </button>
             )}

             <button 
                onClick={exportLeads}
                className="px-5 py-2 text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
             >
                Export CSV
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 space-y-12 relative z-10">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12 max-w-7xl mx-auto"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                   <div>
                      <h2 className="text-4xl font-display font-extrabold tracking-tight text-gradient mb-2">Systems Overview</h2>
                      <p className="text-text-secondary text-sm font-medium">Real-time intelligence dashboard for outreach automation.</p>
                   </div>
                   <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg"><Zap className="w-3 h-3 text-brand-accent" /> Latency: 42ms</span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 glass-card rounded-lg"><Shield className="w-3 h-3 text-emerald-400" /> Secure Protocol</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard label="Leads Mined" value={stats.totalLeadsFound.toLocaleString()} icon={Users} trend="+12.4%" color="blue" />
                  <StatCard label="Computational Units" value={stats.isSubscribed ? '∞' : stats.remainingCredits.toString()} icon={Zap} trend={stats.isSubscribed ? 'Active' : 'Daily Quota'} color="violet" />
                  <StatCard label="Scripts Authored" value={stats.totalScriptsGenerated.toString()} icon={Sparkles} trend="AI Optimized" color="emerald" />
                </div>

                {/* Main Search Bar - Cinematic Redesign */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-linear-to-r from-brand-accent to-accent-secondary opacity-0 group-focus-within:opacity-10 blur-2xl transition-opacity duration-1000" />
                  <div className="glass-card p-2 shadow-2xl focus-within:border-brand-accent/50 transition-all duration-500">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center p-1 gap-2">
                       <div className="flex-1 flex items-center px-6 gap-4 border-b md:border-b-0 md:border-r border-white/5 py-3 md:py-0">
                          <SearchIcon className="w-5 h-5 text-text-secondary group-focus-within:text-brand-accent transition-colors" />
                          <input 
                            type="text" 
                            placeholder="Identify target leads... e.g. 'Software execs in London focused on AI'" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-base w-full focus:outline-none text-white placeholder:text-text-secondary/50 font-medium"
                          />
                       </div>
                       <button 
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="bg-white text-black hover:bg-text-secondary text-sm font-bold px-10 py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Initialize Scan</>}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">Data Stream</h3>
                        <button onClick={() => setLeads([])} className="text-[10px] font-bold text-text-secondary/40 hover:text-rose-400 transition-colors">Wipe Buffer</button>
                      </div>
                      
                      <div className="glass-card overflow-hidden">
                        {isSearching ? (
                          <div className="p-1 space-y-1">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="h-20 bg-white/5 animate-pulse rounded-lg" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </div>
                        ) : (
                          <LeadTable 
                              leads={leads} 
                              onGenerateOutreach={handleGenerateOutreach}
                              onSaveLead={saveLead}
                          />
                        )}
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="glass-card p-8 space-y-6 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        <div className="flex items-center gap-3 text-brand-accent">
                          <BarChart3 className="w-5 h-5" />
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">System Intel</h3>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                          <p className="text-sm text-text-secondary leading-relaxed font-medium">Market volatility is increasing in <span className="text-white">Fintech</span> sectors. AI is recommending aggressive high-value outreach.</p>
                          
                          <div className="space-y-3">
                             <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-text-secondary">
                                <span>Network Saturation</span>
                                <span className="text-emerald-400 font-mono">Normal_Ops</span>
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: '45%' }} className="h-full bg-brand-accent" />
                             </div>
                          </div>

                          <button 
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="w-full py-4 bg-white/5 border border-white/10 hover:border-brand-accent/40 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mt-4"
                          >
                            Explore Market Verticals
                          </button>
                        </div>
                      </div>

                      <div className="glass-card p-8 group cursor-pointer hover:border-brand-accent/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Archive</h4>
                           <Bookmark className="w-4 h-4 text-brand-accent group-hover:scale-125 transition-transform" />
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-4xl font-display font-extrabold text-white tracking-tighter">{savedLeads.length}</span>
                          <button onClick={() => setCurrentView('saved')} className="text-[10px] font-bold text-text-secondary hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">Open Library <ChevronRight className="w-3 h-3" /></button>
                        </div>
                      </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'search' && (
              <motion.div 
                key="search"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 max-w-7xl mx-auto"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="text-[10px] font-bold text-text-secondary hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10"
                   >
                     <ChevronRight className="w-3 h-3 rotate-180" /> Back to systems
                   </button>
                   <div className="flex gap-4 w-full md:w-auto">
                      <div className="relative flex-1 md:w-80">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input 
                          type="text" 
                          placeholder="Re-initialize focus..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-brand-surface/40 backdrop-blur-md border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-accent/50 transition-all font-medium"
                        />
                      </div>
                      <button 
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="p-3.5 bg-brand-accent rounded-xl text-white disabled:opacity-50 glow-accent hover:scale-[1.05] active:scale-[0.95] transition-all"
                      >
                        <RefreshCw className={cn("w-4 h-4 text-white", isSearching && "animate-spin")} />
                      </button>
                   </div>
                </div>
                
                {error && (
                  <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-2xl text-rose-400 text-sm font-medium flex items-center gap-4 animate-in slide-in-from-top-4">
                    <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20">
                       <X className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-bold">System Exception</p>
                        <p className="text-rose-400/60 text-xs font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <div className="glass-card overflow-hidden">
                  {isSearching ? (
                    <div className="p-4 space-y-2">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  ) : (
                    <LeadTable 
                      leads={leads} 
                      onGenerateOutreach={handleGenerateOutreach}
                      onSaveLead={saveLead}
                    />
                  )}
                </div>
              </motion.div>
            )}

            {(currentView === 'saved') && (
              <motion.div 
                key="saved"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8 max-w-7xl mx-auto"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-display font-extrabold text-gradient mb-2 tracking-tight">Active Archive</h2>
                    <p className="text-text-secondary text-sm font-medium">Secured collection of high-intent prospects.</p>
                  </div>
                  <button 
                    onClick={() => {
                        localStorage.removeItem('aether_saved_leads');
                        setSavedLeads([]);
                    }}
                    className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border border-rose-500/20"
                  >
                    Purge Collection
                  </button>
                </div>

                <div className="glass-card shadow-2xl">
                  <LeadTable 
                    leads={savedLeads} 
                    onGenerateOutreach={handleGenerateOutreach}
                    onSaveLead={() => {}}
                  />
                </div>
              </motion.div>
            )}

            {(currentView === 'settings' || currentView === 'billing') && (
              <motion.div 
                key="billing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto py-20 text-center space-y-10"
              >
                <div className="w-24 h-24 bg-brand-accent/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-brand-accent/10 glow-accent rotate-3">
                  <CreditCard className="w-10 h-10 text-brand-accent" />
                </div>
                <div className="space-y-4">
                   <h2 className="text-5xl font-display font-extrabold text-white tracking-tight">Expansion Protocol</h2>
                   <p className="text-text-secondary text-lg max-w-lg mx-auto leading-relaxed">
                    Scale your operations with unbounded AI computational units and prioritized infrastructure access.
                   </p>
                </div>

                <div className="glass-card p-12 space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-accent to-accent-secondary" />
                   
                   <div className="flex flex-col items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent">Current Status</span>
                       <div className="text-2xl font-display font-bold text-white px-8 py-3 glass-card bg-brand-accent/10 border-brand-accent/20 rounded-2xl glow-accent">
                         {stats.isSubscribed ? 'PRO_ENTITY_ACTIVE' : 'FREE_NODE_LOCKED'}
                       </div>
                   </div>

                   {!stats.isSubscribed ? (
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                          <div className="flex items-start gap-4 p-4 glass-card bg-white/5 border-white/5 rounded-2xl">
                             <Zap className="w-5 h-5 text-brand-accent shrink-0 pt-1" />
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-white">Unlimited Mimes</p>
                                <p className="text-xs text-text-secondary">No daily credit lockdowns ever.</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-4 p-4 glass-card bg-white/5 border-white/5 rounded-2xl">
                             <Layers className="w-5 h-5 text-accent-secondary shrink-0 pt-1" />
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-white">Deep Core Scan</p>
                                <p className="text-xs text-text-secondary">Access to advanced LLM nodes.</p>
                             </div>
                          </div>
                       </div>
                       <button 
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Initiate Upgrade Sequence
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-sm text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 py-4 rounded-2xl">Priority status confirmed. You have unrestricted system access.</p>
                      <div className="flex items-center justify-center gap-3 text-text-secondary text-xs font-bold uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4" />
                        Infrastructure optimized at 100% capacity
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info in dashboard */}
        <footer className="h-10 px-12 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.5em] text-text-secondary/20 relative z-10">
           <span>Aether_OS_Terminal_004</span>
           <span>Protocols_Stable_v2.0.1</span>
        </footer>
      </main>

      <OutreachModal 
        lead={selectedLead}
        scripts={outreachScripts}
        isOpen={selectedLead !== null}
        isGenerating={isGenerating}
        onClose={() => setSelectedLead(null)}
      />

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: { label: string, value: string, icon: any, trend?: string, color: 'blue' | 'violet' | 'emerald' }) {
  const colors = {
    blue: "text-brand-accent border-brand-accent/20 bg-brand-accent/5",
    violet: "text-accent-secondary border-accent-secondary/20 bg-accent-secondary/5",
    emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  };

  return (
    <div className="glass-card p-10 group hover:border-white/20 transition-all duration-500 hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-8">
        <div className={cn("p-4 rounded-2xl border transition-all duration-500 group-hover:glow-accent", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest",
            trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-text-secondary border border-white/10"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-4xl font-display font-extrabold text-white tracking-tighter mb-2">{value}</p>
        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">{label}</p>
      </div>
    </div>
  );
}
