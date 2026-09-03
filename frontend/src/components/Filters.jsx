import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export const Filters = ({ search, onSearchChange, statusFilter, onStatusFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 my-4">
      {/* Search Box */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search records by name, email, company, city..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter Segmented Controls */}
      <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700 text-sm">
        <button
          onClick={() => onStatusFilterChange('all')}
          className={`px-4 py-1.5 rounded-lg font-medium transition ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Records
        </button>
        <button
          onClick={() => onStatusFilterChange('valid')}
          className={`px-4 py-1.5 rounded-lg font-medium transition ${
            statusFilter === 'valid'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Valid Only
        </button>
        <button
          onClick={() => onStatusFilterChange('invalid')}
          className={`px-4 py-1.5 rounded-lg font-medium transition ${
            statusFilter === 'invalid'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Invalid Only
        </button>
      </div>
    </div>
  );
};
