import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentWorker } from '../../types';
import {
  Workflow,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  Layers,
  Activity,
  Cpu,
} from 'lucide-react';

export const Orchestration: React.FC = () => {
  const {
    agents,
    triggerClosedLoopSprint,
    isLoopRunning,
    setSelectedAgentForInspection,
    updateAgentStatus,
    addToast,
  } = useApp();

  const [liveLog, setLiveLog] = useState<string[]>([
    'OS Manager dispatched Market Intelligence signal mining task #T-1024',
    'Content Intelligence Agent clustered 11 cost inquiries and 7 complexity objections',
    'Manager synthesized buying friction: "Implementation complexity is currently the strongest friction"',
    'Content Strategist generated 3-part LinkedIn teardown sprint with 14-day zero-code guarantee',
    'Content Creator produced LinkedIn post #108, YouTube outline, and Instagram reel script',
    'Outreach Agent generated 4 personalized Day-3 follow-ups placed in Human Approval queue',
    'CRM Agent tagged originating revenue attribution across 5 active pipeline deals',
  ]);

  const handleCustomDispatch = (workerId: string) => {
    const agent = agents.find((a) => a.id === workerId);
    if (!agent) return;
    updateAgentStatus(workerId, 'working', `Running autonomous dispatch cycle on Gemini 3.8 Flash`);
    setLiveLog((prev) => [`Manual dispatch trigger sent to ${agent.name}`, ...prev]);
    addToast({
      title: `${agent.name} Running`,
      message: 'Worker received dispatch packet and is executing tool calls.',
      type: 'info',
    });
    setTimeout(() => {
      updateAgentStatus(workerId, 'completed', `Completed cycle with 98% confidence.`);
    }, 1500);
  };

  // Node helper
  const getNodeColor = (status: AgentWorker['status']) => {
    switch (status) {
      case 'working':
        return 'border-amber-400 bg-amber-950/30 text-amber-200 shadow-lg shadow-amber-500/20';
      case 'completed':
        return 'border-emerald-500/60 bg-emerald-950/20 text-emerald-200 shadow-sm';
      case 'needs_approval':
        return 'border-cyan-400 bg-cyan-950/30 text-cyan-200 animate-pulse';
      case 'waiting':
        return 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300';
      default:
        return 'border-slate-800 bg-[#0d111a] text-slate-300';
    }
  };

  const getStatusBadge = (status: AgentWorker['status']) => {
    switch (status) {
      case 'working':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">Working</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Completed</span>;
      case 'needs_approval':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Needs Approval</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">Idle</span>;
    }
  };

  const osManager = agents.find((a) => a.id === 'os-manager') || agents[0];
  const marketIntel = agents.find((a) => a.id === 'worker-01') || agents[1];
  const salesIntel = agents.find((a) => a.id === 'worker-12') || agents[11];
  const contentStrat = agents.find((a) => a.id === 'worker-04') || agents[4];
  const outreach = agents.find((a) => a.id === 'worker-09') || agents[8];
  const contentCreator = agents.find((a) => a.id === 'worker-05') || agents[5];
  const crmAgent = agents.find((a) => a.id === 'worker-11') || agents[10];
  const contentQA = agents.find((a) => a.id === 'worker-07') || agents[6];
  const followUp = agents.find((a) => a.id === 'worker-10') || agents[9];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner & Control */}
      <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Workflow className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Multi-Agent Dispatch & Orchestration Graph</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                21 Workers Registered
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive node topology: Understand → Plan → Dispatch → Inspect → Synthesize
            </p>
          </div>
        </div>

        <button
          onClick={() => triggerClosedLoopSprint()}
          disabled={isLoopRunning}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 text-cyan-300" />
          <span>{isLoopRunning ? 'Simulating Live Sprint...' : 'Run Closed-Loop Dispatch'}</span>
        </button>
      </div>

      {/* Visual React Flow Style Interactive Node Canvas (Section 13) */}
      <div className="p-8 rounded-2xl bg-[#080b12] border border-indigo-500/30 relative overflow-hidden bg-grid-pattern shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* LEVEL 1: User Goal & Architect Instruction */}
          <div className="flex flex-col items-center">
            <div className="px-5 py-2.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 shadow-md flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Root Objective: Neutralize CRM Implementation Friction Across Pipeline</span>
            </div>
            <ArrowDown className="w-4 h-4 text-slate-600 mt-2" />
          </div>

          {/* LEVEL 2: Central AI OS Manager Node */}
          <div className="flex justify-center">
            <div
              onClick={() => setSelectedAgentForInspection(osManager)}
              className={`w-full max-w-md p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${getNodeColor(
                osManager.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{osManager.avatar}</span>
                  <div>
                    <h3 className="font-bold text-white text-xs font-mono">{osManager.name}</h3>
                    <p className="text-[10px] text-slate-400">{osManager.role}</p>
                  </div>
                </div>
                {getStatusBadge(osManager.status)}
              </div>
              <p className="text-xs text-slate-300 mt-2 font-mono bg-black/40 p-2 rounded border border-slate-800/80">
                "{osManager.currentTask}"
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Latency: 1.1s</span>
                <span className="text-indigo-400">Click to Inspect Schemas →</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-600" />
          </div>

          {/* LEVEL 3: Intelligence Layer (Market & Sales Intelligence) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Market Intelligence */}
            <div
              onClick={() => setSelectedAgentForInspection(marketIntel)}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${getNodeColor(
                marketIntel.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{marketIntel.avatar}</span>
                  <span className="font-bold text-xs text-white font-mono">{marketIntel.name}</span>
                </div>
                {getStatusBadge(marketIntel.status)}
              </div>
              <p className="text-[11px] text-slate-300 mt-2 font-mono bg-black/40 p-1.5 rounded">
                {marketIntel.currentTask}
              </p>
            </div>

            {/* Sales Intelligence */}
            <div
              onClick={() => setSelectedAgentForInspection(salesIntel)}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${getNodeColor(
                salesIntel.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span>{salesIntel.avatar}</span>
                  <span className="font-bold text-xs text-white font-mono">{salesIntel.name}</span>
                </div>
                {getStatusBadge(salesIntel.status)}
              </div>
              <p className="text-[11px] text-slate-300 mt-2 font-mono bg-black/40 p-1.5 rounded">
                {salesIntel.currentTask}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-600" />
          </div>

          {/* LEVEL 4: Dual Dispatch Tracks (Content OS vs Outreach & Sales) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Track: Content OS Sprint */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
              <span className="text-[11px] font-mono uppercase font-bold text-indigo-400 block pb-1 border-b border-slate-800">
                Track A: Content OS Pipeline
              </span>

              {/* Content Strategist */}
              <div
                onClick={() => setSelectedAgentForInspection(contentStrat)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${getNodeColor(
                  contentStrat.status
                )}`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>{contentStrat.avatar} {contentStrat.name}</span>
                  {getStatusBadge(contentStrat.status)}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">{contentStrat.currentTask}</p>
              </div>

              {/* Content Creator */}
              <div
                onClick={() => setSelectedAgentForInspection(contentCreator)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${getNodeColor(
                  contentCreator.status
                )}`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>{contentCreator.avatar} {contentCreator.name}</span>
                  {getStatusBadge(contentCreator.status)}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">{contentCreator.currentTask}</p>
              </div>

              {/* Content QA Critic */}
              <div
                onClick={() => setSelectedAgentForInspection(contentQA)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${getNodeColor(
                  contentQA.status
                )}`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>{contentQA.avatar} {contentQA.name}</span>
                  {getStatusBadge(contentQA.status)}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">{contentQA.currentTask}</p>
              </div>
            </div>

            {/* Right Track: Outreach & CRM Pipeline */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-400 block pb-1 border-b border-slate-800">
                Track B: Acquisition & Pipeline
              </span>

              {/* Outreach Agent */}
              <div
                onClick={() => setSelectedAgentForInspection(outreach)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${getNodeColor(
                  outreach.status
                )}`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>{outreach.avatar} {outreach.name}</span>
                  {getStatusBadge(outreach.status)}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">{outreach.currentTask}</p>
              </div>

              {/* CRM Agent */}
              <div
                onClick={() => setSelectedAgentForInspection(crmAgent)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${getNodeColor(
                  crmAgent.status
                )}`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>{crmAgent.avatar} {crmAgent.name}</span>
                  {getStatusBadge(crmAgent.status)}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">{crmAgent.currentTask}</p>
              </div>

              {/* Follow-Up Agent */}
              <div
                onClick={() => setSelectedAgentForInspection(followUp)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${getNodeColor(
                  followUp.status
                )}`}
              >
                <div className="flex justify-between items-center text-xs font-mono">
                  <span>{followUp.avatar} {followUp.name}</span>
                  {getStatusBadge(followUp.status)}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">{followUp.currentTask}</p>
              </div>
            </div>
          </div>

          {/* LEVEL 5: Synthesis & Human Approval Gate */}
          <div className="flex flex-col items-center">
            <ArrowDown className="w-4 h-4 text-slate-600 mb-2" />
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-500/40 text-center max-w-md w-full shadow-lg">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase block mb-1">
                Step 8: Human-in-the-Loop Approval Gate
              </span>
              <p className="text-[11px] text-slate-300">
                External messages, financial modifications, and public content publishing require explicit operator sign-off before transmission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed Panel (Section 13) */}
      <div className="p-5 rounded-xl bg-[#0d111a] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase font-mono flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Autonomous Multi-Agent Activity Log</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">Real-time telemetry</span>
        </div>

        <div className="space-y-1.5 font-mono text-xs text-slate-300">
          {liveLog.map((log, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start space-x-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
