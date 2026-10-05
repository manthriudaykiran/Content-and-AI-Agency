import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Workflow,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';

const STAGES = ['map', 'design', 'build', 'test', 'deploy', 'optimize'];

export const DeliveryCoordination: React.FC = () => {
  const { projects, resolveBlocker, addToast } = useApp();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Delivery & Coordination Operations Room</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {projects.length} Active Deployments
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Agency Delivery Lifecycle: Map → Design → Build → Test → Deploy → Optimize
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Project Coordinator Agent Active</span>
        </div>
      </div>

      {/* AI Project Coordinator Active Ticker (Section 11) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-300 font-bold font-mono">
          <Sparkles className="w-4 h-4" />
          <span>AI Project Coordinator Continuous Diagnostics:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] pt-1 font-mono">
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-amber-400 block font-bold">1 Blocker Detected:</span>
            SendGrid API key missing on NovaSpace deployment.
          </div>
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-emerald-400 block font-bold">0 Tasks Overdue:</span>
            All 5 sprint milestones on schedule.
          </div>
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-cyan-400 block font-bold">Client Action Required:</span>
            HyperScale VP Sales sign-off on follow-up sequence.
          </div>
          <div className="p-2 rounded bg-black/40 border border-slate-800">
            <span className="text-indigo-300 block font-bold">Next Automated Task:</span>
            Deploy cron renewal alert engine to staging sandbox.
          </div>
        </div>
      </div>

      {/* Active Projects Cards */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 rounded-xl bg-[#0d111a] border border-slate-800 hover:border-slate-700 transition-all space-y-5 text-xs text-slate-200"
          >
            {/* Project Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">
                  Active Client Project
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {project.company}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Target Outcome: {project.projectOutcome}
                </p>
              </div>

              {/* Automation Health & Stage */}
              <div className="flex items-center space-x-3 text-right">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">Automation Health</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {project.automationHealth}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/40">
                  <span className="text-[10px] text-indigo-300 font-mono block">Current Stage</span>
                  <span className="text-sm font-bold text-white uppercase font-mono">
                    {project.stage}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Progress Bar (Map -> Design -> Build -> Test -> Deploy -> Optimize) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Delivery Progression ({project.progress}% Complete • Due {project.dueDate})
              </span>
              <div className="grid grid-cols-6 gap-1.5 text-center text-[10px] font-mono">
                {STAGES.map((st, i) => {
                  const stageIndex = STAGES.indexOf(project.stage);
                  const isDone = i <= stageIndex;
                  return (
                    <div
                      key={st}
                      className={`py-1.5 rounded uppercase font-semibold transition-all ${
                        isDone
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {st}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid: Milestones & Active Workflows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Milestones */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="font-bold text-white uppercase font-mono text-[11px] block">
                  Project Milestones
                </span>
                <div className="space-y-1.5">
                  {project.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-black/40 border border-slate-800 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center space-x-2">
                        {m.completed ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className={m.completed ? 'line-through text-slate-400' : 'text-slate-200'}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{m.dueDate}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflows in Production */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="font-bold text-white uppercase font-mono text-[11px] block">
                  Autonomous Workflows & Health
                </span>
                <div className="space-y-1.5">
                  {project.workflows.map((wf, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-black/40 border border-slate-800 flex items-center justify-between text-[11px]"
                    >
                      <div className="space-y-0.5">
                        <div className="text-slate-200 font-medium">{wf.name}</div>
                        <span className="text-[9px] text-slate-400 font-mono">Trigger: {wf.trigger}</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded capitalize ${
                          wf.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {wf.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blockers & Resolution Button */}
            {project.blockers.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold uppercase font-mono text-[11px] flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Active Delivery Blockers ({project.blockers.length})</span>
                  </span>
                </div>
                {project.blockers.map((blocker, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-2 rounded bg-black/40 border border-amber-800/40 flex items-center justify-between text-xs text-amber-200"
                  >
                    <span>⚠️ {blocker}</span>
                    <button
                      onClick={() => resolveBlocker(project.id, bIdx)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>Resolve Blocker</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
