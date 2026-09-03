import React from 'react';
import { Download, RefreshCw, Upload, CheckCircle2, AlertCircle, Clock, Loader2, Sparkles } from 'lucide-react';
import { getDownloadUrl } from '../api/importsApi';

export const TopNavbar = ({ activeJob, onNewImport, onRefresh }) => {
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
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-4">
        {activeJob ? (
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-[#111827]">{activeJob.filename}</h2>
              {getStatusBadge(activeJob.status)}
            </div>
            <p className="text-xs text-[#6B7280]">
              {formatDate(activeJob.created_at)} • {activeJob.total_records?.toLocaleString()} records
              {activeJob.completed_at && ' • Ingested & Indexed'}
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-base font-bold text-[#111827]">Data Ingestion & Analytics Hub</h2>
            <p className="text-xs text-[#6B7280]">Select or upload a dataset to begin intelligence analysis</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Clean CSV ({activeJob.valid_records.toLocaleString()})
          </a>
        )}

        <button
          onClick={onNewImport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] text-xs font-semibold shadow-2xs transition"
        >
          <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
          New Import
        </button>
      </div>
    </header>
  );
};
