import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExcelIngestionRow } from '../types';
import {
  FileSpreadsheet,
  X,
  UploadCloud,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Database,
} from 'lucide-react';

const SAMPLE_LINKEDIN_ROWS: ExcelIngestionRow[] = [
  {
    prospectName: 'Samantha Wei',
    company: 'Zenith Logistics Global',
    decisionTitle: 'Chief Revenue Officer',
    source: 'LinkedIn Inbound DM',
    dealValue: 35000,
    initialMessageOrNote: 'Saw your LinkedIn post about 4-hour latency. Our 8 SDRs take 6 hours. Can we talk this week?',
    phoneOrEmail: 'samantha.wei@zenithglobal.io',
  },
  {
    prospectName: 'Arjun Mehta',
    company: 'Nexus Flow Technologies',
    decisionTitle: 'VP Product & AI Ops',
    source: 'LinkedIn Post Comment',
    dealValue: 28000,
    initialMessageOrNote: 'Commented on your 21-agent OS architecture video. We want to deploy an autonomous triage pipeline.',
    phoneOrEmail: 'arjun@nexusflow.ai',
  },
  {
    prospectName: 'Bradley Cooper',
    company: 'Apex Supply Chain Partners',
    decisionTitle: 'Managing Partner',
    source: 'LinkedIn Inbound InMail',
    dealValue: 42000,
    initialMessageOrNote: 'Reached out after reading the zero-code handshake post. Our engineering team needs this sandbox.',
    phoneOrEmail: 'bradley@apexpartners.com',
  },
];

export const ExcelSyncModal: React.FC = () => {
  const { isExcelSyncOpen, setIsExcelSyncOpen, ingestExcelRows, addToast } = useApp();
  const [rows, setRows] = useState<ExcelIngestionRow[]>(SAMPLE_LINKEDIN_ROWS);
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedText, setPastedText] = useState('');

  if (!isExcelSyncOpen) return null;

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        prospectName: 'New Contact',
        company: 'Company Name',
        decisionTitle: 'VP Sales / Founder',
        source: 'LinkedIn Inbound',
        dealValue: 25000,
        initialMessageOrNote: 'Inbound message from LinkedIn outreach / post.',
        phoneOrEmail: 'contact@company.com',
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index: number, field: keyof ExcelIngestionRow, value: any) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    setRows(updated);
  };

  const handleParsePaste = () => {
    if (!pastedText.trim()) return;
    const lines = pastedText.trim().split('\n');
    const parsedRows: ExcelIngestionRow[] = [];

    lines.forEach((line) => {
      // Split by tab (Excel/Sheets default) or comma
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      if (parts.length >= 2) {
        parsedRows.push({
          prospectName: parts[0]?.trim() || 'LinkedIn Contact',
          company: parts[1]?.trim() || 'Target Enterprise',
          decisionTitle: parts[2]?.trim() || 'Executive Decision Maker',
          dealValue: parseInt(parts[3]?.replace(/[^0-9]/g, '') || '24000', 10),
          source: 'Excel/Sheets Direct Paste',
          initialMessageOrNote: parts[4]?.trim() || 'Inbound interest from LinkedIn campaign.',
          phoneOrEmail: parts[5]?.trim() || '',
        });
      }
    });

    if (parsedRows.length > 0) {
      setRows([...rows, ...parsedRows]);
      setPasteMode(false);
      setPastedText('');
      addToast({
        title: 'Spreadsheet Data Parsed',
        message: `Parsed ${parsedRows.length} rows from clipboard.`,
        type: 'info',
      });
    }
  };

  const handleExecuteSync = () => {
    ingestExcelRows(rows);
    setIsExcelSyncOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0d111a] border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/50 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Excel & LinkedIn Inbound Spreadsheet Synchronizer
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Universal Cascade
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Updates CRM → Sales Discovery → Client Onboarding → Delivery Room → Finance Revenue
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExcelSyncOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPasteMode(!pasteMode)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                pasteMode
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              {pasteMode ? 'Back to Table View' : '📋 Paste Excel / Google Sheets Raw Data'}
            </button>
            <button
              onClick={() => setRows(SAMPLE_LINKEDIN_ROWS)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
            >
              Load 3 Verified Inbound Contacts
            </button>
          </div>

          <button
            onClick={handleAddRow}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-medium border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {pasteMode ? (
            <div className="space-y-3">
              <span className="text-slate-300 font-medium block">
                Paste rows directly from Excel or Google Sheets (Tab or comma separated):
              </span>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Prospect Name	Company	Title	Deal Value	Note / Inbound Message&#10;e.g. John Doe	Acme Logistics	VP Sales	$30,000	Inbound inquiry from LinkedIn post #101"
                rows={8}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleParsePaste}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
              >
                Parse & Add to Synchronizer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-black/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Prospect Name</th>
                      <th className="p-2.5">Company</th>
                      <th className="p-2.5">Title</th>
                      <th className="p-2.5">Deal Value ($)</th>
                      <th className="p-2.5">Initial Message / Note</th>
                      <th className="p-2.5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-sans">
                    {rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.prospectName}
                            onChange={(e) => handleUpdateRow(idx, 'prospectName', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.company}
                            onChange={(e) => handleUpdateRow(idx, 'company', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-white text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.decisionTitle}
                            onChange={(e) => handleUpdateRow(idx, 'decisionTitle', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={row.dealValue}
                            onChange={(e) => handleUpdateRow(idx, 'dealValue', parseInt(e.target.value, 10) || 0)}
                            className="w-24 px-2 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs font-semibold"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.initialMessageOrNote}
                            onChange={(e) => handleUpdateRow(idx, 'initialMessageOrNote', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleRemoveRow(idx)}
                            className="p-1 rounded text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cascade Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-[11px] leading-relaxed space-y-1">
                <span className="font-bold text-emerald-400 font-mono text-xs block flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Automatic Cascade Telemetry on Sync:</span>
                </span>
                <p>
                  1. <strong>CRM:</strong> Creates {rows.length} new leads with verified LinkedIn organic attribution.<br />
                  2. <strong>Sales:</strong> Generates discovery dossier with recommended questions.<br />
                  3. <strong>Client Onboarding:</strong> Pre-provisions account workspace readiness.<br />
                  4. <strong>Finance:</strong> Adds +${rows.reduce((sum, r) => sum + r.dealValue, 0).toLocaleString()} to pipeline value.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            {rows.length} contacts ready to ingest • Total Value: ${rows.reduce((s, r) => s + r.dealValue, 0).toLocaleString()}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExcelSyncOpen(false)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteSync}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Synchronize Excel to Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
