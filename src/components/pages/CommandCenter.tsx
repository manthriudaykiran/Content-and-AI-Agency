import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Send,
  CalendarCheck,
  Zap,
  DollarSign,
  Share2,
  RefreshCw,
  FileSpreadsheet,
  Database,
  Radio,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { NavTab } from '../../types';

export const CommandCenter: React.FC = () => {
  const {
    moduleAgents,
    runAllAgentsUpdate,
    isUpdatingAllAgents,
    setActiveTab,
    leads,
    invoices,
    contentAssets,
    setIsAuditModalOpen,
    setIsDemoStoryModalOpen,
    setIsExcelSyncOpen,
    setIsSupabaseDemoModalOpen,
    setIsDatabaseSyncOpen,
    triggerClosedLoopSprint,
    isLoopRunning,
  } = useApp();

  const totalPipelineValue = leads.reduce((acc, l) => acc + l.estimatedValue, 0);
  const totalClosedRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);
  const totalReach = contentAssets.reduce((acc, c) => acc + (c.metrics?.reach || 0), 0);
  const totalLeads = contentAssets.reduce((acc, c) => acc + (c.metrics?.leadsGenerated || 0), 0);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Executive Commander AI Agent Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/70 via-[#0e1424] to-[#12192e] border border-indigo-500/40 p-6 shadow-2xl shadow-indigo-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-[#0b0e14] rounded-[10px] flex items-center justify-center text-xl">
                  👑
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-white font-mono">
                    Aether OS Executive Director Agent
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                    14 Active Module Agents
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Every module functions as a world-expert AI Agent. One unified operational heartbeat.
                </p>
              </div>
            </div>

            {/* Top Multi-Agent Execution Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Run All Agents Master Trigger */}
              <button
                onClick={() => runAllAgentsUpdate()}
                disabled={isUpdatingAllAgents}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                  isUpdatingAllAgents
                    ? 'bg-amber-600/60 border border-amber-500/80 animate-pulse'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border border-indigo-400/40 shadow-indigo-600/30'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isUpdatingAllAgents ? 'animate-spin' : ''}`} />
                <span>{isUpdatingAllAgents ? 'Synchronizing All 14 Agents...' : 'Run All Agents (System Pulse)'}</span>
              </button>

              {/* Excel Sync Quick Trigger */}
              <button
                onClick={() => setIsExcelSyncOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-200 text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Excel / LinkedIn Ingest</span>
              </button>

              {/* Supabase Demo Environment Trigger */}
              <button
                onClick={() => setIsSupabaseDemoModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/70 text-emerald-200 text-xs font-bold shadow-md shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Demo</span>
              </button>

              {/* Database Sync View Trigger */}
              <button
                onClick={() => setIsDatabaseSyncOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/90 border border-indigo-500/70 text-indigo-200 text-xs font-bold shadow-md shadow-indigo-950/50 transition-all cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Database Sync</span>
              </button>

              {/* Demo Story */}
              <button
                onClick={() => setIsDemoStoryModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
              >
                <span>13-Step Story</span>
              </button>
            </div>
          </div>

          {/* Daily Direction Briefing */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans space-y-2">
            <div className="flex items-center justify-between text-indigo-300 font-semibold font-mono text-[11px]">
              <span>“What Should I Do Today?” — Executive Autonomous Directives:</span>
              <span className="text-emerald-400">100% Agent Alignment</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              👉 <strong className="text-cyan-300">Content OS Agent:</strong> Publish today's LinkedIn breakdown: <em>"How We Built an Autonomous 21-Agent AI Agency OS in 2026"</em>. Target: 2,500+ views & 3 inbound DMs.<br />
              👉 <strong className="text-emerald-300">Outreach Agent:</strong> Send 6 bespoke non-spam touches (Observation → Relevance → Insight → Question). Follow strict precautions: no pitching on touch 1.<br />
              👉 <strong className="text-amber-300">Sales Copilot:</strong> CloudScale raised implementation complexity concerns; dispatch 8-section proposal with 14-day zero-code guarantee.<br />
              👉 <strong className="text-purple-300">CRM & Spreadsheet Engine:</strong> Ingest latest LinkedIn connections from Excel to update CRM, discovery calls, and revenue attribution.
            </p>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Closed Revenue MTD</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ${totalClosedRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">+28% agency growth</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Active Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ${totalPipelineValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">{leads.length} active enterprise deals</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Content-to-Lead Volume</span>
            <Share2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {totalLeads} Qualified Leads
          </div>
          <span className="text-[11px] text-slate-400">{totalReach.toLocaleString()} total organic reach</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Module Agents Registered</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            14 World Experts
          </div>
          <span className="text-[11px] text-emerald-400 font-mono font-medium">All systems operational</span>
        </div>
      </div>

      {/* ALL 14 MODULES AS INTERACTIVE AI AGENTS (User Request) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <span>All 14 Operational Modules As AI Agents</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
                Click any agent to open module
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Each module is the world-class expert in its own domain. Click any card to enter that agent's workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {moduleAgents.map((modAgent) => {
            return (
              <div
                key={modAgent.moduleId}
                onClick={() => setActiveTab(modAgent.moduleId)}
                className="group p-4 rounded-xl bg-[#0d111a] border border-slate-800 hover:border-indigo-500/70 hover:bg-[#111624] transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-sm hover:shadow-lg hover:shadow-indigo-950/40 relative overflow-hidden"
              >
                <div className="space-y-2.5">
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {modAgent.avatar}
                      </span>
                      <div>
                        <h3 className="font-bold text-white text-xs font-mono group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {modAgent.agentName}
                        </h3>
                        <span className="text-[10px] text-slate-400 block line-clamp-1 font-mono">
                          {modAgent.agentTitle}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-semibold ${
                        modAgent.status === 'working'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : modAgent.status === 'analyzing'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {modAgent.status}
                    </span>
                  </div>

                  {/* Daily Target Section (Answers User Request) */}
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
                      <span className="font-bold uppercase">Daily Target:</span>
                      <span className="text-emerald-400 font-semibold">{modAgent.dailyTarget.urgency} priority</span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium leading-snug line-clamp-2">
                      {modAgent.dailyTarget.title}
                    </p>
                    <div className="text-[10px] text-indigo-300 font-mono pt-0.5">
                      Goal: {modAgent.dailyTarget.metricGoal}
                    </div>
                  </div>

                  {/* Precautions & Strategy Highlights */}
                  <div className="space-y-1 text-[10px] text-slate-400">
                    <div className="flex items-center space-x-1 text-amber-300/90 font-mono">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span className="truncate">Precaution: {modAgent.precautions[0]}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-300/90 font-mono">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">Strategy: {modAgent.bestStrategies[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400 group-hover:text-indigo-300 font-mono">
                  <span>Enter Agent Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
