import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  PlayCircle,
  CalendarCheck,
  RefreshCw,
  Zap,
  FileSpreadsheet,
  Database,
  Radio,
} from 'lucide-react';

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  'command-center': {
    title: 'Command Center',
    subtitle: 'Daily Executive Brief, Pipeline Velocity & Real-Time Agent Dispatch',
  },
  'content-os': {
    title: 'Content Creator OS',
    subtitle: 'Research, Strategy, Script Studio, Repurposing & Platform Intelligence',
  },
  'content-calendar': {
    title: 'Content Calendar',
    subtitle: 'Multi-Channel Publishing Matrix with Revenue & Lead Attribution',
  },
  'client-acquisition': {
    title: 'Client Acquisition',
    subtitle: 'ICP Intelligence, Prospect Telemetry & Deep Account Research',
  },
  'outreach': {
    title: 'Outreach Studio',
    subtitle: 'Observation-Relevance-Insight-Question Sequences with Human Approval',
  },
  'crm': {
    title: 'Agency CRM',
    subtitle: 'Unified Data Layer connecting Content Attribution, Deals & Objections',
  },
  'sales': {
    title: 'Sales Intelligence & Copilot',
    subtitle: 'Pre-Call Intel, Discovery Copilot, Objection Extraction & Proposal Builder',
  },
  'client-onboarding': {
    title: 'Client Onboarding',
    subtitle: 'Deal Won Transition Sequence, Credential Handshakes & Automated Kickoffs',
  },
  'delivery-coordination': {
    title: 'Delivery & Coordination',
    subtitle: 'Agency Operations Room: Map, Design, Build, Test, Deploy & Optimize',
  },
  'finance': {
    title: 'Finance & Unit Economics',
    subtitle: 'MRR Dashboard, Invoicing, API Cost Audits & Per-Client Profitability',
  },
  'orchestration': {
    title: 'Agent Orchestration Graph',
    subtitle: 'Interactive Multi-Agent Flow, State Transitions & Task Inspection',
  },
  'intel': {
    title: 'Closed-Loop Market Intel',
    subtitle: 'Revenue-to-Content Intelligence Loop & Future Automation Roadmaps',
  },
  'knowledge-base': {
    title: 'Knowledge Base & Schemas',
    subtitle: 'Architect Governance, 21-Worker Registry & Shared JSON Contracts',
  },
  'settings': {
    title: 'Settings & Integrations',
    subtitle: 'API Keys, Webhooks, Platform Connectors & System Parameters',
  },
};

export const Header: React.FC = () => {
  const {
    activeTab,
    triggerClosedLoopSprint,
    isLoopRunning,
    setIsAuditModalOpen,
    setIsDemoStoryModalOpen,
    setIsExcelSyncOpen,
    setIsSupabaseDemoModalOpen,
    setIsDatabaseSyncOpen,
    supabaseStatus,
    loop,
  } = useApp();

  const currentMeta = TAB_TITLES[activeTab] || {
    title: 'Operating System',
    subtitle: 'Autonomous AI Content Creator & Agency Engine',
  };

  return (
    <header className="h-16 flex-shrink-0 bg-[#0b0e14]/80 border-b border-slate-800/80 backdrop-blur-xl px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Title area */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-base font-bold text-white flex items-center space-x-2">
            <span>{currentMeta.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 font-mono font-normal">
              v2.6 OS
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Action buttons & system indicators */}
      <div className="flex items-center space-x-3">
        {/* Excel & LinkedIn Inbound Spreadsheet Sync */}
        <button
          onClick={() => setIsExcelSyncOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-200 text-xs font-medium transition-all shadow-sm shadow-emerald-950/40 cursor-pointer"
          title="Import LinkedIn contacts & leads from Excel / Sheets into CRM & Pipeline"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Excel/Sheets Sync</span>
          <span className="lg:hidden">Sync</span>
        </button>

        {/* Supabase Demo & Health Console */}
        <button
          onClick={() => setIsSupabaseDemoModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/60 text-emerald-200 text-xs font-semibold transition-all shadow-sm shadow-emerald-950/40 cursor-pointer"
          title="Supabase Demo Data Seeder & Migration Console"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Supabase Demo</span>
          <span className="lg:hidden">DB Demo</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        {/* Database Sync View (Two-Way Telemetry & Realtime Mapping) */}
        <button
          onClick={() => setIsDatabaseSyncOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/60 text-indigo-200 text-xs font-semibold transition-all shadow-sm shadow-indigo-950/40 cursor-pointer"
          title="Database Sync: Live 1-to-1 Table Matrix, Job Queue & Audit Logs"
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden lg:inline">Database Sync</span>
          <span className="lg:hidden">DB Sync</span>
        </button>

        {/* Closed-Loop Dispatch Trigger */}
        <button
          onClick={() => triggerClosedLoopSprint()}
          disabled={isLoopRunning}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isLoopRunning
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
              : 'bg-indigo-950/60 hover:bg-indigo-900/60 border-indigo-700/50 text-indigo-200 hover:text-white shadow-sm shadow-indigo-900/30'
          }`}
          title="Run signature Revenue-to-Content Intelligence Loop sprint"
        >
          {isLoopRunning ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          )}
          <span className="hidden md:inline">
            {isLoopRunning ? 'Synthesizing Loop...' : 'Run Closed-Loop Sprint'}
          </span>
          <span className="md:hidden">Run Loop</span>
        </button>

        {/* Interactive Demo Story Button */}
        <button
          onClick={() => setIsDemoStoryModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700 text-slate-200 text-xs font-medium transition-all"
        >
          <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden lg:inline">Demo Walkthrough</span>
          <span className="lg:hidden">Demo</span>
        </button>

        {/* Primary CTA Button */}
        <button
          onClick={() => setIsAuditModalOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 border border-indigo-400/30 transition-all cursor-pointer"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Book AI Audit</span>
          <span className="sm:hidden">Audit</span>
        </button>

        {/* Telemetry pill */}
        <div className="hidden xl:flex items-center space-x-2 pl-2 border-l border-slate-800 text-[11px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Gemini 3.8 Flash</span>
        </div>
      </div>
    </header>
  );
};
