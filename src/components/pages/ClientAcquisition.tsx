import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Prospect } from '../../types';
import {
  Crosshair,
  Sliders,
  Search,
  ExternalLink,
  Sparkles,
  Send,
  Building,
  Target,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ClientAcquisition: React.FC = () => {
  const { prospects, updateProspectStatus, setActiveTab, addToast } = useApp();
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(prospects[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showICPBuilder, setShowICPBuilder] = useState(false);

  // ICP Builder state
  const [icpIndustry, setIcpIndustry] = useState('B2B Logistics Software & Tech Agencies');
  const [icpSize, setIcpSize] = useState('20 - 200 Employees');
  const [icpDecisionMaker, setIcpDecisionMaker] = useState('CCO, VP Sales, COO, Agency Founder');
  const [icpProblem, setIcpProblem] = useState('Slow inbound lead qualification, 4-hour response latency');
  const [icpBudget, setIcpBudget] = useState('$20,000 - $60,000 Annualized Implementation');

  const filteredProspects = prospects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.segment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header & ICP Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0d111a] border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Crosshair className="w-5 h-5 text-indigo-400" />
            <span>Client Acquisition & Prospect Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400">
            Enriched B2B accounts scored for fit, buying triggers, and autonomous pain hypotheses
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowICPBuilder(!showICPBuilder)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showICPBuilder ? 'Hide ICP Builder' : 'Configure ICP Profile'}</span>
          </button>
        </div>
      </div>

      {/* ICP Builder Drawer/Panel (Section 6) */}
      {showICPBuilder && (
        <div className="p-5 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-4 text-xs animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white font-mono uppercase tracking-wider">
              Ideal Customer Profile (ICP) Parameters
            </span>
            <span className="text-emerald-400 font-mono">Prospecting Agent Synced</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                Target Industry
              </label>
              <input
                type="text"
                value={icpIndustry}
                onChange={(e) => setIcpIndustry(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                Company Headcount
              </label>
              <input
                type="text"
                value={icpSize}
                onChange={(e) => setIcpSize(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                Decision Maker Titles
              </label>
              <input
                type="text"
                value={icpDecisionMaker}
                onChange={(e) => setIcpDecisionMaker(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                Primary Operational Bottleneck
              </label>
              <input
                type="text"
                value={icpProblem}
                onChange={(e) => setIcpProblem(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-mono text-[10px] uppercase">
                Likely Annualized Budget
              </label>
              <input
                type="text"
                value={icpBudget}
                onChange={(e) => setIcpBudget(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Section: Prospect Table + Research Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prospects List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by prospect, company, or market segment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            {filteredProspects.map((prospect) => {
              const isSelected = selectedProspect?.id === prospect.id;
              return (
                <div
                  key={prospect.id}
                  onClick={() => setSelectedProspect(prospect)}
                  className={`p-4 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/40'
                      : 'bg-[#0d111a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{prospect.name}</span>
                        <span className="text-slate-400 text-xs font-mono">• {prospect.title}</span>
                      </div>
                      <div className="text-xs text-indigo-300 font-medium mt-0.5">
                        {prospect.company} <span className="text-slate-400 font-mono">({prospect.size})</span>
                      </div>
                    </div>

                    {/* Fit & Intent Badges */}
                    <div className="flex items-center space-x-2 text-right">
                      <div className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                        Fit {prospect.fitScore}
                      </div>
                      <div className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                        Intent {prospect.intentScore}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-1 bg-black/30 p-1.5 rounded border border-slate-800/80">
                    <strong className="text-slate-400 uppercase font-mono text-[10px]">Probable Pain:</strong>{' '}
                    {prospect.probablePain}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-800/60 pt-2">
                    <span>Source: {prospect.source}</span>
                    <span className="text-indigo-400 flex items-center space-x-1">
                      <span>Inspect Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Research Drawer (5 cols) */}
        <div className="lg:col-span-5">
          {selectedProspect ? (
            <div className="p-5 rounded-xl bg-[#0d111a] border border-indigo-500/30 space-y-4 sticky top-20 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                    AI Account Research Dossier
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {selectedProspect.company}
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Decision Maker: {selectedProspect.name} ({selectedProspect.title})
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-400 font-mono">
                    {selectedProspect.fitScore}/100
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Opportunity Fit</span>
                </div>
              </div>

              {/* Fit Breakdown (Section 6 Example) */}
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30 text-emerald-200 space-y-1">
                <span className="font-bold text-[11px] uppercase font-mono block">
                  Opportunity Score Signals:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-300">
                  <li>Direct ICP match: {selectedProspect.segment}</li>
                  <li>Active hiring signal detected in sales engineering</li>
                  <li>Decision maker publicly active on LinkedIn</li>
                  <li>High operational friction in manual triage</li>
                </ul>
              </div>

              {/* Company Overview */}
              <div className="space-y-1">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">
                  Company Overview
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {selectedProspect.research.overview}
                </p>
              </div>

              {/* Likely Business Problems */}
              <div className="space-y-1">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">
                  Extracted Operational Problems
                </span>
                <div className="space-y-1">
                  {selectedProspect.research.businessProblems.map((prob, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                      • {prob}
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation Starter & Relevant Offer */}
              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40 space-y-1.5">
                <span className="text-indigo-300 font-mono text-[10px] uppercase font-semibold block">
                  Recommended Conversation Starter
                </span>
                <p className="text-slate-200 italic">
                  "{selectedProspect.research.conversationStarter}"
                </p>
                <div className="pt-1 text-[11px] text-cyan-300 font-mono">
                  Recommended Offer: {selectedProspect.research.recommendedOffer}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setActiveTab('outreach');
                    addToast({
                      title: 'Outreach Initialized',
                      message: `Loaded context for ${selectedProspect.name} (${selectedProspect.company}) into Outreach Builder.`,
                      type: 'info',
                    });
                  }}
                  className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Bespoke Outreach</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
              Select a prospect to view autonomous account research
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
