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
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import Sidebar from './components/Sidebar';
import LeadTable from './components/LeadTable';
import OutreachModal from './components/OutreachModal';
import UpgradeModal from './components/UpgradeModal';
import { Lead, OutreachScripts, View, UserStats } from './types';
import { generateLeads, getUserStats, updateUserStats } from './services/leadService';
import { generateOutreach } from './services/outreachService';
import { cn } from './lib/utils';

export default function App() {
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
    // Load saved leads from localStorage
    const storedLeads = localStorage.getItem('aether_saved_leads');
    if (storedLeads) setSavedLeads(JSON.parse(storedLeads));
    
    // Initial stats load
    setStats(getUserStats());
  }, []);

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
          <div className="flex items-center gap-2 lg:gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-[#27272A] rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                  {stats.isSubscribed ? 'Pro Status' : `${stats.remainingCredits} Credits Left`}
                </span>
             </div>
             
             {!stats.isSubscribed && (
               <button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="px-3 py-1.5 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20"
               >
                  Upgrade
               </button>
             )}

             <button 
                onClick={exportLeads}
                className="px-3 lg:px-4 py-1.5 text-xs font-bold bg-white text-black rounded-lg hover:bg-[#E5E5E5] transition-colors"
             >
                Export
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 CustomScrollbar">
          {currentView === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Leads Found" value={stats.totalLeadsFound.toLocaleString()} icon={Users} trend="+12%" />
                <StatCard label="Credits Available" value={stats.isSubscribed ? '∞' : stats.remainingCredits.toString()} icon={Zap} trend={stats.isSubscribed ? 'unlimited' : 'free plan'} />
                <StatCard label="Scripts Drafted" value={stats.totalScriptsGenerated.toString()} icon={Sparkles} trend="AI Powered" />
              </div>

              {/* Main Search Bar */}
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-1.5 rounded-2xl flex items-center shadow-2xl focus-within:border-indigo-500/50 transition-all">
                  <form onSubmit={handleSearch} className="flex-1 flex items-center px-4 gap-3">
                    <SearchIcon className="w-4 h-4 text-[#3F3F46]" />
                    <input 
                      type="text" 
                      placeholder="e.g. Real estate agents in Seattle with high sales..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none text-sm w-full focus:outline-none text-white placeholder:text-[#3F3F46]"
                    />
                  </form>
                  <button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 min-w-[140px] flex items-center justify-center gap-2"
                  >
                    {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Find 10 Leads</>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#71717A]">Active Discovery</h3>
                      <button onClick={() => setLeads([])} className="text-[10px] text-[#3F3F46] hover:text-[#71717A]">Clear Current List</button>
                    </div>
                    {isSearching ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-20 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl animate-pulse" />
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

                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-b from-[#0D0D0D] to-[#080808] border border-[#1A1A1A] rounded-2xl p-6 h-fit">
                      <div className="flex items-center gap-2 mb-6 text-indigo-400">
                        <Sparkles className="w-4 h-4" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest">Aether Strategy</h3>
                      </div>
                      
                      <div className="space-y-4 text-xs text-[#A1A1AA] leading-relaxed">
                        <p>Currently analyzing <span className="text-white">high-growth sectors</span>. Retail and Real Estate are seeing significant movement in current quarters.</p>
                        <div className="p-3 bg-[#111111] border border-[#1A1A1A] rounded-xl">
                          <p className="text-[10px] text-[#71717A] italic">"AI-powered outreach is 3x more effective for mid-market B2B services right now."</p>
                        </div>
                        <button 
                          onClick={() => setIsUpgradeModalOpen(true)}
                          className="w-full py-2.5 bg-[#161618] border border-[#27272A] hover:border-indigo-500/50 text-white rounded-xl text-[10px] font-bold transition-all mt-4"
                        >
                          Deep Scan Industry
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-6">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-4">Saved Leads</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-white tracking-tight">{savedLeads.length}</span>
                        <Bookmark className="w-4 h-4 text-indigo-400" />
                      </div>
                      <button onClick={() => setCurrentView('saved')} className="text-[10px] text-indigo-400 hover:underline">View my collection →</button>
                    </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'search' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="text-xs text-[#71717A] hover:text-white transition-colors"
                 >
                   ← Back to dashboard
                 </button>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Refine search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50 w-48"
                    />
                    <button 
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="p-1.5 bg-indigo-600 rounded-lg text-white disabled:opacity-50"
                    >
                      <RefreshCw className={cn("w-4 h-4", isSearching && "animate-spin")} />
                    </button>
                 </div>
              </div>
              
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400 text-xs flex items-center gap-3">
                  <X className="w-4 h-4" />
                  {error}
                </div>
              )}

              {isSearching ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-24 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl animate-pulse" />
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
          )}

          {currentView === 'saved' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white tracking-tight">Saved Collection</h2>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => {
                       localStorage.removeItem('aether_saved_leads');
                       setSavedLeads([]);
                    }}
                    className="text-[10px] text-rose-400 hover:underline"
                   >
                     Clear all
                   </button>
                </div>
              </div>
              <LeadTable 
                leads={savedLeads} 
                onGenerateOutreach={handleGenerateOutreach}
                onSaveLead={() => {}}
              />
            </div>
          )}

          {(currentView === 'settings' || currentView === 'billing') && (
            <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                  <CreditCard className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Billing & Plan</h2>
                <p className="text-sm text-[#71717A]">
                  Account Status: <span className="text-white font-bold">{stats.isSubscribed ? 'PRO SUBSCRIBER' : 'FREE EXPLORER'}</span>
                </p>
                {!stats.isSubscribed ? (
                  <button 
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all font-sans"
                  >
                    Unlock Pro Access
                  </button>
                ) : (
                  <div className="p-6 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl text-[#E5E5E5] space-y-4">
                    <p className="text-sm">You have unlimited leads and priority AI infrastructure access.</p>
                    <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold">
                      <TrendingUp className="w-4 h-4" />
                      Subscription active via Aether Pay
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
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

function StatCard({ label, value, icon: Icon, trend }: { label: string, value: string, icon: any, trend?: string }) {
  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-2xl hover:border-[#27272A] transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-[#161618] rounded-xl border border-[#27272A] group-hover:border-indigo-500/50 transition-colors">
          <Icon className="w-5 h-5 text-[#A1A1AA] group-hover:text-indigo-400 transition-colors" />
        </div>
        {trend && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md font-sans",
            trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-indigo-500/10 text-indigo-400"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight mb-1">{value}</p>
        <p className="text-xs font-medium text-[#71717A] uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}
