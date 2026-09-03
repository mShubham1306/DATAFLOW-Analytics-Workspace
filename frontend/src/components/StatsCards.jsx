import React from 'react';
import { Files, CheckCircle, AlertTriangle, Copy, Activity } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const StatsCards = ({ job }) => {
  if (!job) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 my-6">
      {/* Total Records */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Records</span>
          <div className="p-2 rounded-xl bg-slate-700/50 text-slate-300">
            <Files className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-slate-100">
            {job.total_records.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Valid Records */}
      <div className="bg-slate-800/80 border border-emerald-500/20 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-400/90 uppercase tracking-wider">Valid Records</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-emerald-400">
            {job.valid_records.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Invalid Records */}
      <div className="bg-slate-800/80 border border-rose-500/20 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-400/90 uppercase tracking-wider">Invalid Records</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-rose-400">
            {job.invalid_records.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Duplicate Count */}
      <div className="bg-slate-800/80 border border-amber-500/20 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider">Duplicates</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Copy className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-amber-400">
            {job.duplicate_count.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
          <div className="p-2 rounded-xl bg-slate-700/50 text-slate-300">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <StatusBadge status={job.status} />
        </div>
      </div>
    </div>
  );
};
