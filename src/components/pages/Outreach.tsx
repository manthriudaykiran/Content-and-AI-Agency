import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OutreachMessage } from '../../types';
import {
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  MessageSquare,
  Mail,
  Linkedin,
  ShieldCheck,
  Check,
  Trash2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  FileSpreadsheet,
} from 'lucide-react';

export const Outreach: React.FC = () => {
  const { outreachMessages, approveOutreach, rejectOutreach, setIsExcelSyncOpen, addToast } = useApp();
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<OutreachMessage | null>(outreachMessages[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(outreachMessages[0]?.fullText || '');

  const filteredMessages = outreachMessages.filter((m) =>
    activeChannelFilter === 'all' ? true : m.channel === activeChannelFilter
  );

  const pendingApprovals = filteredMessages.filter((m) => m.status === 'needs_approval');

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* World-Class AI Outreach Agent Header (User Specification) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-[#0e1424] to-[#12192e] border border-indigo-500/40 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-xl">
              ✉️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-mono">
                  World-Powerful AI Outreach Agent for AI Agencies
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold">
                  Zero-Spam High-Ticket System
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Psychological 4-part framework converting cold enterprise prospects into high-ticket discovery calls
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExcelSyncOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-200 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Leads from Excel</span>
            </button>
          </div>
        </div>

        {/* Daily Target, Precautions & Approach Strategy (User Specification) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Target */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1.5">
            <span className="text-cyan-300 font-bold font-mono text-[10px] uppercase flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Outreach Target</span>
            </span>
            <div className="font-semibold text-white text-xs">
              Send 6 bespoke InMails & 4 contextual follow-ups
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Target response rate: &gt; 35%. Focus strictly on accounts showing active SDR hiring or visible response latency.
            </p>
          </div>

          {/* Precautions */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1.5">
            <span className="text-amber-300 font-bold font-mono text-[10px] uppercase flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Crucial Precautions & Rules</span>
            </span>
            <ul className="list-disc list-inside text-[11px] text-amber-200 space-y-0.5">
              <li>NEVER pitch services or send calendar links on Touch 1</li>
              <li>NEVER use spam phrases ("Hope you are well")</li>
              <li>Keep Touch 1 strictly under 65 words for mobile readers</li>
            </ul>
          </div>

          {/* Strategy */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/40 space-y-1.5">
            <span className="text-indigo-300 font-bold font-mono text-[10px] uppercase flex items-center space-x-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Best Tactical Strategy</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-snug">
              Offer a frictionless 4-minute review of an internal 1-page architecture schematic rather than demanding a 30-minute sales meeting.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-[#0d111a] border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white font-mono">
            Human-in-the-Loop Approval Queue:
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold">
            {pendingApprovals.length} Awaiting Sign-off
          </span>
        </div>

        <div className="flex items-center space-x-1.5 p-1 rounded-lg bg-black/40 border border-slate-800 text-xs">
          {['all', 'linkedin', 'email', 'whatsapp'].map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannelFilter(ch)}
              className={`px-3 py-1 rounded capitalize font-mono transition-all ${
                activeChannelFilter === ch
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outbound Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
            Generated Outbound Queue
          </span>

          <div className="space-y-2.5">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setEditedText(msg.fullText);
                    setIsEditing(false);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-950/40'
                      : 'bg-[#0d111a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      {msg.channel === 'linkedin' ? (
                        <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span className="font-bold text-white">{msg.prospectName}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${
                        msg.status === 'needs_approval'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {msg.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    {msg.company} • Step {msg.sequenceStep} (Day {msg.dayNumber})
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 italic bg-black/30 p-2 rounded border border-slate-800/80">
                    "{msg.fullText}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-800/60 font-mono">
                    <span>Scheduled: {msg.scheduledFor}</span>
                    {msg.status === 'needs_approval' && (
                      <span className="text-amber-300 font-semibold">Review & Approve →</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Inspector & Sequence View (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedMessage ? (
            <div className="p-5 rounded-xl bg-[#0d111a] border border-indigo-500/30 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-indigo-400 font-mono text-[10px] uppercase font-bold">
                      Sequence Step {selectedMessage.sequenceStep} • Day {selectedMessage.dayNumber}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300 font-mono capitalize">{selectedMessage.channel} Dispatch</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {selectedMessage.prospectName} ({selectedMessage.company})
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  {selectedMessage.status === 'needs_approval' ? (
                    <>
                      <button
                        onClick={() => rejectOutreach(selectedMessage.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 font-medium flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Discard</span>
                      </button>
                      <button
                        onClick={() => approveOutreach(selectedMessage.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Send</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approved for Dispatch</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 4-Part Architecture Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                  Psychological Framework: Observation → Relevance → Insight → Question
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <strong className="text-slate-400 uppercase font-mono text-[9px] block">1. Observation:</strong>
                    <span className="text-slate-200">{selectedMessage.framework.observation}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <strong className="text-slate-400 uppercase font-mono text-[9px] block">2. Relevance:</strong>
                    <span className="text-slate-200">{selectedMessage.framework.relevance}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <strong className="text-slate-400 uppercase font-mono text-[9px] block">3. Insight:</strong>
                    <span className="text-slate-200">{selectedMessage.framework.insight}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-slate-800">
                    <strong className="text-cyan-400 uppercase font-mono text-[9px] block">4. Low-Friction Question:</strong>
                    <span className="text-cyan-200">{selectedMessage.framework.question}</span>
                  </div>
                </div>
              </div>

              {/* Editable Message Text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Message Body (Ready to Send)</span>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-mono"
                  >
                    {isEditing ? 'Done Editing' : 'Edit Text'}
                  </button>
                </div>
                {isEditing ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={6}
                    className="w-full p-3 rounded-lg bg-slate-950 border border-indigo-500/50 text-slate-100 text-xs font-mono leading-relaxed"
                  />
                ) : (
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs whitespace-pre-wrap leading-relaxed">
                    {editedText}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
              Select an outreach message from the queue
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
