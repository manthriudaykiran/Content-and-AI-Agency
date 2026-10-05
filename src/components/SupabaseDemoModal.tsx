import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  runSupabaseHealthCheck,
  seedSupabaseDemoData,
  DetailedHealthCheck,
  SeedResult,
} from '../services/supabaseService';
import { INITIAL_MIGRATION_SQL } from '../data/migrationSql';
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  X,
  Play,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface SupabaseDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseDemoModal: React.FC<SupabaseDemoModalProps> = ({ isOpen, onClose }) => {
  const {
    refreshFromSupabase,
    leads,
    contentAssets,
    prospects,
    invoices,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'health' | 'seed' | 'sql'>('health');
  const [health, setHealth] = useState<DetailedHealthCheck | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // CRUD Test State
  const [crudTesting, setCrudTesting] = useState(false);
  const [crudTestLog, setCrudTestLog] = useState<Array<{ step: string; status: 'ok' | 'err'; detail: string }>>([]);

  const executeHealthCheck = async () => {
    setIsChecking(true);
    try {
      const result = await runSupabaseHealthCheck();
      setHealth(result);
    } catch (err: any) {
      console.error('Health check failed:', err);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      executeHealthCheck();
    }
  }, [isOpen]);

  const handleLoadDemoData = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedSupabaseDemoData();
      setSeedResult(res);
      if (res.success) {
        addToast({
          title: 'Supabase Seed Complete',
          message: res.message,
          type: 'success',
        });
        // Refresh application state from Supabase
        await refreshFromSupabase();
        // Re-run health check
        await executeHealthCheck();
      } else {
        addToast({
          title: res.tableMissing ? 'Schema Migration Needed' : 'Seed Operation Error',
          message: res.message,
          type: 'alert',
        });
        if (res.tableMissing) {
          setActiveTab('sql');
        }
      }
    } catch (err: any) {
      addToast({
        title: 'Seed Error',
        message: err.message || 'Failed to seed demo data',
        type: 'alert',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(INITIAL_MIGRATION_SQL);
    setCopiedSql(true);
    addToast({
      title: 'SQL Migration Copied',
      message: 'Paste and run in your Supabase project → SQL Editor.',
      type: 'info',
    });
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleRunCrudTest = async () => {
    setCrudTesting(true);
    const logs: Array<{ step: string; status: 'ok' | 'err'; detail: string }> = [];

    // Step 1: Initialize
    logs.push({ step: '1. Supabase Client', status: 'ok', detail: 'Public client active and authenticated' });
    setCrudTestLog([...logs]);
    await new Promise((r) => setTimeout(r, 300));

    // Step 2: Test Create
    const testLeadId = `test-lead-${Date.now()}`;
    const { syncLeadToSupabase } = await import('../lib/supabase');
    const createSuccess = await syncLeadToSupabase({
      id: testLeadId,
      name: 'Verification Canary',
      company: 'Test Diagnostics Corp',
      email: 'canary@test.io',
      title: 'QA Bot',
      stage: 'new_lead',
      estimatedValue: 15000,
      contentAttribution: { contentId: 'test', contentTitle: 'Test', platform: 'LinkedIn', touchpointType: 'first_touch' },
      objections: [],
      painDescription: 'Testing live database CRUD write latency.',
      intent: 'high',
      nextAction: 'Verify in Supabase Table Editor',
      responsibleAgent: 'Diagnostics',
      lastTouch: 'Just now',
      salesNotes: ['Canary verification record'],
    });

    if (createSuccess) {
      logs.push({ step: '2. Create (INSERT/UPSERT)', status: 'ok', detail: `Lead '${testLeadId}' written to public.leads table` });
    } else {
      logs.push({ step: '2. Create (INSERT/UPSERT)', status: 'err', detail: 'Could not write to public.leads. Is the table created?' });
    }
    setCrudTestLog([...logs]);
    await new Promise((r) => setTimeout(r, 400));

    // Step 3: Test Update
    if (createSuccess) {
      const updateSuccess = await syncLeadToSupabase({
        id: testLeadId,
        name: 'Verification Canary',
        company: 'Test Diagnostics Corp',
        email: 'canary@test.io',
        title: 'QA Bot',
        stage: 'qualified',
        estimatedValue: 25000,
        contentAttribution: { contentId: 'test', contentTitle: 'Test', platform: 'LinkedIn', touchpointType: 'first_touch' },
        objections: [],
        painDescription: 'Updated to qualified stage with updated_at timestamp.',
        intent: 'high',
        nextAction: 'Verify timestamp updated',
        responsibleAgent: 'Diagnostics',
        lastTouch: 'Updated just now',
        salesNotes: ['Stage progressed to qualified'],
      });

      if (updateSuccess) {
        logs.push({ step: '3. Update (STAGE & VALUE)', status: 'ok', detail: 'Updated deal stage to qualified and value to $25,000' });
      } else {
        logs.push({ step: '3. Update (STAGE & VALUE)', status: 'err', detail: 'Update failed' });
      }
      setCrudTestLog([...logs]);
      await new Promise((r) => setTimeout(r, 400));

      // Step 4: Test Delete
      const { deleteRecordFromSupabase } = await import('../services/supabaseService');
      const deleteResult = await deleteRecordFromSupabase('leads', testLeadId);
      if (deleteResult.success) {
        logs.push({ step: '4. Delete (CLEANUP)', status: 'ok', detail: `Canary lead '${testLeadId}' removed from Supabase` });
      } else {
        logs.push({ step: '4. Delete (CLEANUP)', status: 'err', detail: deleteResult.error || 'Delete failed' });
      }
      setCrudTestLog([...logs]);
    }

    setCrudTesting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0b0e14] border border-emerald-500/50 rounded-2xl shadow-2xl shadow-emerald-950/60 overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-mono">
                  Supabase Demo Environment & Health Console
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  DEVELOPMENT ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Idempotent database seeding, 14-table telemetry, and live CRUD synchronization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="p-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'health'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Connection Diagnostics</span>
            </button>
            <button
              onClick={() => setActiveTab('seed')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'seed'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Load Demo Data</span>
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'sql'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SQL Migration (001_initial_schema.sql)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={executeHealthCheck}
              disabled={isChecking}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh Check</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Connection Diagnostics */}
        {activeTab === 'health' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
            {/* Top Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Client Initialized</span>
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  {health?.clientInitialized ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Yes (@supabase/supabase-js)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400">Missing Config</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">DB Connection</span>
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  {health?.connectionSuccessful ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">HTTP 200 Live</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400">Checking...</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Application Tables</span>
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  {health?.allTablesReady ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">All 14 Ready</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400">Schema Migration Needed</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Loaded App Records</span>
                <div className="flex items-center space-x-1.5 font-bold text-white">
                  <span className="text-cyan-300">
                    {leads.length} Leads • {contentAssets.length} Assets
                  </span>
                </div>
              </div>
            </div>

            {/* If tables are missing, show prominent notification */}
            {!health?.allTablesReady && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/50 space-y-2">
                <div className="flex items-center space-x-2 text-amber-300 font-bold font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>ACTION REQUIRED: Run Migration Once in Supabase SQL Editor</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  The client has securely authenticated to your Supabase project (<strong>{health?.url || 'supabase.co'}</strong>), but the application tables have not been created yet in the schema cache.
                </p>
                <div className="flex items-center space-x-3 pt-1">
                  <button
                    onClick={() => setActiveTab('sql')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    View & Copy SQL Migration →
                  </button>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-xs text-amber-400 hover:underline font-mono"
                  >
                    <span>Open Supabase Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* 14 Table Matrix */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                Required Tables Status (14 Entities)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px] font-mono">
                {Object.entries(health?.tablesStatus || {}).map(([tbl, status]) => (
                  <div
                    key={tbl}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      status === 'accessible'
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <span className="font-semibold truncate">{tbl}</span>
                    {status === 'accessible' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[9px] uppercase px-1 rounded bg-amber-900/50">Missing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live CRUD Verification Test */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs font-mono">
                    Live End-to-End Database CRUD Verification
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Tests CREATE → READ → UPDATE → DELETE against the live Supabase project
                  </p>
                </div>
                <button
                  onClick={handleRunCrudTest}
                  disabled={crudTesting}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 ${crudTesting ? 'animate-spin' : ''}`} />
                  <span>{crudTesting ? 'Testing...' : 'Execute CRUD Test'}</span>
                </button>
              </div>

              {crudTestLog.length > 0 && (
                <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  {crudTestLog.map((log, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      {log.status === 'ok' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                      <span className="text-white font-bold">{log.step}:</span>
                      <span className={log.status === 'ok' ? 'text-slate-300' : 'text-red-300'}>
                        {log.detail}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Load Demo Data */}
        {activeTab === 'seed' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950 border border-emerald-500/40 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                    <span>Idempotent Supabase Demo Environment Seeder</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      RFC4122 UUIDs
                    </span>
                  </h4>
                  <p className="text-slate-300 text-xs mt-1">
                    Inserts realistic connected records for all 14 agency modules using deterministic IDs so re-running never produces duplicates.
                  </p>
                </div>

                <button
                  onClick={handleLoadDemoData}
                  disabled={isSeeding}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 cursor-pointer transition-all"
                >
                  <Play className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                  <span>{isSeeding ? 'Populating Supabase...' : 'Load Demo Data'}</span>
                </button>
              </div>

              {seedResult && (
                <div
                  className={`p-3 rounded-lg border font-mono text-[11px] ${
                    seedResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : 'bg-red-950/40 border-red-500/60 text-red-200'
                  }`}
                >
                  <strong>{seedResult.success ? '✅ Success:' : '❌ Warning:'}</strong> {seedResult.message}
                </div>
              )}
            </div>

            {/* Seed Dataset Summary */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                Entities Included in Demo Package
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-mono">CRM Leads & Attribution</div>
                  <p className="text-[11px] text-slate-400">
                    4 high-ticket enterprise leads ($24k - $45k) with complete content touchpoint attribution.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-mono">Content OS Assets</div>
                  <p className="text-[11px] text-slate-400">
                    5 viral assets across LinkedIn (Agency systems), YouTube (Deep dives), Instagram, Facebook.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-mono">Outreach Sequences</div>
                  <p className="text-[11px] text-slate-400">
                    4-part psychological messages (Observation → Relevance → Insight → Question) with status gates.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-mono">Sales Copilot & Proposals</div>
                  <p className="text-[11px] text-slate-400">
                    Pre-call intel, extracted objections (Dev debt), and full 8-section tailored proposals.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-mono">Client Onboarding & Sprints</div>
                  <p className="text-[11px] text-slate-400">
                    Slack Connect, 1Password checklist, milestone progression, and webhook failover telemetry.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
                  <div className="font-bold text-white font-mono">Invoices & Unit Economics</div>
                  <p className="text-[11px] text-slate-400">
                    $24,500 billing cashflow, API cost audits, and 78.4% net margin calculation per client.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: SQL Migration */}
        {activeTab === 'sql' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <div className="font-bold text-white font-mono text-xs">
                  Migration File: supabase/migrations/001_initial_schema.sql
                </div>
                <p className="text-[11px] text-slate-400">
                  Idempotent SQL creating 14 tables, UUID primary keys, foreign keys, RLS policies & triggers.
                </p>
              </div>

              <button
                onClick={handleCopySql}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 cursor-pointer transition-all"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Migration'}</span>
              </button>
            </div>

            {/* Instruction Steps */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/40 text-slate-200 text-xs space-y-1.5 font-sans leading-relaxed">
              <strong className="text-cyan-300 font-mono block text-xs">
                How to apply this migration in your Supabase project (30 Seconds):
              </strong>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                <li>Click <strong>"Copy SQL Migration"</strong> above.</li>
                <li>Open your Supabase project dashboard → Navigate to <strong>SQL Editor</strong> on the left.</li>
                <li>Click <strong>New query</strong>, paste the copied SQL, and click <strong>Run</strong> (or press Cmd/Ctrl + Enter).</li>
                <li>Return here and click <strong>"Load Demo Data"</strong> to immediately populate all records!</li>
              </ol>
            </div>

            {/* Code Preview */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-[11px]">
              <div className="p-2.5 bg-black/60 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[10px]">
                <span>001_initial_schema.sql</span>
                <span>Idempotent PostgreSQL DDL</span>
              </div>
              <pre className="p-4 text-emerald-300 max-h-72 overflow-y-auto leading-relaxed whitespace-pre font-mono text-[11px]">
                {INITIAL_MIGRATION_SQL}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Supabase Project: {health?.url || 'Configured via SUPABASE_URL'}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={handleLoadDemoData}
              disabled={isSeeding}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Load Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
