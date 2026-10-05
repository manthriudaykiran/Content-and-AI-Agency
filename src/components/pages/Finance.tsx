import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  AlertCircle,
  Sparkles,
  CheckCircle,
  Clock,
  Send,
  PieChart,
  Database,
} from 'lucide-react';

export const Finance: React.FC = () => {
  const { invoices, profitability, markInvoicePaid, leads, addToast, setInspectedRecord } = useApp();

  const totalMonthlyRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);

  const recurringRevenue = invoices
    .filter((i) => i.type === 'retainer' && i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);

  const oneTimeRevenue = invoices
    .filter((i) => i.type === 'implementation' && i.status === 'paid')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalPipeline = leads.reduce((acc, l) => acc + l.estimatedValue, 0);
  const avgDealValue = Math.round(totalPipeline / Math.max(1, leads.length));

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Agency Financial OS & Unit Economics</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                ${totalMonthlyRevenue.toLocaleString()} MTD Revenue
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Unit Economics: Client Revenue – API Costs – Tool Overhead – Delivery Hours
            </p>
          </div>
        </div>
      </div>

      {/* Financial KPIs Grid (Section 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">Revenue This Month</span>
          <div className="text-xl font-bold text-white font-mono">
            ${totalMonthlyRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">+28% vs last month</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">Recurring MRR</span>
          <div className="text-xl font-bold text-cyan-400 font-mono">
            ${recurringRevenue.toLocaleString()}/mo
          </div>
          <span className="text-[10px] text-slate-400">48% of total revenue</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">One-Time Implementation</span>
          <div className="text-xl font-bold text-indigo-400 font-mono">
            ${oneTimeRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">New system builds</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">Pipeline Value</span>
          <div className="text-xl font-bold text-purple-400 font-mono">
            ${totalPipeline.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">{leads.length} active leads</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 space-y-1">
          <span className="text-slate-400 font-mono text-[10px] uppercase block">Average Deal Value</span>
          <div className="text-xl font-bold text-white font-mono">
            ${avgDealValue.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">+15% ticket expansion</span>
        </div>
      </div>

      {/* AI Finance Insights Banner (Section 12) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-300 font-bold font-mono">
          <Sparkles className="w-4 h-4" />
          <span>Finance Intelligence Agent Insights:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] pt-1">
          <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-0.5">⚠️ API Cost Spike:</span>
            Veloce Logistics is consuming unusually high LLM token costs ($490 vs $210 avg).
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
            <span className="text-red-400 font-bold block mb-0.5">🚨 Overdue Invoice:</span>
            Invoice INV-2026-084 ($3,200) is 3 days past due date.
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
            <span className="text-indigo-300 font-bold block mb-0.5">📈 Retainer Shift:</span>
            Managed-service recurring revenue is now 48% of monthly income.
          </div>
          <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-0.5">💎 Gross Margin:</span>
            Overall blended agency margin is maintaining at 78.4%.
          </div>
        </div>
      </div>

      {/* Invoices + Client Profitability Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Invoices Table (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Invoices & Billing Telemetry
            </span>
          </div>

          <div className="space-y-2">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-xl bg-[#0d111a] border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white font-mono">{inv.id}</span>
                    <span className="text-slate-400">• {inv.clientName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono capitalize">
                    {inv.type} • Due {inv.dueDate}
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-right">
                  <div className="text-sm font-bold text-white font-mono">
                    ${inv.amount.toLocaleString()}
                  </div>

                  <button
                    onClick={() =>
                      setInspectedRecord({
                        moduleName: 'Finance & Invoices',
                        tableName: 'invoices',
                        recordId: inv.id,
                        recordTitle: `${inv.clientName} Invoice (${inv.id})`,
                        rawData: inv,
                      })
                    }
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                    title="Inspect backing Supabase invoice row"
                  >
                    <Database className="w-3 h-3 text-emerald-400" />
                  </button>

                  {inv.status === 'paid' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Paid
                    </span>
                  ) : inv.status === 'overdue' ? (
                    <button
                      onClick={() => markInvoicePaid(inv.id)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                    >
                      Overdue (Mark Paid)
                    </button>
                  ) : (
                    <button
                      onClick={() => markInvoicePaid(inv.id)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Profitability Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono block">
            Per-Client Net Margin & Profitability
          </span>

          <div className="space-y-2">
            {profitability.map((prof) => (
              <div
                key={prof.clientId}
                className="p-3.5 rounded-xl bg-[#0d111a] border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{prof.clientName}</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    {prof.netMargin}% Net Margin
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-slate-400 bg-black/30 p-2 rounded border border-slate-800/80">
                  <div>
                    <span className="block text-[9px] uppercase">Revenue</span>
                    <span className="text-white font-bold">${prof.revenue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase">API Cost</span>
                    <span className="text-amber-300 font-semibold">${prof.apiCost}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase">Tooling</span>
                    <span className="text-slate-300">${prof.toolCost}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase">Labor Hours</span>
                    <span className="text-cyan-300">{prof.deliveryHours}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
