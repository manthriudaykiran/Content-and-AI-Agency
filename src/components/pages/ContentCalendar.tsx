import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentAsset } from '../../types';
import {
  Calendar as CalendarIcon,
  Filter,
  CheckCircle,
  Eye,
  Plus,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Share2,
  DollarSign,
  ArrowRight,
  Database,
} from 'lucide-react';

const STAGES: Array<ContentAsset['status']> = [
  'idea',
  'draft',
  'review',
  'approved',
  'scheduled',
  'published',
  'analyzed',
];

export const ContentCalendar: React.FC = () => {
  const { contentAssets, updateContentStatus, addToast, setInspectedRecord } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedFunnel, setSelectedFunnel] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<ContentAsset | null>(null);

  const filteredAssets = contentAssets.filter((a) => {
    if (selectedPlatform !== 'all' && a.platform !== selectedPlatform) return false;
    if (selectedFunnel !== 'all' && a.funnelStage !== selectedFunnel) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0d111a] border border-slate-800">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Content Publishing Matrix</h2>
            <p className="text-xs text-slate-400">
              Stages preserve source insight, funnel position, CTA, and closed revenue attribution
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
          >
            <option value="all">All Platforms</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
          </select>

          {/* Funnel Filter */}
          <select
            value={selectedFunnel}
            onChange={(e) => setSelectedFunnel(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
          >
            <option value="all">All Funnel Stages</option>
            <option value="top_of_funnel">Top of Funnel</option>
            <option value="middle_of_funnel">Middle of Funnel</option>
            <option value="bottom_of_funnel">Bottom of Funnel</option>
          </select>
        </div>
      </div>

      {/* Kanban Stages Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 overflow-x-auto min-h-[550px]">
        {STAGES.map((stage) => {
          const stageAssets = filteredAssets.filter((a) => a.status === stage);
          return (
            <div
              key={stage}
              className="flex flex-col rounded-xl bg-slate-900/40 border border-slate-800/80 p-3 space-y-3 min-w-[200px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
                  {stage}
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 font-semibold">
                  {stageAssets.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-2 flex-1">
                {stageAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="p-3 rounded-lg bg-[#0e1320] border border-slate-800/90 hover:border-indigo-500/50 hover:bg-[#12192b] transition-all cursor-pointer space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-indigo-400 font-semibold uppercase">
                        {asset.platform}
                      </span>
                      <span className="text-slate-400">{asset.format}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                      {asset.title}
                    </h4>

                    {asset.metrics && asset.metrics.revenueAttributed > 0 && (
                      <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 font-semibold">
                        <DollarSign className="w-3 h-3" />
                        <span>${asset.metrics.revenueAttributed.toLocaleString()} closed</span>
                      </div>
                    )}

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60">
                      <span className="truncate">{asset.campaign}</span>
                      <span className="text-indigo-400">Inspect →</span>
                    </div>
                  </div>
                ))}

                {stageAssets.length === 0 && (
                  <div className="h-24 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-slate-800/60 rounded-lg">
                    Empty Stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Asset Inspector Modal Drawer */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0d111a] border border-indigo-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400">
                  <span className="uppercase font-semibold">{selectedAsset.platform}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedAsset.status}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedAsset.title}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    setInspectedRecord({
                      moduleName: 'Content OS',
                      tableName: 'content_assets',
                      recordId: selectedAsset.id,
                      recordTitle: selectedAsset.title,
                      rawData: selectedAsset,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center space-x-1.5 border border-slate-700 cursor-pointer shadow-sm"
                  title="Inspect backing Supabase row"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inspect DB Row</span>
                </button>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Asset Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Source Insight</span>
                <span className="text-slate-200">{selectedAsset.sourceInsight}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Audience</span>
                <span className="text-slate-200">{selectedAsset.targetAudience}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Funnel Stage</span>
                <span className="text-slate-200 capitalize">{selectedAsset.funnelStage.replace(/_/g, ' ')}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Primary Call to Action</span>
                <span className="text-cyan-300 font-medium">{selectedAsset.cta}</span>
              </div>
            </div>

            {/* Performance Attribution */}
            {selectedAsset.metrics && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Reach:</span>
                  <span className="text-white font-bold">{selectedAsset.metrics.reach.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Engagements:</span>
                  <span className="text-indigo-300 font-bold">{selectedAsset.metrics.engagements.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Leads Generated:</span>
                  <span className="text-cyan-300 font-bold">{selectedAsset.metrics.leadsGenerated}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Revenue Attributed:</span>
                  <span className="text-emerald-400 font-bold">${selectedAsset.metrics.revenueAttributed.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Stage Transition Buttons */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Move to stage:</span>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateContentStatus(selectedAsset.id, st);
                      setSelectedAsset((prev) => (prev ? { ...prev, status: st } : null));
                    }}
                    className={`px-2.5 py-1 rounded text-xs capitalize font-mono transition-all ${
                      selectedAsset.status === st
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
