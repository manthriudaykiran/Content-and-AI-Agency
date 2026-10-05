import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const AUDIT_STAGES = [
  { id: 'acquisition', label: '1. Acquisition', desc: 'Outbound prospecting & organic content pull', defaultScore: 68 },
  { id: 'response', label: '2. Response', desc: 'Sub-90-second inbound lead qualification', defaultScore: 35 },
  { id: 'nurture', label: '3. Nurture', desc: 'Multi-touch contextual follow-up sequences', defaultScore: 42 },
  { id: 'sales', label: '4. Sales', desc: 'Call transcript objection parsing & copilot', defaultScore: 50 },
  { id: 'payment', label: '5. Payment', desc: 'Instant proposal generation & deposit cutover', defaultScore: 85 },
  { id: 'onboarding', label: '6. Onboarding', desc: 'Zero-delay credentials intake & Slack setup', defaultScore: 40 },
  { id: 'delivery', label: '7. Delivery', desc: 'Milestone tracking & blocker resolution agents', defaultScore: 60 },
  { id: 'support', label: '8. Support', desc: 'Autonomous triage & SLA failover guarantees', defaultScore: 55 },
  { id: 'retention', label: '9. Retention', desc: 'Account health scoring & risk intervention', defaultScore: 70 },
  { id: 'expansion', label: '10. Expansion', desc: 'Telemetry-based upsell & volume detection', defaultScore: 30 },
];

export const AuditModal: React.FC = () => {
  const { isAuditModalOpen, setIsAuditModalOpen, addToast } = useApp();
  const [companyName, setCompanyName] = useState('Acme Enterprise Growth');
  const [contactEmail, setContactEmail] = useState('founder@acmegrowth.com');
  const [selectedBottlenecks, setSelectedBottlenecks] = useState<string[]>([
    'response',
    'sales',
    'onboarding',
  ]);
  const [selectedSlot, setSelectedSlot] = useState('Tomorrow, 02:00 PM EST');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isAuditModalOpen) return null;

  const toggleBottleneck = (id: string) => {
    setSelectedBottlenecks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBookAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    addToast({
      title: 'Audit Confirmed!',
      message: `Your AI Growth & Operations Audit for ${companyName} is scheduled. Pre-audit brief dispatched to ${contactEmail}.`,
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-[#0d111a] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden text-slate-100">
        {/* Glow header banner */}
        <div className="relative p-6 bg-gradient-to-r from-indigo-950 via-[#131a2e] to-purple-950 border-b border-indigo-500/20">
          <button
            onClick={() => {
              setIsAuditModalOpen(false);
              setIsSubmitted(false);
            }}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Full-Lifecycle Agency Diagnostic</span>
          </div>

          <h2 className="text-xl font-bold text-white">
            Book an AI Growth & Operations Audit
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Audit your complete 10-stage revenue engine. Uncover where high-intent buyers drop off between content discovery, sales calls, and delivery.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Diagnostic Session Confirmed</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Our Architect Agent is now pre-compiling your 10-stage architecture report for <strong className="text-white">{companyName}</strong> on <span className="text-indigo-400">{selectedSlot}</span>.
            </p>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Selected Focus Areas:</span>
                <span className="text-indigo-300 font-mono">{selectedBottlenecks.length} Stages Flagged</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Confirmation Sent To:</span>
                <span className="text-slate-200 font-mono">{contactEmail}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Deliverable:</span>
                <span className="text-emerald-400 font-semibold">1-Page Custom Autonomous Workflow Topology</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAuditModalOpen(false);
                setIsSubmitted(false);
              }}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Return to OS
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookAudit} className="p-6 space-y-6">
            {/* Stage Selector Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  10-Stage Lifecycle Assessment (Select Your Current Bottlenecks)
                </span>
                <span className="text-[11px] text-indigo-400">
                  {selectedBottlenecks.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {AUDIT_STAGES.map((stage) => {
                  const isSelected = selectedBottlenecks.includes(stage.id);
                  return (
                    <button
                      type="button"
                      key={stage.id}
                      onClick={() => toggleBottleneck(stage.id)}
                      className={`p-2.5 rounded-lg text-left transition-all border ${
                        isSelected
                          ? 'bg-indigo-600/25 border-indigo-500/60 text-white shadow-sm shadow-indigo-500/20'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="text-[11px] font-semibold flex items-center justify-between">
                        <span className="truncate">{stage.label}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {stage.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Leakage Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white">
                    Estimated Recoverable Monthly Pipeline
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Based on 14-day zero-code response latency compression
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${(selectedBottlenecks.length * 14200).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">est. recovery</span>
              </div>
            </div>

            {/* Contact & Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Founder / Executive Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Preferred Diagnostic Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option>Tomorrow, 02:00 PM EST</option>
                  <option>Thursday, 11:00 AM EST</option>
                  <option>Friday, 03:30 PM EST</option>
                  <option>Monday, 10:00 AM EST</option>
                </select>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-risk 45-minute confidential architecture audit</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 border border-indigo-400/40 transition-all cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Confirm 45-Min Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
