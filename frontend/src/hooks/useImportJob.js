import { useState, useEffect, useCallback } from 'react';
import { getJobStatus } from '../api/importsApi';

export const useImportJob = (jobId) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    try {
      const data = await getJobStatus(jobId);
      setJob(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch import job details.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    
    // Initial fetch
    fetchJob();

    // Polling interval if job is still in progress
    const interval = setInterval(async () => {
      const currentJob = await fetchJob();
      if (currentJob && (currentJob.status === 'COMPLETED' || currentJob.status === 'FAILED')) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, fetchJob]);

  return { job, loading, error, refresh: fetchJob };
};
