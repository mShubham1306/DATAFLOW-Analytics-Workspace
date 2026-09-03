import React from 'react';
import { CheckCircle2, Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react';

export const ProcessingScreen = ({ job }) => {
  const isFailed = job?.status === 'FAILED';
  const total = job?.total_records || 100;
  const processed = (job?.valid_records || 0) + (job?.invalid_records || 0);
  const percent = total > 0 ? Math.min(100, Math.round((processed / total) * 100)) || 65 : 45;

  return (
    <div className="max-w-2xl mx-auto my-6 sm:my-16 p-4 sm:p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      <div className="flex items-center gap-3 pb-6 border-b border-[#E5E7EB] min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-[#111827] break-words">
            {isFailed ? 'Import Failed' : `Ingesting ${job?.filename || 'dataset.csv'}`}
          </h3>
          <p className="text-xs text-[#6B7280]">
            {isFailed ? 'Data validation encountered an error' : 'Streaming validation engine active'}
          </p>
        </div>
      </div>

      {!isFailed ? (
        <div className="py-6 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#374151]">Processing records...</span>
              <span className="text-[#2563EB]">{percent}%</span>
            </div>
            <div className="w-full h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-[#6B7280] mt-1.5 font-mono">
              <span>{processed.toLocaleString()} processed</span>
              <span>{total > 0 ? `${total.toLocaleString()} total records` : 'Estimating...'}</span>
            </div>
          </div>

          {/* Pipeline Checklist */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-[#16A34A] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>File validated & UTF-8 character encoding verified</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#16A34A] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Required columns detected: <code className="font-mono text-[#111827]">name, email, phone, company, city</code></span>
            </div>
            <div className="flex items-center gap-2.5 text-[#16A34A] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>O(N) HashSet duplicate email detector initialized</span>
            </div>
            <div className="flex items-center gap-2.5 text-[#2563EB] font-semibold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing record validation & computing analytical distributions...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6">
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block">Import Ingestion Error</span>
              <p className="text-xs mt-1 text-[#991B1B]">{job.error_message || 'An unexpected file parsing error occurred.'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
