import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'alert'
            ? AlertCircle
            : toast.type === 'warning'
            ? AlertTriangle
            : Info;

        const borderCol =
          toast.type === 'success'
            ? 'border-emerald-500/40 text-emerald-300'
            : toast.type === 'alert'
            ? 'border-red-500/40 text-red-300'
            : toast.type === 'warning'
            ? 'border-amber-500/40 text-amber-300'
            : 'border-indigo-500/40 text-indigo-300';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl bg-[#0e121c]/95 border ${borderCol} shadow-xl shadow-black/60 flex items-start space-x-3 text-xs text-slate-200 animate-slide-up backdrop-blur-md`}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-white">{toast.title}</div>
              <div className="text-slate-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
