import React, { useState, useEffect } from 'react';
import { UploadZone } from '../components/UploadZone';
import { ImportHistory } from '../components/ImportHistory';
import { getImportHistory } from '../api/importsApi';
import { Database, ShieldCheck, Zap } from 'lucide-react';

export const Dashboard = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getImportHistory();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load import history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleUploadSuccess = (newJobId) => {
    fetchHistory();
    onSelectJob(newJobId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5" /> High-Performance Validation Pipeline
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          CSV Customer Import Dashboard
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
          Upload, validate, and persist customer records with real-time $O(N)$ duplicate checking, streaming batch processing, and DB-backed pagination.
        </p>
      </div>

      {/* Main Upload Zone */}
      <UploadZone onUploadSuccess={handleUploadSuccess} />

      {/* Import History */}
      <ImportHistory jobs={jobs} onSelectJob={onSelectJob} onRefresh={fetchHistory} />
    </div>
  );
};
