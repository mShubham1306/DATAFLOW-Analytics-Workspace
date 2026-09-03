import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

export const RecordsTable = ({ records, loading }) => {
  if (loading) {
    return (
      <div className="w-full py-16 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700/60">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mb-3"></div>
        <p className="text-sm">Loading records...</p>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="w-full py-16 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-700/60">
        <AlertCircle className="w-10 h-10 mx-auto text-slate-500 mb-3" />
        <p className="text-base font-semibold text-slate-300">No records found</p>
        <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or filter settings.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-800/60 shadow-lg">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/80">
          <tr>
            <th scope="col" className="py-3.5 px-4 w-16 text-center">Row</th>
            <th scope="col" className="py-3.5 px-4">Name</th>
            <th scope="col" className="py-3.5 px-4">Email</th>
            <th scope="col" className="py-3.5 px-4">Phone</th>
            <th scope="col" className="py-3.5 px-4">Company</th>
            <th scope="col" className="py-3.5 px-4">City</th>
            <th scope="col" className="py-3.5 px-4 w-28 text-center">Status</th>
            <th scope="col" className="py-3.5 px-4 min-w-[240px]">Validation Issues</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {records.map((record) => (
            <tr
              key={record.id}
              className={`hover:bg-slate-700/40 transition-colors ${
                !record.is_valid ? 'bg-rose-500/[0.02]' : ''
              }`}
            >
              {/* Row Number */}
              <td className="py-3 px-4 font-mono text-xs text-slate-400 text-center font-medium">
                #{record.row_number}
              </td>

              {/* Name */}
              <td className="py-3 px-4 font-medium text-slate-100">
                {record.name ? record.name : <span className="italic text-slate-500 text-xs">(missing)</span>}
              </td>

              {/* Email */}
              <td className="py-3 px-4 font-mono text-xs">
                {record.email ? record.email : <span className="italic text-slate-500 text-xs">(missing)</span>}
              </td>

              {/* Phone */}
              <td className="py-3 px-4 font-mono text-xs">
                {record.phone ? record.phone : <span className="italic text-slate-500 text-xs">(missing)</span>}
              </td>

              {/* Company */}
              <td className="py-3 px-4 text-slate-300">
                {record.company ? record.company : <span className="italic text-slate-500 text-xs">(missing)</span>}
              </td>

              {/* City */}
              <td className="py-3 px-4 text-slate-300">
                {record.city ? record.city : <span className="italic text-slate-500 text-xs">(missing)</span>}
              </td>

              {/* Validity Status */}
              <td className="py-3 px-4 text-center">
                {record.is_valid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-3 h-3" /> Valid
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <X className="w-3 h-3" /> Invalid
                  </span>
                )}
              </td>

              {/* Validation Reasons */}
              <td className="py-3 px-4">
                {record.is_valid ? (
                  <span className="text-xs text-slate-500 font-medium">None</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {record.validation_reasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20"
                        title={reason.message}
                      >
                        <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>{reason.message}</span>
                      </span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
