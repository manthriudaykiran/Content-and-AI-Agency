import React from 'react';
import { Database, X, Copy, Check, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

export interface InspectedRecord {
  moduleName: string;
  tableName: string;
  recordId: string;
  recordTitle: string;
  rawData: Record<string, any>;
}

interface RecordInspectorModalProps {
  record: InspectedRecord | null;
  onClose: () => void;
}

export const RecordInspectorModal: React.FC<RecordInspectorModalProps> = ({ record, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!record) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(record.rawData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0b0e14] border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white font-mono">
                  Supabase Record Inspector
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  DEMO TRACEABILITY
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                1-to-1 database mapping verification for customer presentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Traceability Metadata Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono">
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">App Module</span>
            <span className="text-white font-semibold truncate block">{record.moduleName}</span>
          </div>

          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Supabase Table</span>
            <span className="text-emerald-400 font-semibold truncate block">public.{record.tableName}</span>
          </div>

          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Primary Key (UUID)</span>
            <span className="text-cyan-300 font-semibold truncate block font-mono" title={record.recordId}>
              {record.recordId.slice(0, 13)}...
            </span>
          </div>

          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Source of Truth</span>
            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>PostgreSQL</span>
            </span>
          </div>
        </div>

        {/* Record Body Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono text-[11px]">
              Item: <strong className="text-white">{record.recordTitle}</strong>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-black/80 overflow-hidden font-mono text-[11px]">
            <div className="p-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[10px]">
              <span>Table Row Payload (JSONB)</span>
              <span>Live Database Record</span>
            </div>
            <pre className="p-3 text-cyan-300 max-h-80 overflow-y-auto leading-relaxed whitespace-pre font-mono text-[11px]">
              {JSON.stringify(record.rawData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">
            Open in Supabase: Table Editor → {record.tableName}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
