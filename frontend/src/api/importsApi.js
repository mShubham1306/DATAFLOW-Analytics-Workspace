import axios from 'axios';

// In production, use VITE_API_URL or default to the deployed Render backend URL.
// In local dev, Vite proxy routes /api to http://127.0.0.1:8000.
const BACKEND =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://dataflow-analytics-workspace.onrender.com' : '');
const API_BASE = `${BACKEND}/api/imports`;

export const uploadCsv = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(API_BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getImportHistory = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const getJobStatus = async (jobId) => {
  const response = await axios.get(`${API_BASE}/${jobId}`);
  return response.data;
};

export const getJobAnalytics = async (jobId, { company = 'all', city = 'all', status = 'all' } = {}) => {
  const params = new URLSearchParams();
  if (company && company !== 'all') params.append('company', company);
  if (city && city !== 'all') params.append('city', city);
  if (status && status !== 'all') params.append('status', status);

  const url = `${API_BASE}/${jobId}/analytics${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await axios.get(url);
  return response.data;
};

export const getJobRecords = async (
  jobId,
  { page = 1, limit = 50, search = '', status = 'all', company = 'all', city = 'all', errorType = 'all' } = {}
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status,
  });
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  if (company && company !== 'all') {
    params.append('company', company);
  }
  if (city && city !== 'all') {
    params.append('city', city);
  }
  if (errorType && errorType !== 'all') {
    params.append('error_type', errorType);
  }

  const response = await axios.get(`${API_BASE}/${jobId}/records?${params.toString()}`);
  return response.data;
};

export const getDownloadUrl = (jobId) => {
  return `${API_BASE}/${jobId}/download`;
};

export const deleteJob = async (jobId) => {
  await axios.delete(`${API_BASE}/${jobId}`);
};
