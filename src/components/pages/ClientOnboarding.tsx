import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Key,
  FileText,
  Send,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const ClientOnboarding: React.FC = () => {
  const { onboarding, toggleOnboardingChecklist, addToast } = useApp();

  const handleSendReminder = () => {
    addToast({
      title: 'Automated Ping Dispatched',
      message: 'Onboarding Agent sent secure credential reminder to client Slack Connect channel.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Client Onboarding Engine</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {onboarding.healthScore}% Onboarding Health
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Active Client: {onboarding.clientName} ({onboarding.company}) • Won {onboarding.dealWonDate}
            </p>
          </div>
        </div>

        <button
          onClick={handleSendReminder}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Dispatch Credential Ping</span>
        </button>
      </div>

      {/* 8-Stage Onboarding Transition Pipeline (Section 10) */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
          Deal Won → Delivery Cutover Sequence
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {onboarding.steps.map((st, idx) => {
            const isCompleted = st.status === 'completed';
            const isInProgress = st.status === 'in_progress';
            return (
              <div
                key={st.id}
                className={`p-3 rounded-xl border text-xs transition-all space-y-1.5 ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                    : isInProgress
                    ? 'bg-indigo-950/40 border-indigo-500/60 text-indigo-200'
                    : 'bg-black/30 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>Step 0{idx + 1}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {isInProgress && <Clock className="w-3 h-3 text-indigo-400 animate-spin" />}
                </div>
                <div className="font-semibold text-white leading-snug">{st.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{st.assignee}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Interactive Checklist + Required Integrations + Next Meeting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Interactive Checklist */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white uppercase font-mono text-[11px]">
              Onboarding Checklist
            </span>
            <span className="text-indigo-400 font-mono">
              {onboarding.checklistItems.filter((c) => c.completed).length}/{onboarding.checklistItems.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {onboarding.checklistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleOnboardingChecklist(item.id)}
                className="flex items-center space-x-2.5 p-2 rounded-lg bg-black/40 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs ${item.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Required Integrations */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white uppercase font-mono text-[11px] flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Required API Credentials</span>
            </span>
          </div>

          <div className="space-y-2">
            {onboarding.requiredIntegrations.map((integ, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-medium">{integ.name}</div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    Priority: {integ.priority}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    integ.connected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {integ.connected ? 'Connected' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Items & Kickoff Schedule */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <div className="space-y-2">
            <span className="font-bold text-amber-300 uppercase font-mono text-[11px] flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pending Action Items</span>
            </span>
            <div className="space-y-1">
              {onboarding.missingItems.map((m, idx) => (
                <div key={idx} className="p-2 rounded bg-amber-950/20 border border-amber-800/40 text-amber-200 text-[11px]">
                  ⚠️ {m}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1.5">
            <span className="font-bold text-white uppercase font-mono text-[11px] flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Kickoff Session Scheduled</span>
            </span>
            <p className="text-xs text-indigo-300 font-mono bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-800/40">
              {onboarding.nextMeeting}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
