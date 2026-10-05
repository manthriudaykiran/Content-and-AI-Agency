import React from 'react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  Crosshair,
  Send,
  Users,
  Briefcase,
  UserCheck,
  Cpu,
  DollarSign,
  Workflow,
  Radio,
  BookOpen,
  Settings as SettingsIcon,
  ShieldCheck,
  PlayCircle,
  CalendarCheck,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    agents,
    leads,
    outreachMessages,
    setIsAuditModalOpen,
    setIsDemoStoryModalOpen,
  } = useApp();

  const workingAgentsCount = agents.filter(
    (a) => a.status === 'working' || a.status === 'needs_approval'
  ).length;
  const pendingOutreachCount = outreachMessages.filter(
    (m) => m.status === 'needs_approval'
  ).length;
  const activeLeadsCount = leads.filter(
    (l) => l.stage !== 'won' && l.stage !== 'lost'
  ).length;

  const navItems: NavItem[] = [
    { id: 'command-center', number: '01', label: 'Command Center', icon: LayoutDashboard },
    { id: 'content-os', number: '02', label: 'Content OS', icon: Sparkles },
    { id: 'content-calendar', number: '03', label: 'Content Calendar', icon: Calendar },
    { id: 'client-acquisition', number: '04', label: 'Client Acquisition', icon: Crosshair },
    { id: 'outreach', number: '05', label: 'Outreach', icon: Send, badge: pendingOutreachCount > 0 ? pendingOutreachCount : undefined },
    { id: 'crm', number: '06', label: 'CRM', icon: Users, badge: activeLeadsCount },
    { id: 'sales', number: '07', label: 'Sales', icon: Briefcase },
    { id: 'client-onboarding', number: '08', label: 'Client Onboarding', icon: UserCheck },
    { id: 'delivery-coordination', number: '09', label: 'Delivery & Coordination', icon: Cpu },
    { id: 'finance', number: '10', label: 'Finance', icon: DollarSign },
    { id: 'orchestration', number: '11', label: 'Orchestration', icon: Workflow, highlight: true },
    { id: 'intel', number: '12', label: 'Intel', icon: Radio, highlight: true },
    { id: 'knowledge-base', number: '13', label: 'Knowledge Base', icon: BookOpen },
    { id: 'settings', number: '14', label: 'Settings / Integrations', icon: SettingsIcon },
  ];

  return (
    <aside className="w-68 flex-shrink-0 h-screen sticky top-0 flex flex-col bg-[#0b0e14]/95 border-r border-slate-800/80 backdrop-blur-xl z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b0e14] rounded-[7px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-wide text-white font-mono">AETHER</span>
              <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Creator + Agency Engine</p>
          </div>
        </div>
      </div>

      {/* Interactive Quick Simulation Banners */}
      <div className="p-3 border-b border-slate-800/60 bg-gradient-to-b from-indigo-950/20 to-transparent">
        <button
          onClick={() => setIsDemoStoryModalOpen(true)}
          className="w-full group flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-800/50 text-indigo-200 text-xs font-medium transition-all shadow-sm shadow-indigo-950/50"
        >
          <div className="flex items-center space-x-2">
            <PlayCircle className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Interactive Demo Story</span>
          </div>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
            13 Steps
          </span>
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
          System Core
        </div>
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] font-mono text-slate-400 w-4">{item.number}</span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-semibold border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-2 px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Agency Engine
        </div>
        {navItems.slice(4, 10).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] font-mono text-slate-400 w-4">{item.number}</span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-2 px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
          Intelligence & Governance
        </div>
        {navItems.slice(10).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] font-mono text-slate-400 w-4">{item.number}</span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.highlight && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Primary CTA - Book an AI Growth & Operations Audit (Section 23) */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 space-y-2">
        <button
          onClick={() => setIsAuditModalOpen(true)}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all cursor-pointer active:scale-95"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Book AI Ops Audit</span>
        </button>

        {/* Live Multi-Agent Telemetry badge */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-950/70 border border-slate-800/60 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>21 Agents Online</span>
          </div>
          <span className="text-indigo-400 font-medium">{workingAgentsCount} active</span>
        </div>
      </div>
    </aside>
  );
};
