import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FIVE_PLATFORM_TOPICS } from '../../data/moduleAgents';
import { SocialPlatformIdea } from '../../types';
import {
  Sparkles,
  Play,
  Copy,
  CheckCircle2,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Layers,
  Zap,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Video,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const ContentOS: React.FC = () => {
  const {
    liveScriptState,
    generateViralScript,
    contentAssets,
    addToast,
    setActiveTab,
  } = useApp();

  const [activePlatform, setActivePlatform] = useState<'linkedin' | 'youtube' | 'instagram' | 'facebook'>('linkedin');
  const [platformIdeas, setPlatformIdeas] = useState(FIVE_PLATFORM_TOPICS);
  const [selectedIdea, setSelectedIdea] = useState<SocialPlatformIdea>(FIVE_PLATFORM_TOPICS.linkedin[0]);
  const [isCopied, setIsCopied] = useState(false);

  const currentPlatformIdeas = platformIdeas[activePlatform] || FIVE_PLATFORM_TOPICS[activePlatform];

  const handleSelectPlatform = (platform: 'linkedin' | 'youtube' | 'instagram' | 'facebook') => {
    setActivePlatform(platform);
    setSelectedIdea(platformIdeas[platform][0]);
  };

  const handleGenerateScript = () => {
    if (!selectedIdea) return;
    generateViralScript(activePlatform, selectedIdea.topic);
  };

  const handleCopyScript = () => {
    if (!liveScriptState.resultScript) return;
    const fullText = `[HOOK]\n${liveScriptState.resultScript.hook}\n\n[VISUAL CUES]\n${liveScriptState.resultScript.visualDirection}\n\n[SCRIPT BODY]\n${liveScriptState.resultScript.body}\n\n[CALL TO ACTION]\n${liveScriptState.resultScript.callToAction}\n\n${liveScriptState.resultScript.viralHashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    addToast({
      title: 'Script Copied to Clipboard',
      message: 'Full viral script with visual cues & CTA is ready for production.',
      type: 'success',
    });
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* World-Class AI Content Creator Agent Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-[#0e1424] to-[#12192e] border border-indigo-500/40 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-xl">
              ✍️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-mono">
                  World-Class AI Content Creator Agent
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Autonomous Script Engine
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Produces ultra-powerful, viral AI scripts on the spot with real-time processing infographics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('content-calendar');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              View Publishing Calendar →
            </button>
          </div>
        </div>

        {/* Content Segregation Strategy (User Specification) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-1">
            <div className="flex items-center space-x-2 text-blue-400 font-mono font-bold text-[11px]">
              <Linkedin className="w-3.5 h-3.5" />
              <span>LINKEDIN SEGREGATION: 100% AI Agency Systems & Business</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Exclusively publish about the <strong>AI agency systems you are developing</strong>, <strong>agentic workflows</strong>, the agents you are building, client architectures, and the business side of running an agency.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1">
            <div className="flex items-center space-x-2 text-purple-400 font-mono font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>YOUTUBE / IG / FB: 100% Cutting-Edge AI Stuff & Demos</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Exclusively create content about <strong>cutting-edge AI tools</strong>, <strong>autonomous AI agent tutorials</strong>, terminal screen recordings, live benchmark comparisons, and viral AI breakdowns.
            </p>
          </div>
        </div>
      </div>

      {/* Social Media Platform Selector (Fresh Tabs) */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
        {[
          { id: 'linkedin', label: 'LinkedIn (AI Agency Systems & Business)', icon: Linkedin, color: 'text-blue-400' },
          { id: 'youtube', label: 'YouTube (Cutting-Edge AI & Tutorials)', icon: Youtube, color: 'text-red-400' },
          { id: 'instagram', label: 'Instagram (Fast AI Demos & Reels)', icon: Instagram, color: 'text-pink-400' },
          { id: 'facebook', label: 'Facebook (AI Community & Discussions)', icon: Facebook, color: 'text-indigo-400' },
        ].map((plat) => {
          const Icon = plat.icon;
          const isActive = activePlatform === plat.id;
          return (
            <button
              key={plat.id}
              onClick={() => handleSelectPlatform(plat.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${plat.color}`} />
              <span>{plat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Content Studio: 5 AI Topics + Live Script Infographics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5 Topics for Selected Platform (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center space-x-1.5">
              <span>5 Curated AI Topics for {activePlatform.toUpperCase()}</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              High Viral Potential
            </span>
          </div>

          <div className="space-y-2.5">
            {currentPlatformIdeas.map((idea, idx) => {
              const isSelected = selectedIdea?.id === idea.id;
              return (
                <div
                  key={idea.id}
                  onClick={() => setSelectedIdea(idea)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-500/80 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/40'
                      : 'bg-[#0d111a] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                      Topic 0{idx + 1} • {idea.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {idea.estimatedViralPotential}% Viral Score
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs leading-snug">
                    {idea.topic}
                  </h3>

                  <p className="text-[11px] text-slate-300 italic bg-black/30 p-2 rounded border border-slate-800/80 line-clamp-2">
                    "{idea.hookTeaser}"
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/60">
                    <span className="text-indigo-400">{idea.targetFocus}</span>
                    <span className="text-white font-semibold">Click to select →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Script Generator & Real-Time Infographic Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#0d111a] border border-indigo-500/40 space-y-5 text-xs text-slate-200">
            {/* Header of Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  Selected Topic for Instant Live Generation
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedIdea?.topic}
                </h3>
                <span className="text-[11px] text-indigo-300 font-mono">
                  Platform Target: {activePlatform.toUpperCase()}
                </span>
              </div>

              <button
                onClick={handleGenerateScript}
                disabled={liveScriptState.isGenerating}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer ${
                  liveScriptState.isGenerating
                    ? 'bg-amber-600/70 text-white animate-pulse'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-600/30'
                }`}
              >
                <Zap className={`w-4 h-4 ${liveScriptState.isGenerating ? 'animate-spin text-amber-300' : 'text-cyan-300'}`} />
                <span>
                  {liveScriptState.isGenerating
                    ? `Generating Script (${liveScriptState.progress}%)`
                    : 'Generate Viral Script Live (1-Click)'}
                </span>
              </button>
            </div>

            {/* REAL-TIME PROCESSING INFOGRAPHIC & PROGRESS DISPLAY (User Request) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Agent Processing Infographic Display</span>
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {liveScriptState.progress}% Completed
                </span>
              </div>

              {/* Progress Bar (0% to 100%) */}
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${liveScriptState.progress}%` }}
                ></div>
              </div>

              <div className="text-[11px] text-indigo-300 font-mono">
                Current Phase: <strong className="text-white">{liveScriptState.phase}</strong>
              </div>

              {/* 4-Step Infographic Steps Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[10px] font-mono">
                {liveScriptState.infographicSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border transition-all space-y-1 ${
                      step.completed
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                        : step.active
                        ? 'bg-indigo-950/50 border-indigo-400 text-indigo-200 animate-pulse'
                        : 'bg-black/30 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{step.step}</span>
                      {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {step.active && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                    </div>
                    <p className="text-[9px] text-slate-300 leading-tight">
                      {step.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* THE GENERATED VIRAL SCRIPT RESULT */}
            {liveScriptState.resultScript ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-xs uppercase font-mono flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Viral Script Generated on the Spot</span>
                  </span>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'Copied!' : 'Copy Script'}</span>
                  </button>
                </div>

                {/* Hook Box */}
                <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-indigo-300 block">
                    ⚡ Shocking Viral Hook (0:00 - 0:03)
                  </span>
                  <p className="text-white font-semibold text-xs leading-relaxed">
                    "{liveScriptState.resultScript.hook}"
                  </p>
                </div>

                {/* Visual Direction */}
                <div className="p-3 rounded-lg bg-black/40 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                  <strong>Visual & Scene Direction:</strong> {liveScriptState.resultScript.visualDirection}
                </div>

                {/* Script Body */}
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">
                    Full Script Body & Telemetry Breakdown
                  </span>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {liveScriptState.resultScript.body}
                  </div>
                </div>

                {/* Call to Action & Hashtags */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                  <div className="text-xs text-white">
                    <strong className="text-emerald-400 font-mono uppercase text-[10px] block mb-0.5">High-Conversion CTA Trigger:</strong>
                    {liveScriptState.resultScript.callToAction}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {liveScriptState.resultScript.viralHashtags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-400 space-y-2 border border-dashed border-slate-800 rounded-xl">
                <Video className="w-8 h-8 text-indigo-400 mx-auto opacity-60" />
                <p className="text-xs text-slate-300 font-medium">
                  Select any of the 5 AI topics on the left and click "Generate Viral Script Live"
                </p>
                <p className="text-[11px] text-slate-400">
                  The agent will simulate the complete retention architecture, visual cuts, and proof metrics in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
