import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, ShieldCheck, Zap, BarChart3, Download, Play, AlertCircle, Loader2 } from 'lucide-react';
import { uploadCsv } from '../api/importsApi';

export const LandingPage = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    setErrorMessage(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMessage('Invalid file type. Please select a valid .csv file.');
      return;
    }

    if (file.size === 0) {
      setErrorMessage('The selected file is empty (0 bytes).');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadCsv(file);
      if (onUploadSuccess) {
        onUploadSuccess(result.job_id);
      }
    } catch (err) {
      const serverErr = err.response?.data?.detail || 'Failed to upload CSV file. Check backend server.';
      setErrorMessage(serverErr);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // 1-Click Load Sample Dataset
  const handleLoadSample = async () => {
    try {
      setUploading(true);
      setErrorMessage(null);
      // Create sample file payload
      const sampleText = `name,email,phone,company,city
"John Doe","john.doe@techcorp.com","+1 (555) 234-5678","TechCorp Solutions","San Francisco"
"Jane Smith","jane.smith@innovate.org","555-987-6543","Innovate Labs","New York"
"Robert Johnson","robert@@invalid.com","555-123-4567","Global Industries","Chicago"
"Emily Davis","emily.davis@designhub.io","123","DesignHub","Austin"
"Michael Brown","michael.brown@startup.co","+1-555-345-6789","","Seattle"
"Sarah Wilson","sarah.wilson@marketing.com","+1-555-456-7890","Apex Marketing",""
" David Lee "," DAVID.LEE@TECHCORP.COM "," +1-555-567-8901 ","TechCorp Solutions","Los Angeles"
"","missing.name@enterprise.com","+1-555-678-9012","Enterprise Systems","Boston"
"James Taylor","","+1-555-789-0123","Taylor & Co","Denver"
"Patricia Anderson","patricia.anderson@acme.com","555-890-1234","Acme Inc","Atlanta"
"Thomas Jackson","thomas.jackson@synergy.net","invalid_phone_text","Synergy Networks","Dallas"
"Jennifer White","patricia.anderson@acme.com","+1-555-901-2345","White Enterprises","Phoenix"
"Charles Harris","charles.harris@cloudscale.io","+1-555-012-3456","CloudScale","San Jose"
"Amanda Martin","amanda.martin@databox.com","+1-555-123-9876","DataBox","Miami"
"Christopher Clark","chris.clark@vector.com","+1-555-234-8765","Vector Dynamics","Portland"
"Jessica Lewis","jessica.lewis@omni.com","+1-555-345-7654","Omni Corp","Minneapolis"
"Daniel Robinson","daniel.robinson@nextgen.com","+1-555-456-6543","NextGen Soft","San Diego"
"Laura Walker","laura.walker@vertex.org","+1-555-567-5432","Vertex Group","Philadelphia"
"Matthew Hall","matthew.hall@horizon.com","+1-555-678-4321","Horizon Tech","Salt Lake City"
"Karen Allen","karen.allen@summit.io","555","Summit Analytics","Detroit"
"Anthony Young","anthony.young@pioneer.com","+1-555-890-2109","Pioneer Labs","Charlotte"
"Nancy King","nancy.king@vanguard.net","+1-555-901-1098","Vanguard Net","Nashville"
"Mark Wright","mark.wright@quantum.com","+1-555-012-0987","Quantum Systems","Raleigh"
"Betty Scott","betty.scott@prime.com","+1-555-123-8700","Prime Solutions","Indianapolis"
"Steven Green","steven.green@echo.io","+1-555-234-7600","Echo Media","Columbus"
"Sandra Adams","sandra.adams@apex.com","+1-555-345-6500","Apex Tech","Baltimore"
"Paul Baker","paul.baker@acme.com","+1-555-456-5400","Acme Inc","Tampa"
"Ashley Gonzalez","ashley.g@fusion.com","+1-555-567-4300","Fusion Labs","Pittsburgh"
"Mark Wright","mark.wright@quantum.com","+1-555-012-0987","Quantum Systems","Raleigh"
"Brian Nelson","brian.nelson@nexus.com","+1-555-789-2100","Nexus Digital","Orlando"`;

      const blob = new Blob([sampleText], { type: 'text/csv' });
      const sampleFile = new File([blob], 'sample.csv', { type: 'text/csv' });
      const result = await uploadCsv(sampleFile);
      if (onUploadSuccess) {
        onUploadSuccess(result.job_id);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to trigger sample upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-bold uppercase tracking-wider mb-4">
          <Zap className="w-3.5 h-3.5" /> Data Ingestion & Quality Platform
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-tight">
          Turn messy CSV data into <br />
          <span className="text-[#2563EB]">actionable insights.</span>
        </h1>
        <p className="text-[#6B7280] max-w-xl mx-auto mt-3 text-sm sm:text-base leading-relaxed">
          Upload customer records. Validate every row against extensible rules. Understand your dataset through interactive Power BI–style analytics.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-sm">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-[#2563EB] bg-[#EFF6FF]'
              : 'border-[#D1D5DB] hover:border-[#2563EB] hover:bg-[#F9FAFB]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-2xs">
              {uploading ? (
                <Loader2 className="w-7 h-7 animate-spin text-[#2563EB]" />
              ) : (
                <UploadCloud className="w-7 h-7 text-[#2563EB]" />
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-[#111827]">
                {uploading ? 'Ingesting & Validating Dataset...' : 'Drop your CSV here'}
              </h3>
              <p className="text-xs text-[#6B7280] mt-1">
                or <span className="text-[#2563EB] font-bold hover:underline">browse files</span> from your computer
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F3F4F6] text-[11px] text-[#6B7280] font-mono">
              <FileText className="w-3.5 h-3.5" />
              CSV • Max 50 MB • Columns: name, email, phone, company, city
            </div>
          </div>
        </div>

        {/* 1-Click Sample Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#F3F4F6]">
          <div className="text-xs text-[#6B7280]">
            Want to test immediately? Try our pre-configured evaluation dataset.
          </div>
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold transition disabled:opacity-50 shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            1-Click Load Sample Dataset (sample.csv)
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-4 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] flex items-start gap-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Upload Error</span>
              {errorMessage}
            </div>
          </div>
        )}
      </div>

      {/* Feature Pillars */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#111827]">Automatic Validation</h4>
          <p className="text-[11px] text-[#6B7280] mt-0.5">Email, phone, and required fields</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#111827]">Duplicate Detection</h4>
          <p className="text-[11px] text-[#6B7280] mt-0.5">O(N) in-memory HashSet lookup</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#111827]">Data Quality Analytics</h4>
          <p className="text-[11px] text-[#6B7280] mt-0.5">8 Power BI interactive charts</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] text-center shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mx-auto mb-2">
            <Download className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#111827]">Export Clean Records</h4>
          <p className="text-[11px] text-[#6B7280] mt-0.5">Streaming CSV download</p>
        </div>
      </div>
    </div>
  );
};
