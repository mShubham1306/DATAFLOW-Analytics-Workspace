import React from 'react';
import { Filter, X, Building2, MapPin, AlertTriangle } from 'lucide-react';

export const GlobalFilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableCompanies = [],
  availableCities = [],
  availableErrors = [],
  filteredCount,
  totalCount,
}) => {
  const hasActiveFilters =
    filters.company !== 'all' ||
    filters.city !== 'all' ||
    filters.status !== 'all' ||
    filters.errorType !== 'all';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Title & Active Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#111827] uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Interactive Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#2563EB] text-[10px] font-bold normal-case">
              Active Filters
            </span>
          )}
        </div>

        {/* Filter Select Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Company Filter */}
          <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 text-xs text-[#374151]">
            <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={filters.company}
              onChange={(e) => onFilterChange('company', e.target.value)}
              className="bg-transparent border-none text-xs text-[#111827] font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">All Companies</option>
              {availableCompanies.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 text-xs text-[#374151]">
            <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={filters.city}
              onChange={(e) => onFilterChange('city', e.target.value)}
              className="bg-transparent border-none text-xs text-[#111827] font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="all">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 text-xs text-[#374151]">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="bg-transparent border-none text-xs text-[#111827] font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid Only</option>
              <option value="invalid">Invalid Only</option>
            </select>
          </div>

          {/* Error Type Filter */}
          {availableErrors.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 text-xs text-[#374151]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
              <select
                value={filters.errorType}
                onChange={(e) => onFilterChange('errorType', e.target.value)}
                className="bg-transparent border-none text-xs text-[#111827] font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="all">All Issues</option>
                {availableErrors.map((err) => (
                  <option key={err.type} value={err.type}>
                    {err.type} ({err.count})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#DC2626] text-xs font-semibold transition"
            >
              <X className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
