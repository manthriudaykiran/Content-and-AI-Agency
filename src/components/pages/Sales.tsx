import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesCall, Proposal } from '../../types';
import {
  Briefcase,
  Mic,
  FileCheck,
  CheckCircle,
  Sparkles,
  DollarSign,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Download,
  Send,
} from 'lucide-react';

export const Sales: React.FC = () => {
  const { salesCalls, proposals, updateProposalStatus, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'copilot' | 'call-intel' | 'proposal-builder'>('proposal-builder');

  const currentCall = salesCalls[0];
  const [selectedProposal, setSelectedProposal] = useState<Proposal>(proposals[0]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0d111a] border border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Sales Workspace & Discovery Copilot</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pre-Call Intel → Live Discovery Copilot → Post-Call Objection Mining → 8-Section Proposal Engine
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex space-x-1.5 p-1 rounded-lg bg-black/40 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('proposal-builder')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'proposal-builder'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Proposal Builder
          </button>
          <button
            onClick={() => setActiveTab('call-intel')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'call-intel'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Post-Call Intelligence
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'copilot'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pre-Call & Discovery Copilot
          </button>
        </div>
      </div>

      {/* Tab 1: Proposal Builder (Section 9 requirements) */}
      {activeTab === 'proposal-builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Proposal list sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              Active Proposals
            </span>
            {proposals.map((prop) => (
              <div
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  selectedProposal?.id === prop.id
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/40'
                    : 'bg-[#0d111a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{prop.companyName}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${prop.dealValue.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Client: {prop.clientName} • Status: <span className="capitalize text-indigo-300 font-mono">{prop.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 8-Section Proposal Document Viewer (Section 9) */}
          <div className="lg:col-span-8 p-6 rounded-xl bg-[#0d111a] border border-indigo-500/30 space-y-5 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  Autonomous Solution Proposal Doc
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Statement of Work: {selectedProposal.companyName}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    updateProposalStatus(selectedProposal.id, 'sent');
                    addToast({
                      title: 'Proposal Dispatched',
                      message: `Sent formal agreement to ${selectedProposal.clientName} via HelloSign/DocuSign integration.`,
                      type: 'success',
                    });
                  }}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Agreement</span>
                </button>
              </div>
            </div>

            {/* The 8 Required Sections */}
            <div className="space-y-4 leading-relaxed">
              {/* 1. Current State */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <strong className="text-indigo-300 font-mono text-[11px] uppercase block">
                  1. Current State
                </strong>
                <p className="text-slate-300">{selectedProposal.sections.currentState}</p>
              </div>

              {/* 2. Problem */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <strong className="text-indigo-300 font-mono text-[11px] uppercase block">
                  2. Operational Bottleneck & Business Impact
                </strong>
                <p className="text-slate-300">{selectedProposal.sections.problem}</p>
              </div>

              {/* 3. Recommended System */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <strong className="text-cyan-300 font-mono text-[11px] uppercase block">
                  3. Recommended Autonomous System
                </strong>
                <p className="text-slate-300">{selectedProposal.sections.recommendedSystem}</p>
              </div>

              {/* 4. Implementation */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <strong className="text-cyan-300 font-mono text-[11px] uppercase block">
                  4. Implementation Plan (Zero-Code Handshake)
                </strong>
                <p className="text-slate-300">{selectedProposal.sections.implementation}</p>
              </div>

              {/* 5. Deliverables */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5">
                <strong className="text-emerald-400 font-mono text-[11px] uppercase block">
                  5. Deliverables & Infrastructure Workflows
                </strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {selectedProposal.sections.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* 6. Success Metrics */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5">
                <strong className="text-emerald-400 font-mono text-[11px] uppercase block">
                  6. Agreed Success Metrics & SLAs
                </strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {selectedProposal.sections.successMetrics.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* 7. Commercials */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/40 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Setup & Build Fee</span>
                  <span className="text-base font-bold text-white font-mono">
                    ${selectedProposal.sections.commercials.setupFee.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Monthly Managed Retainer</span>
                  <span className="text-base font-bold text-cyan-300 font-mono">
                    ${selectedProposal.sections.commercials.monthlyRetainer.toLocaleString()}/mo
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-mono uppercase block">Estimated ROI</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {selectedProposal.sections.commercials.roiEstimate}
                  </span>
                </div>
              </div>

              {/* 8. Next Step */}
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <strong className="text-indigo-300 font-mono text-[11px] uppercase block">
                  8. Immediate Next Step
                </strong>
                <p className="text-slate-300">{selectedProposal.sections.nextStep}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Call Intelligence (Objections, Signals, Competitors) */}
      {activeTab === 'call-intel' && currentCall && (
        <div className="p-6 rounded-xl bg-[#0d111a] border border-indigo-500/30 space-y-5 text-xs text-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                Post-Call Intelligence Analysis
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Discovery Session: {currentCall.leadName} ({currentCall.company})
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{currentCall.date}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Extracted Objections */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
              <span className="text-amber-300 font-bold uppercase font-mono text-[11px] flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Extracted Buyer Objections</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-amber-200">
                {currentCall.postCallIntel?.objections.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>

            {/* Purchase Signals */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
              <span className="text-emerald-300 font-bold uppercase font-mono text-[11px] flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>High-Intent Purchase Signals</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-emerald-200">
                {currentCall.postCallIntel?.purchaseSignals.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pre-Call Intel & Discovery Copilot */}
      {activeTab === 'copilot' && currentCall && (
        <div className="p-6 rounded-xl bg-[#0d111a] border border-indigo-500/30 space-y-5 text-xs text-slate-200">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Pre-Call Intel & Discovery Copilot: {currentCall.company}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-indigo-300 font-bold font-mono text-[11px] uppercase block">
                Recommended Discovery Questions
              </span>
              <ul className="space-y-1.5">
                {currentCall.preCallIntel.recommendedQuestions.map((q, i) => (
                  <li key={i} className="p-2 rounded bg-black/40 border border-slate-800 text-slate-200">
                    "{q}"
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-cyan-300 font-bold font-mono text-[11px] uppercase block">
                Content Consumed by Prospect Prior to Call
              </span>
              <ul className="space-y-1 text-slate-300">
                {currentCall.preCallIntel.contentConsumed.map((c, i) => (
                  <li key={i} className="p-2 rounded bg-black/40 border border-slate-800">
                    🎬 {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
