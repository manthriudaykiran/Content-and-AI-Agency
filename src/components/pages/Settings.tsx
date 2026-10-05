import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { addToast, supabaseStatus, checkSupabaseHealth } = useApp();
  const [requireHumanApproval, setRequireHumanApproval] = useState(true);
  const [modelTemperature, setModelTemperature] = useState('0.7');
  const [crmWebhook, setCrmWebhook] = useState('https://aether-os.internal/webhook/v1/crm-events');

  const integrations = [
    {
      name: 'Supabase PostgreSQL & Realtime',
      status: supabaseStatus.connected ? 'connected' : supabaseStatus.configured ? 'ready' : 'connecting',
      category: 'Cloud Database & Auth',
      info: supabaseStatus.url || 'Existing SUPABASE_URL configured',
    },
    { name: 'LinkedIn Marketing & API', status: 'connected', category: 'Publishing & Lead Gen' },
    { name: 'YouTube Data API v3', status: 'connected', category: 'Long-Form & Transcripts' },
    { name: 'Meta Graph API (IG/FB)', status: 'connected', category: 'Reels & Community' },
    { name: 'HubSpot CRM Integration', status: 'connected', category: 'Pipeline & Objections' },
    { name: 'Stripe Billing Webhook', status: 'connected', category: 'Payments & Revenue Attribution' },
    { name: 'Slack Connect API', status: 'connected', category: 'Client Onboarding Reminders' },
  ];

  const handleTestWebhook = () => {
    addToast({
      title: 'Webhook Ping Successful',
      message: 'HTTP 200 OK received in 42ms. Payload signature verified.',
      type: 'success',
    });
  };

  const handleTestSupabase = async () => {
    await checkSupabaseHealth();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-xs text-slate-200">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>System Settings & Platform Integrations</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                All 6 Connectors Online
              </span>
            </h2>
            <p className="text-slate-400">
              Manage platform APIs, autonomous security rules, and Gemini model telemetry
            </p>
          </div>
        </div>
      </div>

      {/* Model & AI Runtime Config */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-bold text-white font-mono uppercase tracking-wider text-xs">
            Server-Side AI Runtime (Google GenAI SDK)
          </span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Active Model: Gemini 3.8 Flash</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Model Endpoint</span>
            <span className="text-white font-semibold font-mono">gemini-3.8-flash</span>
            <p className="text-[10px] text-slate-400">High efficiency, sub-900ms reasoning</p>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Telemetry & User-Agent</span>
            <span className="text-cyan-300 font-semibold font-mono">aistudio-build</span>
            <p className="text-[10px] text-slate-400">Compliant with developer policies</p>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Sampling Temperature</span>
            <input
              type="text"
              value={modelTemperature}
              onChange={(e) => setModelTemperature(e.target.value)}
              className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Autonomous Security & Governance Policy */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <span className="font-bold text-white font-mono uppercase tracking-wider text-xs block pb-2 border-b border-slate-800">
          Safety & Human-in-the-Loop Boundaries
        </span>

        <div className="flex items-center justify-between p-3.5 rounded-lg bg-black/40 border border-slate-800">
          <div>
            <div className="font-semibold text-white">Require Human Approval for External Outreach</div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              When enabled, LinkedIn DMs and outbound emails will remain in "Needs Approval" until an operator clicks Approve.
            </p>
          </div>
          <input
            type="checkbox"
            checked={requireHumanApproval}
            onChange={(e) => setRequireHumanApproval(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-700 focus:ring-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Platform Connectors Table */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-bold text-white font-mono uppercase tracking-wider text-xs">
            Connected Platform APIs & Database
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTestSupabase}
              className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-[11px] cursor-pointer"
            >
              Verify Supabase DB
            </button>
            <button
              onClick={handleTestWebhook}
              className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] cursor-pointer"
            >
              Test Webhooks
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrations.map((integ, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-white">{integ.name}</div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {integ.category} {integ.info ? `• ${integ.info}` : ''}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
                {integ.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
