import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead } from '../../types';
import {
  Users,
  Search,
  DollarSign,
  ArrowRight,
  Sparkles,
  Share2,
  AlertCircle,
  FileCheck,
  CheckCircle,
  Clock,
  Plus,
  Database,
} from 'lucide-react';

const CRM_STAGES: Array<{ id: Lead['stage']; label: string }> = [
  { id: 'new_lead', label: 'New Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'engaged', label: 'Engaged' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won / Closed' },
];

export const CRM: React.FC = () => {
  const { leads, updateLeadStage, createProposalFromLead, addToast, setInspectedRecord } = useApp();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPipeline = leads.reduce((sum, l) => sum + l.estimatedValue, 0);

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedLead) return;
    selectedLead.salesNotes = [newNote, ...selectedLead.salesNotes];
    setNewNote('');
    addToast({
      title: 'Sales Note Added',
      message: 'Logged to CRM record and synced with Sales Intelligence Agent.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner & Summary */}
      <div className="p-4 rounded-xl bg-[#0d111a] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Agency CRM & Content Attribution Hub</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                ${totalPipeline.toLocaleString()} Active Pipeline
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              The common data layer: Content Attribution → Objections → Deals → Closed Revenue
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search leads, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Kanban Pipeline Stage View (8 Stages) */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 overflow-x-auto min-h-[500px]">
        {CRM_STAGES.map((st) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === st.id);
          const stageTotal = stageLeads.reduce((sum, l) => sum + l.estimatedValue, 0);

          return (
            <div
              key={st.id}
              className="flex flex-col rounded-xl bg-slate-900/40 border border-slate-800/80 p-2.5 space-y-2.5 min-w-[210px]"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs">
                <span className="font-bold text-slate-300 font-mono text-[11px] truncate">
                  {st.label}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 font-semibold">
                  {stageLeads.length}
                </span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400">
                ${stageTotal.toLocaleString()}
              </div>

              <div className="space-y-2 flex-1">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                      selectedLead?.id === lead.id
                        ? 'bg-indigo-950/60 border-indigo-500/80 shadow-md shadow-indigo-950/40'
                        : 'bg-[#0d111a] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate">{lead.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        ${lead.estimatedValue.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate font-medium">
                      {lead.company}
                    </div>

                    {/* Content Attribution Pill (Answers Section 19 requirement) */}
                    <div className="p-1 rounded bg-black/40 border border-slate-800 text-[10px] text-slate-300 truncate font-mono flex items-center space-x-1">
                      <Share2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{lead.contentAttribution.contentTitle}</span>
                    </div>

                    {/* Objection warning tag if any */}
                    {lead.objections.length > 0 && (
                      <div className="text-[10px] text-amber-300 truncate">
                        ⚠️ {lead.objections[0]}
                      </div>
                    )}
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="h-20 flex items-center justify-center text-[10px] text-slate-400 border border-dashed border-slate-800 rounded-lg">
                    No leads
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Detail Drawer / Workspace */}
      {selectedLead && (
        <div className="p-5 rounded-xl bg-[#0d111a] border border-indigo-500/40 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-white">{selectedLead.name}</span>
                <span className="text-slate-400 font-mono">• {selectedLead.title}</span>
                <span className="text-indigo-400 font-semibold font-mono">@{selectedLead.company}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Contact: {selectedLead.email} • Responsible Agent: {selectedLead.responsibleAgent}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setInspectedRecord({
                    moduleName: 'CRM Pipeline',
                    tableName: 'leads',
                    recordId: selectedLead.id,
                    recordTitle: selectedLead.name,
                    rawData: selectedLead,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center space-x-1.5 border border-slate-700 cursor-pointer shadow-sm"
                title="Inspect backing Supabase row"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inspect DB Row</span>
              </button>

              <button
                onClick={() => createProposalFromLead(selectedLead.id)}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm shadow-indigo-600/30 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Generate Proposal (${selectedLead.estimatedValue.toLocaleString()})</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Originating Content Attribution */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-slate-400 font-mono text-[10px] uppercase font-bold flex items-center space-x-1">
                <Share2 className="w-3 h-3 text-cyan-400" />
                <span>Which Content Sourced This Deal?</span>
              </span>
              <div className="text-xs font-semibold text-white">
                {selectedLead.contentAttribution.contentTitle}
              </div>
              <div className="text-[11px] text-indigo-300 font-mono">
                Platform: {selectedLead.contentAttribution.platform} • Touchpoint: {selectedLead.contentAttribution.touchpointType}
              </div>
            </div>

            {/* Extracted Objections */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-mono text-[10px] uppercase font-bold flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Customer Objections Logged</span>
              </span>
              {selectedLead.objections.length > 0 ? (
                selectedLead.objections.map((obj, i) => (
                  <div key={i} className="text-xs text-amber-200 bg-amber-950/20 p-1.5 rounded border border-amber-800/30">
                    "{obj}"
                  </div>
                ))
              ) : (
                <div className="text-slate-400 italic">No critical objections recorded.</div>
              )}
            </div>

            {/* Next Action */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Next Recommended Action</span>
              </span>
              <div className="text-xs font-semibold text-white">
                {selectedLead.nextAction}
              </div>
              <div className="text-[10px] text-slate-400">
                Last touch: {selectedLead.lastTouch}
              </div>
            </div>
          </div>

          {/* Move Stage Selector */}
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Transition Deal Stage:</span>
            <div className="flex flex-wrap gap-1.5">
              {CRM_STAGES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => updateLeadStage(selectedLead.id, st.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition-all ${
                    selectedLead.stage === st.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
