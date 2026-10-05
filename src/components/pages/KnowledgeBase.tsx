import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Database,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { agents, setSelectedAgentForInspection } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter((a) => {
    if (filterCategory !== 'all' && a.category !== filterCategory) return false;
    if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase()) && !a.role.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Agent Registry & Architecture Knowledge Base</span>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                Layer 1 Architect Governance
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Complete specifications for OS Manager + 21 Specialized Workers & Shared JSON Schemas
            </p>
          </div>
        </div>
      </div>

      {/* Architect Agent Governance & Response Contract */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Layer 1 Architect & Manager Spec */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs leading-relaxed">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold font-mono">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Layer 1 — Architect & OS Manager Governance</span>
          </div>
          <p className="text-slate-300">
            The OS Manager owns: <strong className="text-white font-mono">Understand → Plan → Dispatch → Inspect → Synthesize</strong>.
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            <li>Step 1 — Interpret: Determine real commercial objective</li>
            <li>Step 2 — Retrieve context: Load relevant CRM & Content memory</li>
            <li>Step 3 — Decompose: Form specialist worker task payloads</li>
            <li>Step 4 — Identify dependencies: Market Intel precedes Outreach</li>
            <li>Step 5 — Parallelize: Run independent creator & outreach tracks</li>
            <li>Step 6 — Evaluate: Run outputs through Content QA Agent</li>
            <li>Step 7 — Synthesize: Cohesive multi-channel deliverable</li>
            <li>Step 8 — Human Approval: Enforced before transmission</li>
          </ul>
        </div>

        {/* Shared Agent Response Contract */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs leading-relaxed">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold font-mono">
              <Code2 className="w-4 h-4" />
              <span>Section 18 — Shared Agent Response Contract</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Standardized JSON</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            Every one of the 21 workers adheres to this strict schema. This allows model hot-swapping without modifying application UI.
          </p>
          <pre className="text-[10px] font-mono text-indigo-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
{`{
  "task_id": "T-1024",
  "agent_id": "worker-05",
  "status": "completed",
  "summary": "Generated LinkedIn authority breakdown",
  "findings": ["Direct objection match from 7 CRM leads"],
  "recommendations": ["Queue 4 follow-up emails"],
  "confidence": 0.94,
  "approval_required": false
}`}
          </pre>
        </div>
      </div>

      {/* Data Architecture Entity Relationship (Section 19) */}
      <div className="p-5 rounded-xl bg-[#0d111a] border border-indigo-500/30 space-y-3 text-xs">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono">
          <Database className="w-4 h-4" />
          <span>Core Data Architecture & Revenue Attribution Chain</span>
        </div>
        <p className="text-slate-300">
          The central relational chain answering: <strong className="text-emerald-400">“Which content actually created revenue?”</strong>
        </p>
        <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 font-mono text-xs text-indigo-300 flex flex-wrap items-center justify-center gap-2 text-center">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold">ContentAsset</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold">Campaign</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold">Lead</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold">Opportunity</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-white font-bold">Client</span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-500/40">Revenue ($)</span>
        </div>
      </div>

      {/* 21 Worker Directory */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            All 21 Specialized Workers Directory
          </span>

          <div className="flex items-center space-x-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
            >
              <option value="all">All Categories</option>
              <option value="core">Core & Orchestration</option>
              <option value="content">Content OS</option>
              <option value="acquisition">Acquisition & Outreach</option>
              <option value="sales">Sales & Deals</option>
              <option value="delivery">Delivery & Onboarding</option>
              <option value="intelligence">Intelligence & Finance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentForInspection(agent)}
              className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-3 text-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{agent.avatar}</span>
                    <span className="font-bold text-white font-mono">{agent.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 uppercase">
                    {agent.category}
                  </span>
                </div>
                <div className="text-indigo-400 font-medium text-[11px]">{agent.role}</div>
                <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                  {agent.systemInstruction}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Confidence: {(agent.confidence * 100).toFixed(0)}%</span>
                <span className="text-indigo-400">View Contract →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
