import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  UploadCloud, FileText, CheckCircle2, ShieldCheck, Zap, BarChart3, Download, Play,
  AlertCircle, Loader2, ArrowRight, Sparkles, TrendingUp, Users, Database,
  Clock, Star, ChevronDown, ArrowUpRight, Shield,
  Cpu, FileSpreadsheet, Layers, Filter, Globe, Rocket, Award, Menu, X,
  Heart, ThumbsUp, Eye, MessageCircle, Cloud, RefreshCw, GitBranch,
  Target, Lightbulb, MousePointer2
} from 'lucide-react';
import { uploadCsv } from '../api/importsApi';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let startTime = null;
    const startValue = 0;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = startValue + (end - startValue) * easeOutQuart;
      setCount(newValue);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
};

const FloatingBlob = ({ className, color = 'blue' }) => {
  const colors = {
    blue: 'from-blue-400/20 to-indigo-500/20',
    purple: 'from-purple-400/20 to-pink-500/20',
    pink: 'from-pink-400/20 to-rose-500/20',
    amber: 'from-amber-400/20 to-orange-500/20',
    teal: 'from-teal-400/20 to-cyan-500/20',
  };
  return (
    <div className={`absolute rounded-full bg-gradient-to-br ${colors[color]} blur-3xl ${className}`} />
  );
};

const ParticleField = () => {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 6,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.4,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, gradient, delay = 0, tag }) => {
  const gradients = {
    blue: 'from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100',
    purple: 'from-purple-50 to-pink-50 group-hover:from-purple-100 group-hover:to-pink-100',
    teal: 'from-teal-50 to-cyan-50 group-hover:from-teal-100 group-hover:to-cyan-100',
    amber: 'from-amber-50 to-orange-50 group-hover:from-amber-100 group-hover:to-orange-100',
    rose: 'from-rose-50 to-pink-50 group-hover:from-rose-100 group-hover:to-pink-100',
    green: 'from-green-50 to-emerald-50 group-hover:from-green-100 group-hover:to-emerald-100',
  };
  const iconGradients = {
    blue: 'from-blue-500 to-indigo-600 text-white',
    purple: 'from-purple-500 to-pink-600 text-white',
    teal: 'from-teal-500 to-cyan-600 text-white',
    amber: 'from-amber-500 to-orange-600 text-white',
    rose: 'from-rose-500 to-pink-600 text-white',
    green: 'from-green-500 to-emerald-600 text-white',
  };

  return (
    <div
      className={`group relative p-7 rounded-3xl bg-gradient-to-br ${gradients[gradient]} border border-white/60 transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 cursor-pointer overflow-hidden opacity-0-init animate-fade-in-up animate-delay-${delay}`}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/40 blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradients[gradient]} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
            <Icon className="w-7 h-7" strokeWidth={2} />
          </div>
          {tag && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/80 text-gray-600 backdrop-blur-sm">
              {tag}
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2.5 group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-600">
          {description}
        </p>
        <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
          Learn more
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

const StepCard = ({ step, title, description, icon: Icon, isLast = false }) => {
  const colors = [
    { bg: 'bg-blue-500', ring: 'ring-blue-100', light: 'bg-blue-50' },
    { bg: 'bg-purple-500', ring: 'ring-purple-100', light: 'bg-purple-50' },
    { bg: 'bg-pink-500', ring: 'ring-pink-100', light: 'bg-pink-50' },
  ];
  const color = colors[step - 1] || colors[0];

  return (
    <div className="relative flex flex-col items-center text-center opacity-0-init animate-fade-in-up animate-delay-300">
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5">
          <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-transparent" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-300 bg-white" />
        </div>
      )}
      <div className={`relative z-10 w-20 h-20 rounded-full ${color.light} ring-8 ${color.ring} flex items-center justify-center mb-5 animate-bounce-subtle`}>
        <div className={`w-12 h-12 rounded-full ${color.bg} flex items-center justify-center text-white shadow-lg`}>
          <Icon className="w-6 h-6" strokeWidth={2.2} />
        </div>
        <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full ${color.bg} text-white text-xs font-bold flex items-center justify-center shadow-md`}>
          {step}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed max-w-xs">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ name, role, company, quote, rating, avatar, delay }) => {
  return (
    <div className={`relative p-7 rounded-3xl bg-white border border-gray-100 shadow-soft hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 opacity-0-init animate-fade-in-up animate-delay-${delay}`}>
      <div className="absolute top-6 right-6 text-5xl leading-none text-gradient opacity-20 font-serif">"</div>
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed mb-6 relative z-10">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${avatar}`}>
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 text-sm truncate">{name}</div>
          <div className="text-xs text-gray-500 truncate">{role} · {company}</div>
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ value, label, icon: Icon, color }) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    amber: 'text-amber-600 bg-amber-50',
  };
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="font-bold text-gray-900 leading-none">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
};

const LogoCloud = () => {
  const logos = [
    { name: 'TechCorp', icon: Globe },
    { name: 'InnovateLab', icon: Lightbulb },
    { name: 'DataScale', icon: Database },
    { name: 'GlobalNet', icon: Globe },
    { name: 'CloudFirst', icon: Cloud },
    { name: 'SmartFlow', icon: GitBranch },
  ];
  return (
    <div className="w-full py-4 overflow-hidden">
      <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
        {[...logos, ...logos].map((logo, i) => {
          const Icon = logo.icon;
          return (
            <div key={i} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              <Icon className="w-5 h-5" />
              <span className="font-bold text-lg tracking-wide">{logo.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DashboardMockup = () => {
  return (
    <div className="relative mx-auto max-w-5xl opacity-0-init animate-scale-in animate-delay-500">
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-[3rem] blur-3xl" />
      <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-2xl bg-white animate-float-slow">
        <div className="h-9 bg-gray-50 border-b border-gray-200 flex items-center gap-2 px-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="ml-4 flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-500 w-80 max-w-[40%]">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
            <span className="truncate">customer_records_september.csv</span>
          </div>
        </div>
        <div className="flex min-h-[260px]">
          <div className="hidden md:flex w-48 bg-gray-50 border-r border-gray-200 flex-col gap-1 p-3">
            {['Overview', 'Import', 'Explorer', 'History'].map((item, i) => (
              <div key={i} className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${i === 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                {item}
              </div>
            ))}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-600 font-semibold">
                Active Dataset
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 space-y-3 bg-gradient-to-br from-gray-50 to-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: 'Total Records', val: '2,847', color: 'bg-blue-500' },
                { label: 'Valid', val: '2,651', color: 'bg-green-500' },
                { label: 'Errors', val: '182', color: 'bg-red-500' },
                { label: 'Quality', val: '93.1%', color: 'bg-purple-500' },
              ].map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                    <span className="text-[10px] text-gray-500 font-medium">{s.label}</span>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{s.val}</div>
                  <div className="mt-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full ${s.color} animate-shimmer`} style={{ width: `${70 + Math.random() * 30}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="col-span-2 p-3 rounded-xl bg-white border border-gray-100">
                <div className="text-[10px] font-semibold text-gray-500 mb-2">Records Over Time</div>
                <div className="flex items-end gap-1 h-20">
                  {[35, 48, 40, 62, 55, 70, 65, 78, 82, 70, 88, 92, 85, 95, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-purple-400"
                      style={{ height: `${h}%`, animation: `fadeInUp 0.6s ease-out ${i * 30}ms forwards`, opacity: 0 }}
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-gray-100">
                <div className="text-[10px] font-semibold text-gray-500 mb-3">By Status</div>
                <div className="space-y-2">
                  {[
                    { label: 'Valid', val: 93, color: 'bg-green-500' },
                    { label: 'Invalid', val: 6, color: 'bg-red-400' },
                    { label: 'Review', val: 1, color: 'bg-amber-400' },
                  ].map((b, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] font-medium mb-0.5">
                        <span className="text-gray-600">{b.label}</span>
                        <span className="text-gray-900">{b.val}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full ${b.color} rounded-full animate-shimmer`} style={{ width: `${b.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LandingPage = ({ onUploadSuccess, onGoToApp, hasActiveJob = false }) => {
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

  const handleLoadSample = async () => {
    try {
      setUploading(true);
      setErrorMessage(null);
      const sampleText = `name,email,phone,company,city
"John Doe","john.doe@techcorp.com","+1 (555) 234-5678","TechCorp Solutions","San Francisco"
"Jane Smith","jane.smith@innovate.org","555-987-6543","Innovate Labs","New York"
"Robert Johnson","robert@@invalid.com","555-123-4567","Global Industries","Chicago"
"Emily Davis","emily.davis@designhub.io","123","DesignHub","Austin"
"Michael Brown","michael.brown@startup.co","+1-555-345-6789","","Seattle"
"Sarah Wilson","sarah.wilson@marketing.com","+1-555-456-7890","Apex Marketing",""
" David Lee "," DAVID.LEE@TECHCORP.COM "," +1-555-567-8901 ","TechCorp Solutions","Los Angeles"`;
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

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const features = [
    {
      icon: CheckCircle2,
      title: 'Smart Validation',
      description: 'Every row is automatically checked against extensible rules. Emails, phone numbers, and required fields are validated instantly.',
      gradient: 'blue',
      tag: 'Core',
      delay: 100,
    },
    {
      icon: ShieldCheck,
      title: 'Duplicate Detection',
      description: 'Advanced duplicate detection finds exact and near-matches across thousands of records in the blink of an eye.',
      gradient: 'purple',
      tag: 'Essential',
      delay: 200,
    },
    {
      icon: BarChart3,
      title: 'Rich Analytics',
      description: 'Interactive charts and visualizations reveal the story behind your data. Quality metrics at a glance.',
      gradient: 'teal',
      tag: 'Visual',
      delay: 300,
    },
    {
      icon: Download,
      title: 'Clean Export',
      description: 'Download validated, deduplicated records with a single click. Streaming export for large datasets.',
      gradient: 'amber',
      tag: 'Export',
      delay: 100,
    },
    {
      icon: Filter,
      title: 'Deep Filtering',
      description: 'Slice and dice your data by company, city, status, or error type. Find what matters instantly.',
      gradient: 'rose',
      tag: 'Explorer',
      delay: 200,
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process thousands of records in seconds. Built for speed from the ground up.',
      gradient: 'green',
      tag: 'Performance',
      delay: 300,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Head of Operations',
      company: 'TechCorp',
      quote: 'We used to spend days cleaning customer data manually. Now it takes minutes. The quality insights alone saved us thousands of hours.',
      rating: 5,
      avatar: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      delay: 100,
    },
    {
      name: 'Marcus Johnson',
      role: 'Data Director',
      company: 'Innovate Labs',
      quote: 'The analytics dashboard is stunning. It uncovered data quality issues we had no idea existed. Our CRM has never been cleaner.',
      rating: 5,
      avatar: 'bg-gradient-to-br from-purple-500 to-pink-600',
      delay: 300,
    },
    {
      name: 'Elena Rodriguez',
      role: 'VP Marketing',
      company: 'GlobalScale',
      quote: 'Finally, a tool that non-technical people can use. My team uploads CSVs directly and gets clean data. No more back-and-forth with IT.',
      rating: 5,
      avatar: 'bg-gradient-to-br from-pink-500 to-rose-600',
      delay: 500,
    },
  ];

  return (
    <div className="relative w-full">
      <section className="relative min-h-[100vh] overflow-hidden pt-8 pb-20 sm:pt-12 sm:pb-28 bg-hero-gradient animate-gradient">
        <FloatingBlob className="w-[500px] h-[500px] -top-40 -left-40 animate-float" color="blue" />
        <FloatingBlob className="w-[400px] h-[400px] top-20 -right-20 animate-float-delayed" color="purple" />
        <FloatingBlob className="w-[350px] h-[350px] bottom-0 left-1/3 animate-float-slow" color="pink" />
        <ParticleField />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-8 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/60 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm opacity-0-init animate-fade-in-up">
              <Sparkles className="w-3.5 h-3.5" />
              Trusted by 2,000+ data teams worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 opacity-0-init animate-fade-in-up animate-delay-100">
              Turn messy data into
              <br className="hidden sm:block" />
              <span className="text-gradient"> actionable insights</span>
              <span className="inline-block animate-blink text-blue-500 ml-1">_</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed opacity-0-init animate-fade-in-up animate-delay-200">
              Upload customer records, validate every row against smart rules, and understand your dataset through beautiful, interactive analytics.
              <span className="block sm:inline"> No code. No complexity.</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10 opacity-0-init animate-fade-in-up animate-delay-300">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-glow hover:shadow-glow-purple transition-all duration-300 hover:scale-105 animate-pulse-glow"
              >
                <UploadCloud className="w-5 h-5 group-hover:animate-bounce-subtle" />
                {hasActiveJob ? 'Upload New Dataset' : 'Start Uploading Free'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {hasActiveJob ? (
                <button
                  onClick={onGoToApp}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
                >
                  <BarChart3 className="w-5 h-5 group-hover:animate-bounce-subtle" />
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handleLoadSample}
                  disabled={uploading}
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 hover:bg-white text-gray-800 font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current text-purple-500" />
                  Try Sample Dataset
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-12 opacity-0-init animate-fade-in-up animate-delay-400">
              <StatPill value={<><AnimatedCounter end={99.9} suffix="%" decimals={1} /></>} label="Accuracy Rate" icon={Target} color="blue" />
              <StatPill value={<><AnimatedCounter end={50} suffix="MB" /></>} label="Max File Size" icon={Database} color="green" />
              <StatPill value={<><AnimatedCounter end={2} suffix="s" decimals={1} /></>} label="Avg. Processing" icon={Clock} color="purple" />
              <StatPill value={<><AnimatedCounter end={100} suffix="%" /></>} label="Secure" icon={Shield} color="amber" />
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto mb-16 opacity-0-init animate-scale-in animate-delay-500">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative bg-white/80 backdrop-blur-xl border-2 border-dashed rounded-[2rem] p-8 sm:p-14 text-center cursor-pointer transition-all duration-500 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/80 scale-[1.02] shadow-glow'
                  : 'border-gray-200 hover:border-blue-400 hover:bg-white/90 shadow-soft hover:shadow-card-hover'
              } ${uploading ? 'pointer-events-none' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
              />

              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-2xl animate-float" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-pink-400/20 to-amber-400/20 blur-2xl animate-float-delayed" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center space-y-5">
                <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center border border-blue-100 transition-all duration-500 ${dragActive ? 'scale-110' : ''} ${uploading ? 'animate-pulse' : 'animate-bounce-subtle'}`}>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-10 animate-pulse" />
                  {uploading ? (
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  ) : (
                    <UploadCloud className="w-10 h-10 text-blue-600" strokeWidth={1.8} />
                  )}
                  {dragActive && !uploading && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg animate-bounce-subtle">
                      <MousePointer2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1.5">
                    {uploading ? 'Processing your dataset...' : dragActive ? 'Drop it like it\'s hot!' : 'Drop your CSV file here'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    or{' '}
                    <span className="text-blue-600 font-bold hover:underline decoration-blue-300 underline-offset-2">
                      browse files
                    </span>{' '}
                    from your computer
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] text-gray-600 font-mono">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    .csv format
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] text-gray-600 font-mono">
                    <Database className="w-3.5 h-3.5 text-green-500" />
                    Up to 50 MB
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[11px] text-gray-600 font-mono">
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                    name · email · phone · company · city
                  </div>
                </div>

                {!uploading && (
                  <div className="w-full max-w-md h-1 rounded-full bg-gray-100 overflow-hidden mt-2">
                    <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out rounded-full" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 opacity-0-init animate-fade-in-up animate-delay-600">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                No account required · Free to try · Instant results
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-100 text-purple-700 text-xs font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                1-Click: Load Sample Dataset
              </button>
            </div>

            {errorMessage && (
              <div className="mt-5 p-5 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 flex items-start gap-3 animate-shake shadow-sm opacity-0-init animate-fade-in-up">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-sm mb-0.5">Upload Error</span>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              </div>
            )}
          </div>

          <DashboardMockup />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-6 flex flex-col items-center gap-2 text-gray-400 opacity-0-init animate-fade-in animate-delay-700 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => scrollToSection('features')}>
          <span className="text-xs font-semibold tracking-wide uppercase">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce-subtle" />
        </div>
      </section>

      <section className="py-8 bg-white/60 backdrop-blur-sm border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Trusted by teams at leading companies
          </div>
          <LogoCloud />
        </div>
      </section>

      <section id="features" className="relative py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <FloatingBlob className="w-[300px] h-[300px] top-20 right-0 animate-float-slow" color="amber" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-bold uppercase tracking-wider mb-5">
              <Layers className="w-3.5 h-3.5" />
              Everything you need
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-5">
              Powerful features,{' '}
              <span className="text-gradient">simple to use</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Every detail is crafted to help you get more from your data. From validation to visualization, everything works together seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <FloatingBlob className="w-[400px] h-[400px] -bottom-40 -left-20 animate-float-delayed" color="teal" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-bold uppercase tracking-wider mb-5">
              <Rocket className="w-3.5 h-3.5" />
              Getting started
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-5">
              From messy to{' '}
              <span className="text-gradient">magnificent in 3 steps</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              No complex setup. No steep learning curve. Just three simple steps to cleaner, smarter data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8">
            <StepCard
              step={1}
              icon={Cloud}
              title="Upload Your File"
              description="Drag and drop any CSV file, or browse to select it. We support files up to 50MB with instant preview."
            />
            <StepCard
              step={2}
              icon={Cpu}
              title="Watch It Validate"
              description="Our engine checks every record for formatting errors, duplicates, missing values, and more."
            />
            <StepCard
              step={3}
              icon={ArrowUpRight}
              title="Explore & Export"
              description="Dive into interactive analytics, apply filters, and download perfectly clean records."
              isLast={true}
            />
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <FloatingBlob className="w-[500px] h-[500px] -top-20 -right-20 opacity-40 animate-float" color="purple" />
        <FloatingBlob className="w-[400px] h-[400px] -bottom-20 -left-20 opacity-30 animate-float-delayed" color="blue" />
        <ParticleField />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/15 text-blue-300 text-xs font-bold uppercase tracking-wider mb-5">
              <TrendingUp className="w-3.5 h-3.5" />
              The numbers speak
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
              Data teams achieve{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                incredible results
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              Join thousands of companies transforming how they handle customer data.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {[
              { icon: Users, label: 'Active Users', value: 25000, suffix: '+', prefix: '', color: 'from-blue-500 to-cyan-500' },
              { icon: Database, label: 'Records Processed', value: 750, suffix: 'M+', prefix: '', color: 'from-purple-500 to-pink-500' },
              { icon: ThumbsUp, label: 'Customer Rating', value: 4.9, suffix: '/5', prefix: '', decimals: 1, color: 'from-amber-500 to-orange-500' },
              { icon: Award, label: 'Data Saved', value: 98, suffix: '%', prefix: '', color: 'from-green-500 to-emerald-500' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="group relative p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:-translate-y-1 opacity-0-init animate-fade-in-up animate-delay-${i * 100 + 100}"
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
                      <AnimatedCounter
                        end={stat.value}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                        decimals={stat.decimals || 0}
                      />
                    </div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-xs font-bold uppercase tracking-wider mb-5">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Loved by teams
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-5">
              Don't take our word for it
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Here's what real data professionals have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <FloatingBlob className="w-[400px] h-[400px] top-0 right-0 opacity-30 animate-float" color="purple" />
        <FloatingBlob className="w-[350px] h-[350px] bottom-0 left-0 opacity-30 animate-float-delayed" color="pink" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Ready to get started?
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            Your cleanest data
            <br />
            is just a click away
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join 25,000+ professionals already using DATAFLOW to save hours every week. No credit card. No signup. Start uploading in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-900 font-black text-base shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
            >
              <UploadCloud className="w-5 h-5 text-blue-600 group-hover:animate-bounce-subtle" />
              {hasActiveJob ? 'Upload Another CSV' : 'Upload Your First CSV'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {hasActiveJob ? (
              <button
                onClick={onGoToApp}
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/25 hover:bg-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105"
              >
                <BarChart3 className="w-5 h-5 group-hover:animate-bounce-subtle" />
                Open Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleLoadSample}
                disabled={uploading}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/25 hover:bg-white/20 text-white font-bold text-base transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                Try With Sample Data
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              Free forever for small files
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              No signup required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-lg">
                  ◈
                </div>
                <div>
                  <span className="font-black text-lg tracking-tight text-white">
                    DATA<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FLOW</span>
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-5 max-w-sm">
                The easiest way to validate, clean, and understand your CSV customer data. Built for teams who care about quality.
              </p>
              <div className="flex items-center gap-3">
                {[Eye, MessageCircle, Heart, RefreshCw].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'API', 'Integrations', 'Changelog'],
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
              },
              {
                title: 'Resources',
                links: ['Documentation', 'Help Center', 'Community', 'Templates', 'Status'],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold text-white text-sm mb-4 tracking-wide">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm hover:text-white transition-colors inline-flex items-center gap-1 group">
                        {link}
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              © 2026 DATAFLOW Intelligence Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-5 text-xs">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
