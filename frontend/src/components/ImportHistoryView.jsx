import React from 'react';
import { FileSpreadsheet, Download, Trash2, ArrowRight, CheckCircle2, AlertCircle, Clock, Loader2, Sparkles } from 'lucide-react';
import { getDownloadUrl, deleteJob } from '../api/importsApi';

export const ImportHistoryView = ({ jobs = [], onSelectJob, onRefresh }) => {
  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    if (window.confirm('Delete this historical import and its record database?')) {
      try {
        await deleteJob(jobId);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Failed to delete import job.');
      }
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Import History</h3>
          <p className="text-xs text-[#6B7280]">
            Audit previous ingestion runs, view historical quality scores, and export cleaned files
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#374151]">
          {jobs.length} Ingestions Recorded
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#6B7280] bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB]">
          <FileSpreadsheet className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
          <p className="font-semibold text-[#374151]">No previous imports found</p>
          <p className="text-[11px] text-[#9CA3AF] mt-1">Uploaded CSV files will remain accessible here across reloads.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table className="w-full text-left text-xs text-[#374151]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-bold uppercase tracking-wider text-[10px] border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Uploaded Time</th>
                <th className="py-3 px-4 text-center">Total</th>
                <th className="py-3 px-4 text-center text-[#16A34A]">Valid</th>
                <th className="py-3 px-4 text-center text-[#DC2626]">Invalid</th>
                <th className="py-3 px-4 text-center text-[#F59E0B]">Duplicates</th>
                <th className="py-3 px-4 text-center">Quality</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {jobs.map((job) => {
                const quality =
                  job.total_records > 0
                    ? Math.round((job.valid_records / job.total_records) * 100)
                    : 0;

                return (
                  <tr
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className="hover:bg-[#F9FAFB] cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#111827] flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <span className="truncate max-w-[200px]" title={job.filename}>
                        {job.filename}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B7280]">{formatDate(job.created_at)}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#111827]">
                      {job.total_records?.toLocaleString() || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#16A34A]">
                      {job.valid_records?.toLocaleString() || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#DC2626]">
                      {job.invalid_records?.toLocaleString() || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-[#F59E0B]">
                      {job.duplicate_count?.toLocaleString() || 0}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          quality >= 90
                            ? 'bg-[#DCFCE7] text-[#16A34A]'
                            : quality >= 70
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#FEE2E2] text-[#DC2626]'
                        }`}
                      >
                        {quality}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {job.status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 text-[#16A34A] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : job.status === 'PROCESSING' ? (
                        <span className="inline-flex items-center gap-1 text-[#2563EB] font-semibold">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#DC2626] font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {job.status === 'COMPLETED' && job.valid_records > 0 && (
                          <a
                            href={getDownloadUrl(job.id)}
                            download
                            className="p-1.5 text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition"
                            title="Download Clean CSV"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, job.id)}
                          className="p-1.5 text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition"
                          title="Delete Ingestion"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectJob(job.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2563EB] text-white hover:bg-[#1D4ED8] font-semibold transition"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
