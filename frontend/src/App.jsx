import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { LandingPage } from './components/LandingPage';
import { ProcessingScreen } from './components/ProcessingScreen';
import { KpiCards } from './components/KpiCards';
import { GlobalFilterBar } from './components/GlobalFilterBar';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { DataExplorer } from './components/DataExplorer';
import { ImportHistoryView } from './components/ImportHistoryView';
import { getImportHistory, getJobStatus, getJobAnalytics, getJobRecords } from './api/importsApi';
import { Menu } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState('overview'); // 'overview' | 'import' | 'explorer' | 'history'
  const [jobsHistory, setJobsHistory] = useState([]);
  const [activeJobId, setActiveJobId] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Explorer records state
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global filters affecting entire dashboard
  const [filters, setFilters] = useState({
    company: 'all',
    city: 'all',
    status: 'all',
    errorType: 'all',
  });

  // Fetch all jobs history
  const fetchHistory = useCallback(async () => {
    try {
      const history = await getImportHistory();
      setJobsHistory(history);
      return history;
    } catch (err) {
      console.error('Failed to load history:', err);
      return [];
    }
  }, []);

  // Initial load: fetch history and select latest job if none active
  useEffect(() => {
    fetchHistory().then((history) => {
      if (history && history.length > 0 && !activeJobId) {
        setActiveJobId(history[0].id);
      } else if (!history || history.length === 0) {
        setCurrentView('import');
      }
    });
  }, [fetchHistory, activeJobId]);

  // Poll active job status when pending/processing
  useEffect(() => {
    if (!activeJobId) return;

    let interval = null;

    const checkStatus = async () => {
      try {
        const job = await getJobStatus(activeJobId);
        setActiveJob(job);

        if (job.status === 'COMPLETED' || job.status === 'FAILED') {
          if (interval) clearInterval(interval);
        }
      } catch (err) {
        console.error('Failed to poll job status:', err);
      }
    };

    checkStatus();

    interval = setInterval(async () => {
      try {
        const job = await getJobStatus(activeJobId);
        setActiveJob(job);
        if (job.status === 'COMPLETED' || job.status === 'FAILED') {
          clearInterval(interval);
          fetchHistory();
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeJobId, fetchHistory]);

  // Fetch analytics whenever activeJobId or global filters change
  const fetchAnalytics = useCallback(async () => {
    if (!activeJobId) return;
    try {
      setAnalyticsLoading(true);
      const data = await getJobAnalytics(activeJobId, {
        company: filters.company,
        city: filters.city,
        status: filters.status,
      });
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [activeJobId, filters]);

  // Fetch records whenever activeJobId, page, limit, search, or filters change
  const fetchRecords = useCallback(async () => {
    if (!activeJobId) return;
    try {
      setRecordsLoading(true);
      const data = await getJobRecords(activeJobId, {
        page,
        limit,
        search,
        status: filters.status,
        company: filters.company,
        city: filters.city,
        errorType: filters.errorType,
      });
      setRecords(data.items);
      setTotalRecords(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Failed to fetch records:', err);
    } finally {
      setRecordsLoading(false);
    }
  }, [activeJobId, page, limit, search, filters]);

  useEffect(() => {
    if (activeJob && activeJob.status === 'COMPLETED') {
      fetchAnalytics();
      fetchRecords();
    }
  }, [activeJob?.status, fetchAnalytics, fetchRecords]);

  // Upload handler
  const handleUploadSuccess = (newJobId) => {
    setActiveJobId(newJobId);
    setCurrentView('overview');
    fetchHistory();
  };

  // Switch job selection
  const handleSelectJob = (jobId) => {
    setActiveJobId(jobId);
    setFilters({ company: 'all', city: 'all', status: 'all', errorType: 'all' });
    setSearch('');
    setPage(1);
    setCurrentView('overview');
  };

  // Filter change handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ company: 'all', city: 'all', status: 'all', errorType: 'all' });
    setSearch('');
    setPage(1);
  };

  const isProcessing = activeJob && (activeJob.status === 'PENDING' || activeJob.status === 'PROCESSING');

  return (
    <div className="flex min-h-screen bg-[#F7F8FA] text-[#111827]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        activeJob={activeJob}
        onSelectJob={handleSelectJob}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          activeJob={activeJob}
          onMenu={() => setSidebarOpen(true)}
          onNewImport={() => setCurrentView('import')}
          onRefresh={() => {
            fetchAnalytics();
            fetchRecords();
          }}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 max-w-7xl w-full mx-auto">
          {/* VIEW 1: IMPORT / LANDING PAGE */}
          {currentView === 'import' && (
            <LandingPage onUploadSuccess={handleUploadSuccess} />
          )}

          {/* VIEW 2: PROCESSING SCREEN (shown if active job is currently importing) */}
          {currentView !== 'import' && isProcessing && (
            <ProcessingScreen job={activeJob} />
          )}

          {/* VIEW 3: OVERVIEW / POWER BI ANALYTICS WORKSPACE */}
          {currentView === 'overview' && !isProcessing && (
            <div>
              {!activeJob ? (
                <LandingPage onUploadSuccess={handleUploadSuccess} />
              ) : (
                <div>
                  {/* Global Filter Bar */}
                  <GlobalFilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                    availableCompanies={analytics?.available_companies || []}
                    availableCities={analytics?.available_cities || []}
                    availableErrors={analytics?.validation_errors || []}
                    filteredCount={totalRecords}
                    totalCount={activeJob?.total_records || 0}
                  />

                  {/* 8 KPI Cards */}
                  <KpiCards summary={analytics?.summary} />

                  {/* 8 Power BI Analytical Charts */}
                  <AnalyticsCharts analytics={analytics} />

                  {/* Quick Data Explorer Section embedded below charts */}
                  <div className="mt-8">
                    <DataExplorer
                      records={records}
                      loading={recordsLoading}
                      total={totalRecords}
                      page={page}
                      limit={limit}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                      }}
                      search={search}
                      onSearchChange={(val) => {
                        setSearch(val);
                        setPage(1);
                      }}
                      statusFilter={filters.status}
                      onStatusFilterChange={(val) => handleFilterChange('status', val)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: DEDICATED DATA EXPLORER */}
          {currentView === 'explorer' && !isProcessing && (
            <div>
              <GlobalFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                availableCompanies={analytics?.available_companies || []}
                availableCities={analytics?.available_cities || []}
                availableErrors={analytics?.validation_errors || []}
                filteredCount={totalRecords}
                totalCount={activeJob?.total_records || 0}
              />
              <DataExplorer
                records={records}
                loading={recordsLoading}
                total={totalRecords}
                page={page}
                limit={limit}
                totalPages={totalPages}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
                search={search}
                onSearchChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                statusFilter={filters.status}
                onStatusFilterChange={(val) => handleFilterChange('status', val)}
              />
            </div>
          )}

          {/* VIEW 5: IMPORT HISTORY */}
          {currentView === 'history' && (
            <ImportHistoryView
              jobs={jobsHistory}
              onSelectJob={handleSelectJob}
              onRefresh={fetchHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
