import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { NavTab } from '../types';

interface DemoStoryStep {
  step: number;
  title: string;
  badge: string;
  navTab: NavTab;
  agent: string;
  story: string;
  whatHappened: string;
  systemEffect: string;
}

const DEMO_STEPS: DemoStoryStep[] = [
  {
    step: 1,
    title: 'Prospect Discovers High-Authority Content',
    badge: 'Content OS',
    navTab: 'content-os',
    agent: 'worker-05 (Content Creator)',
    story: 'Jordan Hayes (CEO, CloudScale Systems) sees LinkedIn Post #101: "The Hidden Cost of Fragmented SDR Tooling (Why 8 Tools Lose You Deals)".',
    whatHappened: 'Post articulates the exact 4-hour latency bottleneck Jordan experiences with his 4 SDRs.',
    systemEffect: 'Jordan comments on LinkedIn and downloads the 1-page Workflow Map.',
  },
  {
    step: 2,
    title: 'Inbound Signal Becomes a Lead',
    badge: 'CRM Ingestion',
    navTab: 'crm',
    agent: 'worker-11 (CRM Agent)',
    story: 'Webhook fires from LinkedIn organic lead capture form into AetherOS.',
    whatHappened: 'CRM Agent intercepts form-fill within 1.2 seconds, preventing lead drop-off.',
    systemEffect: 'Lead created with direct First-Touch attribution to Content #101 ($24,000 potential value).',
  },
  {
    step: 3,
    title: 'Autonomous Account Enrichment & Fit Scoring',
    badge: 'Client Acquisition',
    navTab: 'client-acquisition',
    agent: 'worker-08 (Prospecting Agent)',
    story: 'Prospecting Agent pulls Clearbit telemetry, hiring signals, and recent executive announcements.',
    whatHappened: 'CloudScale Systems classified as Tier-1 ICP: 45 employees, high hiring velocity, fit score 94/100.',
    systemEffect: 'Automated executive dossier compiled with probable operational pain points.',
  },
  {
    step: 4,
    title: 'Bespoke Non-Spam Outreach Drafted',
    badge: 'Outreach Studio',
    navTab: 'outreach',
    agent: 'worker-09 (Outreach Agent)',
    story: 'Outreach Agent generates 4-part personalized message: Observation -> Relevance -> Insight -> Question.',
    whatHappened: 'Draft references Jordan\'s specific LinkedIn comment and EMEA team expansion.',
    systemEffect: 'Draft placed into Human Approval Queue (human operator clicks 1-tap Approve).',
  },
  {
    step: 5,
    title: 'Lead Enters CRM Pipeline with Full Context',
    badge: 'CRM Pipeline',
    navTab: 'crm',
    agent: 'worker-11 (CRM Agent)',
    story: 'Jordan replies to the message within 40 minutes requesting a discovery conversation.',
    whatHappened: 'CRM Agent transitions deal from "Contacted" -> "Engaged" -> "Qualified".',
    systemEffect: 'Calendar invite confirmed and Discovery Copilot workspace initialized.',
  },
  {
    step: 6,
    title: 'Discovery Meeting with AI Pre-Call Intel',
    badge: 'Sales Workspace',
    navTab: 'sales',
    agent: 'worker-12 (Sales Intelligence)',
    story: 'Founder enters Zoom call equipped with real-time Pre-Call Intel dossier.',
    whatHappened: 'Founder already knows CloudScale loses 30% of demos to faster competitors.',
    systemEffect: 'Discovery Copilot logs bottleneck, business impact, and $30k approved budget.',
  },
  {
    step: 7,
    title: 'Sales Intelligence Extracts Pain & Objections',
    badge: 'Sales Intelligence',
    navTab: 'sales',
    agent: 'worker-12 (Sales Intelligence)',
    story: 'Call transcript parsed immediately after Zoom call wraps.',
    whatHappened: 'Agent extracts critical objection: "We worry our internal engineers will have to maintain custom code."',
    systemEffect: 'Objection tagged in CRM and broadcast to central Intelligence Layer.',
  },
  {
    step: 8,
    title: 'Proposal Agent Generates 8-Section Agreement',
    badge: 'Proposal Studio',
    navTab: 'sales',
    agent: 'worker-13 (Proposal Agent)',
    story: 'Proposal Agent synthesizes call notes into comprehensive $24,000 enterprise agreement.',
    whatHappened: 'Includes Current State, Problem, Recommended System, and 14-Day Zero-Code Guarantee.',
    systemEffect: 'Proposal sent to Jordan in under 15 minutes while buying momentum is peak.',
  },
  {
    step: 9,
    title: 'Deal Closes & First Invoice Settled',
    badge: 'Finance OS',
    navTab: 'finance',
    agent: 'worker-19 (Finance Intelligence)',
    story: 'Jordan executes e-signature and pays initial $12,000 setup invoice via Stripe.',
    whatHappened: 'CRM moves deal to WON. Content #101 receives closed-revenue attribution ($24,000).',
    systemEffect: 'Finance Agent records revenue and updates agency unit economics.',
  },
  {
    step: 10,
    title: 'Autonomous Onboarding Sequence Initiated',
    badge: 'Onboarding',
    navTab: 'client-onboarding',
    agent: 'worker-14 (Onboarding Agent)',
    story: 'Onboarding Agent provisions Slack Connect channel and sends secure credential questionnaire.',
    whatHappened: 'Client receives zero-delay welcome experience without manual admin delay.',
    systemEffect: 'Onboarding health score tracks at 92%; kickoff call scheduled.',
  },
  {
    step: 11,
    title: 'Project Coordination Monitors Delivery Health',
    badge: 'Delivery Room',
    navTab: 'delivery-coordination',
    agent: 'worker-15 (Project Coordinator)',
    story: 'Delivery enters Stage 2 (Design & Sandbox API Handshake).',
    whatHappened: 'Project Coordinator monitors active webhooks and flags missing IT key before it blocks sprint.',
    systemEffect: 'Automation health index remains above 94%.',
  },
  {
    step: 12,
    title: 'Intel Aggregates the Recurring Objection Signal',
    badge: 'Intel Engine',
    navTab: 'intel',
    agent: 'worker-20 (Business Intelligence)',
    story: 'Across 18 prospects and 3 sales calls, Intel identifies: "Implementation complexity is the #1 friction."',
    whatHappened: 'The Intelligence Agent concludes: "Implementation complexity is currently the strongest buying friction."',
    systemEffect: 'Autonomous dispatch sequence triggered back to Content OS and Offer positioning.',
  },
  {
    step: 13,
    title: 'The Closed Loop: Content OS Generates Tomorrow\'s Post',
    badge: 'Revenue-to-Content Loop',
    navTab: 'content-os',
    agent: 'worker-05 (Content Creator)',
    story: 'Content OS transforms Jordan\'s exact sales objection into a high-authority LinkedIn post.',
    whatHappened: 'Post title: "Why Mid-Market CTOs Fear AI Implementation (And The 14-Day Solution)".',
    systemEffect: 'The real customer signal fuels Content -> Engagement -> Leads -> Sales -> New Content.',
  },
];

export const DemoStoryModal: React.FC = () => {
  const {
    isDemoStoryModalOpen,
    setIsDemoStoryModalOpen,
    demoStepIndex,
    setDemoStepIndex,
    setActiveTab,
  } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = DEMO_STEPS[demoStepIndex] || DEMO_STEPS[0];

  useEffect(() => {
    let interval: any;
    if (isPlaying && isDemoStoryModalOpen) {
      interval = setInterval(() => {
        setDemoStepIndex((prev) => {
          if (prev >= DEMO_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          setActiveTab(DEMO_STEPS[next].navTab);
          return next;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isDemoStoryModalOpen, setDemoStepIndex, setActiveTab]);

  if (!isDemoStoryModalOpen) return null;

  const goToStep = (idx: number) => {
    setDemoStepIndex(idx);
    setActiveTab(DEMO_STEPS[idx].navTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0d111a] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
              13
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Continuous Demo Story Walkthrough
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  Closed-Loop Simulation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Experience how 1 real customer objection travels through all 14 operating layers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isPlaying
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Story' : 'Auto-Play Story'}</span>
            </button>
            <button
              onClick={() => setIsDemoStoryModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Pill Grid */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto flex space-x-1.5 scrollbar-thin">
          {DEMO_STEPS.map((s, idx) => {
            const isActive = idx === demoStepIndex;
            const isPassed = idx < demoStepIndex;
            return (
              <button
                key={s.step}
                onClick={() => goToStep(idx)}
                className={`flex-shrink-0 px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center space-x-1.5 border ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-sm shadow-cyan-500/20'
                    : isPassed
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{s.step < 10 ? `0${s.step}` : s.step}</span>
                {isPassed && <CheckCircle className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Story Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Step {currentStep.step} of 13
              </span>
              <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                Active View: {currentStep.badge}
              </span>
            </div>
            <button
              onClick={() => {
                setActiveTab(currentStep.navTab);
                setIsDemoStoryModalOpen(false);
              }}
              className="text-xs text-indigo-300 hover:text-indigo-200 flex items-center space-x-1 font-mono"
            >
              <span>Jump directly to {currentStep.badge}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white tracking-wide">
            {currentStep.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono block">
                Responsible Agent
              </span>
              <div className="text-sm font-semibold text-indigo-400">
                {currentStep.agent}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.story}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase font-mono block">
                Telemetry & Signal
              </span>
              <div className="text-sm font-semibold text-cyan-400">
                What Happened
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.whatHappened}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
              <span className="text-[11px] font-semibold text-indigo-300 uppercase font-mono block">
                System Impact
              </span>
              <div className="text-sm font-semibold text-emerald-400">
                Continuous Closed Loop
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.systemEffect}
              </p>
            </div>
          </div>

          {/* Central Loop Diagram Visualizer */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 font-mono">
            <div className="flex items-center space-x-2 text-cyan-400 mb-2 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Revenue-to-Content Loop Architecture Trace:</span>
            </div>
            <div className="text-slate-400 leading-relaxed">
              Market → Sales Conversations → CRM Data → Objections → Content → Engagement → Leads → Sales → Client Results → New Content
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => goToStep(Math.max(0, demoStepIndex - 1))}
            disabled={demoStepIndex === 0}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            Step {demoStepIndex + 1} of {DEMO_STEPS.length}
          </span>

          <button
            onClick={() => {
              if (demoStepIndex >= DEMO_STEPS.length - 1) {
                setIsDemoStoryModalOpen(false);
              } else {
                goToStep(demoStepIndex + 1);
              }
            }}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30"
          >
            <span>{demoStepIndex === DEMO_STEPS.length - 1 ? 'Finish Story' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
