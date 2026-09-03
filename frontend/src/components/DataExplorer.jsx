import React, { useState } from 'react';
import { Search, X, Check, AlertTriangle, ChevronLeft, ChevronRight, Eye, AlertCircle } from 'lucide-react';
import { RecordDetailDrawer } from './RecordDetailDrawer';

export const DataExplorer = ({
  records = [],
  loading = false,
  total = 0,
  page = 1,
  limit = 50,
  totalPages = 1,
  onPageChange,
  onLimitChange,
  search = '',
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
}) => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const start = total > 0 ? (page - 1) * limit + 1 : 0;
  const end = Math.min(page * limit, total);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:p-6 shadow-2xs min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-[#111827]">Data Explorer</h3>
          <p className="text-xs text-[#6B7280]">
            Inspect record-level validation, search across customer attributes, and view issue details
          </p>
        </div>

        {/* Search Input & Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60 sm:min-w-0">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search name, email, company, city..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB]"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center p-1 rounded-xl bg-[#F3F4F6] border border-[#E5E7EB] text-xs">
            <button
              onClick={() => onStatusFilterChange('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-white text-[#2563EB] shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onStatusFilterChange('valid')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                statusFilter === 'valid'
                  ? 'bg-white text-[#16A34A] shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Valid
            </button>
            <button
              onClick={() => onStatusFilterChange('invalid')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                statusFilter === 'invalid'
                  ? 'bg-white text-[#DC2626] shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Invalid
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#6B7280]">
          <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading records from database...
        </div>
      ) : records.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#6B7280] bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB]">
          <AlertCircle className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
          <p className="font-semibold text-[#374151]">No records matched current search/filter criteria</p>
          <p className="text-[11px] text-[#9CA3AF] mt-1">Try clearing search or changing the filter settings.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table className="min-w-[860px] w-full text-left text-xs text-[#374151]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-bold uppercase tracking-wider text-[10px] border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-3.5 w-14 text-center">Row</th>
                <th className="py-3 px-3.5">Name</th>
                <th className="py-3 px-3.5">Email</th>
                <th className="py-3 px-3.5">Phone</th>
                <th className="py-3 px-3.5">Company</th>
                <th className="py-3 px-3.5">City</th>
                <th className="py-3 px-3.5 w-24 text-center">Status</th>
                <th className="py-3 px-3.5">Validation Issues</th>
                <th className="py-3 px-3.5 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {records.map((rec) => (
                <tr
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className={`hover:bg-[#F9FAFB] cursor-pointer transition ${
                    !rec.is_valid ? 'bg-[#FEF2F2]/40' : ''
                  }`}
                >
                  <td className="py-3 px-3.5 font-mono text-[11px] text-[#6B7280] text-center font-bold">
                    #{rec.row_number}
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-[#111827]">
                    {rec.name || <span className="text-[#DC2626] italic font-normal">(missing)</span>}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px]">
                    {rec.email || <span className="text-[#DC2626] italic font-normal">(missing)</span>}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px]">
                    {rec.phone || <span className="text-[#DC2626] italic font-normal">(missing)</span>}
                  </td>
                  <td className="py-3 px-3.5">
                    {rec.company || <span className="text-[#DC2626] italic font-normal">(missing)</span>}
                  </td>
                  <td className="py-3 px-3.5">
                    {rec.city || <span className="text-[#DC2626] italic font-normal">(missing)</span>}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    {rec.is_valid ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                        <Check className="w-3 h-3" /> Valid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEE2E2] text-[#DC2626]">
                        <AlertTriangle className="w-3 h-3" /> Invalid
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    {rec.is_valid ? (
                      <span className="text-[#9CA3AF] text-[11px]">None</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {rec.validation_reasons?.map((reason, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]"
                            title={reason.message}
                          >
                            {reason.message}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="p-1 text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded transition"
                      title="Inspect Record Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-[#E5E7EB] text-xs text-[#6B7280]">
          <div>
            Showing <span className="font-bold text-[#111827]">{start}</span> to{' '}
            <span className="font-bold text-[#111827]">{end}</span> of{' '}
            <span className="font-bold text-[#111827]">{total.toLocaleString()}</span> records
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span>Rows:</span>
              <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-2 py-1 text-xs text-[#111827] font-medium focus:outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-[#111827]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspector Drawer */}
      {selectedRecord && (
        <RecordDetailDrawer record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      )}
    </div>
  );
};
