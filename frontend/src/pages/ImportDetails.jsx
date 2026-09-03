import React, { useState, useEffect, useCallback } from 'react';
import { useImportJob } from '../hooks/useImportJob';
import { getJobRecords, getDownloadUrl } from '../api/importsApi';
import { StatsCards } from '../components/StatsCards';
import { Filters } from '../components/Filters';
import { RecordsTable } from '../components/RecordsTable';
import { Pagination } from '../components/Pagination';
import { ArrowLeft, Download, RefreshCw, AlertCircle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const ImportDetails = ({ jobId, onBack }) => {
  const { job, loading: jobLoading, error: jobError, refresh: refreshJob } = useImportJob(jobId);

  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    if (!jobId) return;
    try {
      setRecordsLoading(true);
      const data = await getJobRecords(jobId, {
        page,
        limit,
        search,
        status: statusFilter,
      });
      setRecords(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Failed to fetch import records:', err);
    } finally {
      setRecordsLoading(false);
    }
  }, [jobId, page, limit, search, statusFilter]);

  // Fetch records whenever filters/pagination or job status change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords, job?.status, job?.valid_records, job?.invalid_records]);

  // Reset to page 1 on filter/search change
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  if (jobLoading && !job) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-blue-400 mb-3" />
        <p className="text-sm">Loading import job status...</p>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-rose-400 mb-3" />
          <h3 className="text-lg font-semibold">Import Job Error</h3>
          <p className="text-sm text-rose-300 mt-1">{jobError || 'Job not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white text-xs font-semibold uppercase tracking-wider mb-3 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
                {job.filename}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Job ID: {job.id}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refreshJob();
              fetchRecords();
            }}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition"
            title="Refresh Job Status & Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {job.status === 'COMPLETED' && job.valid_records > 0 && (
            <a
              href={getDownloadUrl(job.id)}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition"
            >
              <Download className="w-4 h-4" /> Download Valid CSV ({job.valid_records.toLocaleString()})
            </a>
          )}
        </div>
      </div>

      {/* Failure Callout Banner if job failed */}
      {job.status === 'FAILED' && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-rose-200 text-sm">Import Processing Failed</h4>
            <p className="text-xs text-rose-300 mt-1">{job.error_message || 'An unexpected error occurred during CSV parsing.'}</p>
          </div>
        </div>
      )}

      {/* Stats Summary Cards */}
      <StatsCards job={job} />

      {/* Filters Bar */}
      <Filters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      {/* Records Table */}
      <RecordsTable records={records} loading={recordsLoading} />

      {/* DB-backed Pagination Controls */}
      <Pagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
      />
    </div>
  );
};
