import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Download, Trash2, ArrowRight, FileSpreadsheet, Calendar } from 'lucide-react';
import { getDownloadUrl, deleteJob } from '../api/importsApi';

export const ImportHistory = ({ jobs, onSelectJob, onRefresh }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700/60 mt-8">
        <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-500 mb-2" />
        <p className="font-semibold text-slate-300">No previous imports</p>
        <p className="text-xs text-slate-500 mt-1">Uploaded CSV import jobs will be listed here.</p>
      </div>
    );
  }

  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this import job history?')) {
      try {
        await deleteJob(jobId);
        if (onRefresh) onRefresh();
      } catch (err) {
        alert('Failed to delete import job.');
      }
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Recent Import History
        </h3>
        <span className="text-xs text-slate-400">{jobs.length} imports recorded</span>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-800/60 shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/80">
            <tr>
              <th scope="col" className="py-3.5 px-4">Filename</th>
              <th scope="col" className="py-3.5 px-4">Uploaded At</th>
              <th scope="col" className="py-3.5 px-4 text-center">Total</th>
              <th scope="col" className="py-3.5 px-4 text-center text-emerald-400">Valid</th>
              <th scope="col" className="py-3.5 px-4 text-center text-rose-400">Invalid</th>
              <th scope="col" className="py-3.5 px-4 text-center">Status</th>
              <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {jobs.map((job) => (
              <tr
                key={job.id}
                onClick={() => onSelectJob(job.id)}
                className="hover:bg-slate-700/40 cursor-pointer transition-colors"
              >
                <td className="py-3.5 px-4 font-semibold text-slate-100 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate max-w-[200px]">{job.filename}</span>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-400">
                  {formatDate(job.created_at)}
                </td>
                <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                  {job.total_records.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center font-semibold text-emerald-400">
                  {job.valid_records.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center font-semibold text-rose-400">
                  {job.invalid_records.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={job.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    {job.status === 'COMPLETED' && (
                      <a
                        href={getDownloadUrl(job.id)}
                        download
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition"
                        title="Download Valid CSV"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, job.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
                      title="Delete Import"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectJob(job.id)}
                      className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
                      title="View Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
