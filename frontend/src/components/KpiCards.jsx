import React from 'react';
import { Files, CheckCircle, AlertTriangle, Copy, ShieldCheck, PieChart, Building2, MapPin } from 'lucide-react';

export const KpiCards = ({ summary }) => {
  if (!summary) return null;

  const total = summary.total_records || 0;
  const valid = summary.valid_records || 0;
  const invalid = summary.invalid_records || 0;
  const duplicates = summary.duplicate_count || 0;
  const qualityScore = summary.quality_score || 0;
  const completenessScore = summary.completeness_score || 0;
  const uniqueCompanies = summary.unique_companies || 0;
  const uniqueCities = summary.unique_cities || 0;

  const validPct = total > 0 ? ((valid / total) * 100).toFixed(1) : '0';
  const invalidPct = total > 0 ? ((invalid / total) * 100).toFixed(1) : '0';
  const dupPct = total > 0 ? ((duplicates / total) * 100).toFixed(1) : '0';

  const getQualityBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-[#16A34A] bg-[#DCFCE7]' };
    if (score >= 70) return { label: 'Moderate', color: 'text-[#F59E0B] bg-[#FEF3C7]' };
    return { label: 'Action Needed', color: 'text-[#DC2626] bg-[#FEE2E2]' };
  };

  const qualityBadge = getQualityBadge(qualityScore);

  return (
    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
      {/* 1. Total */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#6B7280] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total</span>
          <Files className="w-4 h-4 text-[#2563EB]" />
        </div>
        <div className="text-xl font-extrabold text-[#111827]">{total.toLocaleString()}</div>
        <div className="text-[11px] text-[#6B7280] mt-1">100% records</div>
      </div>

      {/* 2. Valid */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#6B7280] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#16A34A]">Valid</span>
          <CheckCircle className="w-4 h-4 text-[#16A34A]" />
        </div>
        <div className="text-xl font-extrabold text-[#16A34A]">{valid.toLocaleString()}</div>
        <div className="text-[11px] text-[#16A34A] font-semibold mt-1">{validPct}% valid</div>
      </div>

      {/* 3. Invalid */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#6B7280] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">Invalid</span>
          <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
        </div>
        <div className="text-xl font-extrabold text-[#DC2626]">{invalid.toLocaleString()}</div>
        <div className="text-[11px] text-[#DC2626] font-semibold mt-1">{invalidPct}% issues</div>
      </div>

      {/* 4. Duplicates */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#6B7280] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#F59E0B]">Duplicates</span>
          <Copy className="w-4 h-4 text-[#F59E0B]" />
        </div>
        <div className="text-xl font-extrabold text-[#F59E0B]">{duplicates.toLocaleString()}</div>
        <div className="text-[11px] text-[#D97706] font-semibold mt-1">{dupPct}% repeated</div>
      </div>

      {/* 5. Quality Score */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#6B7280] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">Quality</span>
          <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
        </div>
        <div className="text-xl font-extrabold text-[#2563EB]">{qualityScore}%</div>
        <div className="mt-1">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${qualityBadge.color}`}>
            {qualityBadge.label}
          </span>
        </div>
      </div>

      {/* 6. Completeness */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#6B7280] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Completeness</span>
          <PieChart className="w-4 h-4 text-[#6B7280]" />
        </div>
        <div className="text-xl font-extrabold text-[#111827]">{completenessScore}%</div>
        <div className="text-[11px] text-[#6B7280] mt-1">Field density</div>
      </div>

      {/* 7. Unique Companies */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#6B7280] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Companies</span>
          <Building2 className="w-4 h-4 text-[#6B7280]" />
        </div>
        <div className="text-xl font-extrabold text-[#111827]">{uniqueCompanies.toLocaleString()}</div>
        <div className="text-[11px] text-[#6B7280] mt-1">Unique entities</div>
      </div>

      {/* 8. Unique Cities */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between text-[#6B7280] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Cities</span>
          <MapPin className="w-4 h-4 text-[#6B7280]" />
        </div>
        <div className="text-xl font-extrabold text-[#111827]">{uniqueCities.toLocaleString()}</div>
        <div className="text-[11px] text-[#6B7280] mt-1">Geographies</div>
      </div>
    </div>
  );
};
