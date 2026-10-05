import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Workflow,
  ArrowRight,
  ShieldAlert,
  Layers,
} from 'lucide-react';

export const Intel: React.FC = () => {
  const { intelSignals, loop, triggerClosedLoopSprint, isLoopRunning, addToast } = useApp();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Radio className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Closed-Loop Market & Operational Intel</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                11 Data Streams Connected
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Aggregating signals across Content, CRM, Sales Calls, Invoices & Delivery
            </p>
          </div>
        </div>

        <button
          onClick={() => triggerClosedLoopSprint()}
          disabled={isLoopRunning}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-300" />
          <span>{isLoopRunning ? 'Synthesizing...' : 'Re-Run Intelligence Cycle'}</span>
        </button>
      </div>

      {/* Flagship Differentiator: Revenue-to-Content Intelligence Loop (Section 1) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-[#0d1322] to-slate-900 border border-indigo-500/40 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-indigo-500/30">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              Signature Closed-Loop Architecture
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Active Synthesis
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Last Updated: {loop.lastUpdated}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">
            Primary Feedback Loop: Market → Sales → CRM → Objections → Content → Engagement → Leads → Sales → Client Results
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            {loop.conclusion}
          </p>
        </div>

        {/* Real Data Points that triggered the loop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Cost Inquiries</span>
            <span className="text-base font-bold text-indigo-400">
              {loop.dataPoints.inquiriesCount} Prospects
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Complexity Objections</span>
            <span className="text-base font-bold text-amber-400">
              {loop.dataPoints.objectionsCount} Logged
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Sales Call Mentions</span>
            <span className="text-base font-bold text-cyan-400">
              {loop.dataPoints.salesCallMentions} Discovery Calls
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Leads Generated</span>
            <span className="text-base font-bold text-emerald-400">
              {loop.dataPoints.leadsGeneratedFromTopic} Qualified
            </span>
          </div>
        </div>

        {/* 5-Agent Dispatch Manifest */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
          <span className="font-bold text-indigo-300 uppercase font-mono text-[10px] block">
            Autonomous Coordinated Dispatch Manifest
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="p-2 rounded bg-black/40 border border-slate-800">
              <strong className="text-indigo-400 font-mono block">1. Sales Intelligence Agent:</strong>
              {loop.dispatchedAgents.salesIntelligence}
            </div>
            <div className="p-2 rounded bg-black/40 border border-slate-800">
              <strong className="text-cyan-400 font-mono block">2. Content Strategist:</strong>
              {loop.dispatchedAgents.contentStrategist}
            </div>
            <div className="p-2 rounded bg-black/40 border border-slate-800">
              <strong className="text-purple-400 font-mono block">3. Content Creator:</strong>
              {loop.dispatchedAgents.contentCreator}
            </div>
            <div className="p-2 rounded bg-black/40 border border-slate-800">
              <strong className="text-amber-400 font-mono block">4. Outreach Agent:</strong>
              {loop.dispatchedAgents.outreachAgent}
            </div>
            <div className="p-2 rounded bg-black/40 border border-slate-800 md:col-span-2">
              <strong className="text-emerald-400 font-mono block">5. Positioning & Offer Agent:</strong>
              {loop.dispatchedAgents.offerAgent}
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Cards (Section 14) */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-white font-mono block">
          Strategic Intelligence Signals
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intelSignals.map((signal) => (
            <div
              key={signal.id}
              className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-3 text-xs flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                    signal.impactScore === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    signal.impactScore === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {signal.type.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    Freq: {signal.frequency}x
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs leading-snug">
                  {signal.title}
                </h4>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {signal.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                <strong>Action Taken:</strong> {signal.actionTaken}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Automation Roadmap (Section 14) */}
      <div className="p-5 rounded-xl bg-[#0d111a] border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white font-mono uppercase tracking-wider text-xs">
              Autonomous Systems Roadmap (Sales Demonstration Asset)
            </h3>
            <p className="text-[11px] text-slate-400">
              Recommended automations ranked by Impact, Frequency, and Implementation Complexity
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              opp: 'Automate Zero-Code Environment Sandboxing',
              impact: 'High ($45k pipeline recovery)',
              freq: '18 prospects',
              complex: 'Medium',
              agent: 'worker-16 (Solution Architect)',
              plan: 'Deploy serverless container templates with 1-click customer handshake verification.',
            },
            {
              opp: 'Autonomous Credential Verification Ping Sequence',
              impact: 'Saves 14 hrs/week of manual account manager reminders',
              freq: '73% of onboardings',
              complex: 'Low',
              agent: 'worker-14 (Onboarding Agent)',
              plan: 'Connect Slack API to monitor unverified webhooks after 48h and trigger polite nudges.',
            },
            {
              opp: 'Sales Call Objection Extractor Add-on Tier',
              impact: 'New $1,500/mo recurring revenue line',
              freq: '6 warm requests',
              complex: 'Low',
              agent: 'worker-02 (Positioning & Offer)',
              plan: 'Package Zoom / Fireflies transcript analyzer as a standalone micro-SaaS tier.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono text-xs">{item.opp}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Complexity: {item.complex}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-300 font-mono">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Expected Impact:</span>
                  <span className="text-emerald-400 font-semibold">{item.impact}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Detected Frequency:</span>
                  <span>{item.freq}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Assigned Agent:</span>
                  <span className="text-cyan-400">{item.agent}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 bg-black/30 p-2 rounded border border-slate-800">
                <strong className="text-slate-300">Action Plan:</strong> {item.plan}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
