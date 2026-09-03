import React from 'react';
import { X, CheckCircle2, AlertTriangle, Building, MapPin, Mail, Phone, User, Hash } from 'lucide-react';

export const RecordDetailDrawer = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-[#E5E7EB] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-[#F3F4F6] text-[#374151] flex items-center justify-center font-mono font-bold text-xs">
                #{record.row_number}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#111827] truncate">Record Inspector</h3>
                <p className="text-xs text-[#6B7280] truncate">Row #{record.row_number} from CSV file</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Validity Status Banner */}
          <div className="p-4 sm:p-6 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Validation Status</span>
              {record.is_valid ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid Record
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]">
                  <AlertTriangle className="w-3.5 h-3.5" /> Invalid Record
                </span>
              )}
            </div>

            {/* Validation Issues if invalid */}
            {!record.is_valid && record.validation_reasons && record.validation_reasons.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider block">
                  Applicable Failure Reasons ({record.validation_reasons.length})
                </span>
                {record.validation_reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-[#FCA5A5] text-xs space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#991B1B]">{reason.message}</span>
                      <span className="text-[10px] font-mono text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.5 rounded font-semibold">
                        {reason.code}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B7280] block">Target field: {reason.field}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Record Attributes Fields */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Customer Attributes</h4>

            {/* Name */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <User className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[11px] text-[#6B7280] block">Full Name</span>
                <span className="text-xs font-semibold text-[#111827]">
                  {record.name || <span className="text-[#DC2626] italic">(Missing)</span>}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <Mail className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[11px] text-[#6B7280] block">Email Address</span>
                <span className="text-xs font-mono font-semibold text-[#111827]">
                  {record.email || <span className="text-[#DC2626] italic">(Missing)</span>}
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <Phone className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[11px] text-[#6B7280] block">Phone Number</span>
                <span className="text-xs font-mono font-semibold text-[#111827]">
                  {record.phone || <span className="text-[#DC2626] italic">(Missing)</span>}
                </span>
              </div>
            </div>

            {/* Company */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <Building className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[11px] text-[#6B7280] block">Organization</span>
                <span className="text-xs font-semibold text-[#111827]">
                  {record.company || <span className="text-[#DC2626] italic">(Missing)</span>}
                </span>
              </div>
            </div>

            {/* City */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <MapPin className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[11px] text-[#6B7280] block">City Location</span>
                <span className="text-xs font-semibold text-[#111827]">
                  {record.city || <span className="text-[#DC2626] italic">(Missing)</span>}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 sm:p-6 border-t border-[#E5E7EB] bg-[#F9FAFB]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-xs font-bold text-[#374151] transition shadow-2xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
