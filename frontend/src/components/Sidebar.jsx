import React from 'react';
import { LayoutDashboard, UploadCloud, History, Table, FileSpreadsheet, X } from 'lucide-react';

export const Sidebar = ({ currentView, onViewChange, activeJob, onSelectJob, isOpen, onClose }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: activeJob ? 'Active' : null },
    { id: 'import', label: 'Import', icon: UploadCloud },
    { id: 'explorer', label: 'Data Explorer', icon: Table, disabled: !activeJob },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleViewChange = (view) => {
    onViewChange(view);
    onClose?.();
  };

  return (
    <>
      {isOpen && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-[#111827]/30 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[calc(100vw-2rem)] bg-white border-r border-[#E5E7EB] flex flex-col justify-between min-h-screen transform transition-transform duration-200 lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5 cursor-pointer min-w-0" onClick={() => handleViewChange('overview')}>
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-base shadow-sm">
              ◈
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#111827] truncate">
                DATA<span className="text-[#2563EB]">FLOW</span>
              </span>
              <span className="text-[10px] text-[#6B7280] font-medium block -mt-1 uppercase tracking-wider">
                Intelligence Workspace
              </span>
            </div>
            <button onClick={onClose} className="ml-auto p-2 text-[#6B7280] lg:hidden" aria-label="Close navigation">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && handleViewChange(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold shadow-xs'
                    : item.disabled
                    ? 'text-[#9CA3AF] cursor-not-allowed opacity-60'
                    : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#2563EB] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Job Card at bottom */}
      <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
        {activeJob ? (
          <div className="p-3 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">Active Import</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16A34A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                Ready
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span className="text-xs font-semibold text-[#111827] truncate" title={activeJob.filename}>
                {activeJob.filename}
              </span>
            </div>
            <div className="text-[11px] text-[#6B7280] flex justify-between">
              <span>{activeJob.total_records?.toLocaleString() || 0} records</span>
              <span className="text-[#16A34A] font-semibold">{activeJob.valid_records?.toLocaleString() || 0} valid</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-dashed border-[#D1D5DB] text-center">
            <span className="text-xs text-[#6B7280] block mb-2">No active dataset selected</span>
            <button
              onClick={() => handleViewChange('import')}
              className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8] transition w-full"
            >
              + Upload CSV
            </button>
          </div>
        )}
      </div>
      </aside>
    </>
  );
};
