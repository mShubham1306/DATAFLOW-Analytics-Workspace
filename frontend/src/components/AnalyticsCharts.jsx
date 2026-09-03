import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Users, Building, MapPin, Copy, Award } from 'lucide-react';

export const AnalyticsCharts = ({ analytics }) => {
  if (!analytics) return null;

  const {
    summary,
    completeness = {},
    validation_errors = [],
    records_by_company = [],
    records_by_city = [],
    duplicate_analysis = {},
  } = analytics;

  const validPct = summary?.quality_score || 0;
  const invalidPct = (100 - validPct).toFixed(1);

  // SVG Donut calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (validPct / 100) * circumference;

  // Max count for scaling bars
  const maxErrorCount = Math.max(...validation_errors.map((e) => e.count), 1);
  const maxCompanyCount = Math.max(...records_by_company.map((c) => c.total), 1);
  const maxCityCount = Math.max(...records_by_city.map((c) => c.total), 1);

  return (
    <div className="space-y-6">
      {/* Row 1: Donut + Validation Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Validation Status Donut */}
        <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Validation Status</h4>
            <span className="text-[11px] text-[#6B7280]">Overall health</span>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-[#FEE2E2]"
                  strokeWidth="11"
                  fill="transparent"
                />
                {/* Valid Foreground Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-[#16A34A] transition-all duration-700 ease-out"
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-[#111827]">{validPct}%</span>
                <span className="text-[10px] font-bold text-[#16A34A] tracking-wider uppercase">Valid Data</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 w-full pt-3 border-t border-[#F3F4F6] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#16A34A]"></span>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">Valid Records</span>
                  <span className="font-bold text-[#111827]">{summary?.valid_records?.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]"></span>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">Invalid Records</span>
                  <span className="font-bold text-[#DC2626]">{summary?.invalid_records?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Validation Issues Breakdown */}
        <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Validation Issues Breakdown</h4>
              <span className="text-[11px] text-[#6B7280]">Distribution by error category</span>
            </div>

            {validation_errors.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#16A34A] font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> No validation issues detected in this dataset.
              </div>
            ) : (
              <div className="space-y-3">
                {validation_errors.map((item) => {
                  const barWidth = Math.max(8, Math.round((item.count / maxErrorCount) * 100));
                  return (
                    <div key={item.type} className="text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-[#374151] truncate max-w-[280px]" title={item.message}>
                          {item.message || item.type}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#6B7280] font-mono">{item.type}</span>
                          <span className="font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full text-[11px]">
                            {item.count}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#DC2626] rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Field Completeness + Duplicate Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 3: Field Completeness */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Field Completeness Profile</h4>
            <span className="text-[11px] text-[#6B7280]">% of non-null values</span>
          </div>

          <div className="space-y-3.5">
            {[
              { field: 'Name', pct: completeness.name || 0 },
              { field: 'Email', pct: completeness.email || 0 },
              { field: 'Phone', pct: completeness.phone || 0 },
              { field: 'Company', pct: completeness.company || 0 },
              { field: 'City', pct: completeness.city || 0 },
            ].map((f) => (
              <div key={f.field} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-[#374151]">{f.field}</span>
                  <span className="font-bold text-[#111827]">{f.pct}%</span>
                </div>
                <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      f.pct >= 98 ? 'bg-[#2563EB]' : f.pct >= 90 ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'
                    }`}
                    style={{ width: `${f.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 6: Duplicate Analysis */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Duplicate Analysis</h4>
            <span className="text-[11px] text-[#6B7280]">O(N) HashSet Detection</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] block">Unique Emails</span>
              <span className="text-lg font-bold text-[#111827]">
                {duplicate_analysis.unique_emails?.toLocaleString() || 0}
              </span>
              <span className="text-[10px] text-[#16A34A] block mt-0.5">
                {duplicate_analysis.unique_percentage}% of records
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#6B7280] block">Duplicate Emails</span>
              <span className="text-lg font-bold text-[#F59E0B]">
                {duplicate_analysis.duplicate_emails?.toLocaleString() || 0}
              </span>
              <span className="text-[10px] text-[#DC2626] block mt-0.5">
                {duplicate_analysis.duplicate_percentage}% collisions
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-[#374151] block mb-2">Repeated Emails in Dataset</span>
            {duplicate_analysis.top_repeated_emails && duplicate_analysis.top_repeated_emails.length > 0 ? (
              <div className="space-y-1.5">
                {duplicate_analysis.top_repeated_emails.map((rep, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#F9FAFB] text-xs"
                  >
                    <span className="font-mono text-[#374151] truncate max-w-[220px]">{rep.email}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-bold text-[10px]">
                      {rep.count} occurrences
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#16A34A] font-medium py-3 text-center bg-[#F9FAFB] rounded-xl">
                No duplicate email collisions detected.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Records by Company + Records by City */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 4: Records by Company */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Top Entities by Company</h4>
            <span className="text-[11px] text-[#6B7280]">Top 10 Organizations</span>
          </div>

          <div className="space-y-2.5">
            {records_by_company.length === 0 ? (
              <p className="text-xs text-[#6B7280] text-center py-6">No company data available</p>
            ) : (
              records_by_company.map((comp) => {
                const barWidth = Math.max(10, Math.round((comp.total / maxCompanyCount) * 100));
                return (
                  <div key={comp.company} className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-[#374151] truncate max-w-[220px]">
                        {comp.company}
                      </span>
                      <span className="font-bold text-[#111827]">{comp.total} records</span>
                    </div>
                    <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chart 7: Record Quality by Company (Stacked Bars) */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Quality Rate by Company</h4>
            <span className="text-[11px] text-[#6B7280]">Valid vs Invalid %</span>
          </div>

          <div className="space-y-3">
            {records_by_company.slice(0, 6).map((comp) => {
              const validRate = comp.validity_rate || 0;
              const invalidRate = (100 - validRate).toFixed(1);
              return (
                <div key={comp.company} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-[#374151] truncate max-w-[220px]">
                      {comp.company}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#16A34A] font-bold">{validRate}% valid</span>
                      <span className="text-[#6B7280] text-[10px]">({comp.total} rec)</span>
                    </div>
                  </div>
                  {/* Stacked Bar: Valid (Green) + Invalid (Red) */}
                  <div className="w-full h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-[#16A34A] transition-all duration-500"
                      style={{ width: `${validRate}%` }}
                      title={`Valid: ${validRate}%`}
                    ></div>
                    <div
                      className="h-full bg-[#DC2626] transition-all duration-500"
                      style={{ width: `${invalidRate}%` }}
                      title={`Invalid: ${invalidRate}%`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Records by City + City Quality Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 5: Records by City */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Records by Geography (City)</h4>
            <span className="text-[11px] text-[#6B7280]">Top Geographic Locations</span>
          </div>

          <div className="space-y-2.5">
            {records_by_city.map((c) => {
              const barWidth = Math.max(10, Math.round((c.total / maxCityCount) * 100));
              return (
                <div key={c.city} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-[#374151]">{c.city}</span>
                    <span className="font-bold text-[#111827]">{c.total} records</span>
                  </div>
                  <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 8: City Quality Ranking */}
        <div className="lg:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">City Quality Leaderboard</h4>
            <span className="text-[11px] text-[#6B7280]">Validity Rate Ranking</span>
          </div>

          <div className="space-y-2">
            {records_by_city.map((c, idx) => (
              <div
                key={c.city}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center font-bold text-[10px] text-[#6B7280]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-[#111827]">{c.city}</span>
                  <span className="text-[#6B7280] text-[11px]">({c.total} records)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold ${
                      c.validity_rate >= 90
                        ? 'text-[#16A34A]'
                        : c.validity_rate >= 70
                        ? 'text-[#F59E0B]'
                        : 'text-[#DC2626]'
                    }`}
                  >
                    {c.validity_rate}%
                  </span>
                  <span className="text-[10px] text-[#6B7280]">valid</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
