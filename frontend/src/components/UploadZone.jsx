import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { uploadCsv } from '../api/importsApi';

export const UploadZone = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    setErrorMessage(null);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setErrorMessage('Invalid file type. Please select a valid .csv file.');
      return;
    }

    if (file.size === 0) {
      setErrorMessage('The selected file is empty (0 bytes).');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadCsv(file);
      if (onUploadSuccess) {
        onUploadSuccess(result.job_id);
      }
    } catch (err) {
      const serverErr = err.response?.data?.detail || 'Failed to upload CSV file. Please check server logs.';
      setErrorMessage(serverErr);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {uploading ? (
              <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            ) : (
              <UploadCloud className="w-10 h-10 text-blue-400" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              {uploading ? 'Uploading CSV...' : 'Upload Customer CSV File'}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Drag & drop your CSV file here, or <span className="text-blue-400 font-medium hover:underline">browse file</span>
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/50 text-xs text-slate-400">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            Required columns: <code className="text-slate-300">name, email, phone, company, city</code>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Upload Error</span>
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};
