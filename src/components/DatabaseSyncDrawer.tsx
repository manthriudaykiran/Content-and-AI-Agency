import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  runSupabaseHealthCheck,
  DetailedHealthCheck,
  fetchFullStateFromSupabase,
} from '../services/supabaseService';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Radio,
  Clock,
  Activity,
  Layers,
  Search,
  ExternalLink,
  X,
  Play,
  ArrowRight,
} from 'lucide-react';
import { InspectedRecord } from './RecordInspectorModal';

interface DatabaseSyncDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectRecord: (rec: InspectedRecord) => void;
}

export const DatabaseSyncDrawer: React.FC<DatabaseSyncDrawerProps> = ({
  isOpen,
  onClose,
  onInspectRecord,
}) => {
  const {
    leads,
    contentAssets,
    prospects,
    outreachMessages,
    salesCalls,
    proposals,
    onboarding,
    projects,
    invoices,
    profitability,
    intelSignals,
    clients,
    campaigns,
    tasks,
    queueItems,
    activityLogs,
    refreshFromSupabase,
    setIsSupabaseDemoModalOpen,
  } = useApp();

  const [health, setHealth] = useState<DetailedHealthCheck | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'queue' | 'audit'>('tables');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  const loadHealth = async () => {
    setIsRefreshing(true);
    try {
      const res = await runSupabaseHealthCheck();
      setHealth(res);
      setLastSyncTime(new Date().toLocaleTimeString());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHealth();
    }
  }, [isOpen]);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    try {
      await refreshFromSupabase();
      await loadHealth();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isOpen) return null;

  // Build Table-to-Module status rows
  const modulesList = [
    {
      module: 'CRM Pipeline',
      table: 'leads',
      count: leads.length,
      sampleItem: leads[0] ? { title: leads[0].name, id: leads[0].id, raw: leads[0] } : null,
      status: health?.tablesStatus['leads'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Content OS & Calendar',
      table: 'content_assets',
      count: contentAssets.length,
      sampleItem: contentAssets[0] ? { title: contentAssets[0].title, id: contentAssets[0].id, raw: contentAssets[0] } : null,
      status: health?.tablesStatus['content_assets'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Client Acquisition',
      table: 'prospects',
      count: prospects.length,
      sampleItem: prospects[0] ? { title: prospects[0].name, id: prospects[0].id, raw: prospects[0] } : null,
      status: health?.tablesStatus['prospects'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Outreach Sequences',
      table: 'outreach_messages',
      count: outreachMessages.length,
      sampleItem: outreachMessages[0] ? { title: outreachMessages[0].prospectName, id: outreachMessages[0].id, raw: outreachMessages[0] } : null,
      status: health?.tablesStatus['outreach_messages'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Sales Copilot',
      table: 'sales_calls',
      count: salesCalls.length,
      sampleItem: salesCalls[0] ? { title: salesCalls[0].leadName, id: salesCalls[0].id, raw: salesCalls[0] } : null,
      status: health?.tablesStatus['sales_calls'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Enterprise Proposals',
      table: 'proposals',
      count: proposals.length,
      sampleItem: proposals[0] ? { title: proposals[0].clientName, id: proposals[0].id, raw: proposals[0] } : null,
      status: health?.tablesStatus['proposals'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Client Onboarding',
      table: 'client_onboardings',
      count: onboarding ? 1 : 0,
      sampleItem: onboarding ? { title: onboarding.clientName, id: onboarding.id, raw: onboarding } : null,
      status: health?.tablesStatus['client_onboardings'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Delivery Projects',
      table: 'client_projects',
      count: projects.length,
      sampleItem: projects[0] ? { title: projects[0].clientName, id: projects[0].id, raw: projects[0] } : null,
      status: health?.tablesStatus['client_projects'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Finance & Invoices',
      table: 'invoices',
      count: invoices.length,
      sampleItem: invoices[0] ? { title: invoices[0].clientName, id: invoices[0].id, raw: invoices[0] } : null,
      status: health?.tablesStatus['invoices'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Unit Economics',
      table: 'client_profitability',
      count: profitability.length,
      sampleItem: profitability[0] ? { title: profitability[0].clientName, id: profitability[0].clientId, raw: profitability[0] } : null,
      status: health?.tablesStatus['client_profitability'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Client Accounts',
      table: 'clients',
      count: clients.length,
      sampleItem: clients[0] ? { title: clients[0].name, id: clients[0].id, raw: clients[0] } : null,
      status: health?.tablesStatus['clients'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Marketing Campaigns',
      table: 'campaigns',
      count: campaigns.length,
      sampleItem: campaigns[0] ? { title: campaigns[0].name, id: campaigns[0].id, raw: campaigns[0] } : null,
      status: health?.tablesStatus['campaigns'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Cross-Module Tasks',
      table: 'tasks',
      count: tasks.length,
      sampleItem: tasks[0] ? { title: tasks[0].title, id: tasks[0].id, raw: tasks[0] } : null,
      status: health?.tablesStatus['tasks'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Processing Queue',
      table: 'queue_items',
      count: queueItems.length,
      sampleItem: queueItems[0] ? { title: queueItems[0].jobType, id: queueItems[0].id, raw: queueItems[0] } : null,
      status: health?.tablesStatus['queue_items'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Audit History',
      table: 'activity_logs',
      count: activityLogs.length,
      sampleItem: activityLogs[0] ? { title: activityLogs[0].action, id: activityLogs[0].id, raw: activityLogs[0] } : null,
      status: health?.tablesStatus['activity_logs'] === 'accessible' ? 'Synced' : 'Missing',
    },
    {
      module: 'Market Intel Signals',
      table: 'intel_signals',
      count: intelSignals.length,
      sampleItem: intelSignals[0] ? { title: intelSignals[0].title, id: intelSignals[0].id, raw: intelSignals[0] } : null,
      status: health?.tablesStatus['intel_signals'] === 'accessible' ? 'Synced' : 'Missing',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b0e14] border border-indigo-500/50 rounded-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-mono">
                  Database Sync & Two-Way Telemetry
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center space-x-1">
                  <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  <span>REALTIME CONNECTED</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1-to-1 table verification showing live database records backing every application module
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualSync}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Resync Database</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveSubTab('tables')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === 'tables'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Module ↔ Table Matrix ({modulesList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('queue')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'queue'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Jobs & Processing Queue</span>
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px]">
                {queueItems.length}
              </span>
            </button>
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'audit'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Activity & Audit Trail</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
                {activityLogs.length}
              </span>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Last Checked: {lastSyncTime}</span>
            </span>
          </div>
        </div>

        {/* Content View 1: Module-Table Matrix */}
        {activeSubTab === 'tables' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden font-mono text-xs">
              <div className="grid grid-cols-12 p-3 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                <div className="col-span-3">App Module</div>
                <div className="col-span-3">Supabase Table</div>
                <div className="col-span-2 text-center">Record Count</div>
                <div className="col-span-2 text-center">Connection Status</div>
                <div className="col-span-2 text-right">Record Inspector</div>
              </div>

              <div className="divide-y divide-slate-800/60">
                {modulesList.map((m, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 p-3 items-center hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="col-span-3 font-semibold text-white">
                      {m.module}
                    </div>

                    <div className="col-span-3 text-emerald-400">
                      public.{m.table}
                    </div>

                    <div className="col-span-2 text-center font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
                        {m.count} records
                      </span>
                    </div>

                    <div className="col-span-2 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          m.status === 'Synced'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <div className="col-span-2 text-right">
                      {m.sampleItem ? (
                        <button
                          onClick={() =>
                            onInspectRecord({
                              moduleName: m.module,
                              tableName: m.table,
                              recordId: m.sampleItem!.id,
                              recordTitle: m.sampleItem!.title,
                              rawData: m.sampleItem!.raw,
                            })
                          }
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-medium cursor-pointer border border-slate-700"
                        >
                          Inspect Row
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[11px]">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content View 2: Queue Items (Jobs) */}
        {activeSubTab === 'queue' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 text-xs font-sans">
              <p>
                Asynchronous autonomous jobs registered in <code>public.queue_items</code> for AI generation and multi-agent loops.
              </p>
            </div>

            <div className="space-y-2">
              {queueItems.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{q.jobType}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {q.sourceModule}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          q.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : q.status === 'running'
                            ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Progress: {q.progress}% • Priority: {q.priority} • ID: {q.id.slice(0, 13)}...
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onInspectRecord({
                        moduleName: 'Processing Queue',
                        tableName: 'queue_items',
                        recordId: q.id,
                        recordTitle: q.jobType,
                        rawData: q,
                      })
                    }
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium border border-slate-700 cursor-pointer"
                  >
                    Inspect Job
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content View 3: Activity / Audit History */}
        {activeSubTab === 'audit' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 text-xs font-sans">
              <p>
                Audit history recorded in <code>public.activity_logs</code> demonstrating live trace of actions taken by users and autonomous agents.
              </p>
            </div>

            <div className="space-y-2">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {log.action}
                      </span>
                      <span className="text-slate-400 text-[11px]">table: public.{log.entityType}</span>
                      <span className="text-slate-500 text-[10px]">{log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'Just now'}</span>
                    </div>
                    <div className="text-white text-xs font-sans font-medium">
                      {log.description}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onInspectRecord({
                        moduleName: 'Audit Trail',
                        tableName: 'activity_logs',
                        recordId: log.id,
                        recordTitle: log.action,
                        rawData: log,
                      })
                    }
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium border border-slate-700 cursor-pointer"
                  >
                    Inspect Log
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Total Application Records in Supabase: <strong className="text-white">{modulesList.reduce((acc, m) => acc + m.count, 0)}</strong>
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose();
                setIsSupabaseDemoModalOpen(true);
              }}
              className="text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>Open Seeder & Migration Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold font-sans cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
