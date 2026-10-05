import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Cpu,
  CheckCircle,
  Clock,
  Code2,
  Play,
  FileText,
} from 'lucide-react';

export const AgentInspectorModal: React.FC = () => {
  const {
    selectedAgentForInspection,
    setSelectedAgentForInspection,
    updateAgentStatus,
    addToast,
  } = useApp();

  if (!selectedAgentForInspection) return null;

  const agent = selectedAgentForInspection;

  const handleSimulateRun = () => {
    updateAgentStatus(agent.id, 'working', `Executing autonomous cycle for ${agent.name}`);
    addToast({
      title: `${agent.name} Dispatched`,
      message: `Running worker pipeline with model Gemini 3.8 Flash.`,
      type: 'info',
    });
    setTimeout(() => {
      updateAgentStatus(agent.id, 'completed', `Completed task: Generated high-confidence output`);
      addToast({
        title: `${agent.name} Finished`,
        message: `Task completed with ${(agent.confidence * 100).toFixed(0)}% confidence score.`,
        type: 'success',
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0d111a] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden text-slate-100 flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xl">
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-mono">
                  {agent.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  {agent.category}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${
                    agent.status === 'working'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : agent.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {agent.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{agent.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateRun}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Dispatch Worker</span>
            </button>
            <button
              onClick={() => setSelectedAgentForInspection(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Confidence</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {(agent.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Execution Latency</span>
              <span className="text-base font-bold text-cyan-400 font-mono">1.24s avg</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Last Executed</span>
              <span className="text-xs font-semibold text-slate-200">{agent.lastExecutionTime || 'Never'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Dependencies</span>
              <span className="text-xs font-mono text-indigo-300">
                {agent.dependencies.length > 0 ? agent.dependencies.join(', ') : 'None (Root Node)'}
              </span>
            </div>
          </div>

          {/* Current Task */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Current Task / Last Output</span>
            </div>
            <p className="text-xs text-slate-200 font-mono bg-black/40 p-2.5 rounded-lg border border-slate-800">
              {agent.currentTask || 'Idle — awaiting dispatch signal from OS Manager'}
            </p>
          </div>

          {/* System Instruction */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>System Prompt & Role Instruction</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              {agent.systemInstruction}
            </p>
          </div>

          {/* Standard Agent Response Contract Preview (Section 18) */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <div className="flex items-center space-x-2">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shared Agent Response Contract (v1 Schema)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Strict JSON Schema</span>
            </div>
            <pre className="text-[11px] font-mono text-indigo-200 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
{`{
  "task_id": "T-${agent.id}-0982",
  "agent_id": "${agent.id}",
  "status": "${agent.status}",
  "summary": "${agent.currentTask}",
  "findings": [
    "Identified actionable leverage in target domain",
    "Verified deterministic payload validation"
  ],
  "recommendations": [
    "Dispatch downstream artifacts to next worker"
  ],
  "confidence": ${agent.confidence},
  "assumptions": ["API latency < 2000ms"],
  "missing_data": [],
  "next_suggested_action": "Execute human approval or route to CRM",
  "approval_required": ${agent.status === 'needs_approval'}
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
