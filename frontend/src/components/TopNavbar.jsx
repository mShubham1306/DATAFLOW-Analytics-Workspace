import React from 'react';
import { Download, RefreshCw, Upload, CheckCircle2, AlertCircle, Clock, Loader2, Menu, Home } from 'lucide-react';
import { getDownloadUrl } from '../api/importsApi';

export const TopNavbar = ({ activeJob, onNewImport, onRefresh, onMenu, onGoHome }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <Clock className="w-3.5 h-3.5" /> Enqueued
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
            <AlertCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <header className="min-h-16 bg-white border-b border-[#E5E7EB] px-3 sm:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button onClick={onMenu} className="p-2 -ml-2 text-[#6B7280] lg:hidden" aria-label="Open navigation">
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onGoHome}
          className="hidden sm:flex items-center gap-2 cursor-pointer group mr-2 pr-3 border-r border-gray-200 hover:opacity-100 transition-all"
          title="Go to home (landing page)"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-black shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-active:scale-95">
            ◈
          </div>
          <div className="text-left group-hover:translate-x-0.5 transition-transform duration-300">
            <span className="font-black text-sm tracking-tight text-[#111827] block leading-none">
              DATA<span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">FLOW</span>
            </span>
            <span className="text-[9px] text-[#6B7280] font-semibold block -mt-0.5 uppercase tracking-wider">
              Intelligence Workspace
            </span>
          </div>
        </button>

        <button
          onClick={onGoHome}
          className="sm:hidden p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition"
          title="Go to home (landing page)"
          aria-label="Go to home"
        >
          <Home className="w-5 h-5" />
        </button>

        {activeJob ? (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h2 className="text-sm sm:text-base font-bold text-[#111827] truncate max-w-[45vw] sm:max-w-[32rem]">{activeJob.filename}</h2>
              {getStatusBadge(activeJob.status)}
            </div>
            <p className="text-[10px] sm:text-xs text-[#6B7280] truncate">
              {formatDate(activeJob.created_at)} • {activeJob.total_records?.toLocaleString()} records
              {activeJob.completed_at && ' • Ingested & Indexed'}
            </p>
          </div>
        ) : (
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-[#111827] truncate">Data Ingestion & Analytics Hub</h2>
            <p className="text-[10px] sm:text-xs text-[#6B7280] truncate">Select or upload a dataset to begin intelligence analysis</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition"
            title="Refresh active dataset"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {activeJob && activeJob.status === 'COMPLETED' && activeJob.valid_records > 0 && (
          <a
            href={getDownloadUrl(activeJob.id)}
            download
            className="inline-flex items-center gap-1.5 px-2 sm:px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Clean CSV ({activeJob.valid_records.toLocaleString()})</span>
            <span className="sm:hidden">CSV</span>
          </a>
        )}

        <button
          onClick={onNewImport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] text-xs font-semibold shadow-2xs transition"
        >
            <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline">New Import</span>
        </button>
      </div>
    </header>
  );
};
