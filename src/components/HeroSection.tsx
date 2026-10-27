import React from 'react';
import { Search, X, Sparkles, ArrowRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { SiteSettings } from '../types';
import { CoverPhotoBanner } from './CoverPhotoBanner';

interface HeroSectionProps {
  settings: SiteSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClearSearch: () => void;
  onExploreTools: () => void;
  onExploreIncomeGuides: () => void;
  onTagClick?: (tag: string) => void;
  onUpdateSettings?: (settings: SiteSettings) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  searchQuery,
  setSearchQuery,
  onClearSearch,
  onExploreTools,
  onExploreIncomeGuides,
  onTagClick,
  onUpdateSettings
}) => {
  const quickTags = [
    'Writing & Chat',
    'Research & Citations',
    'Code & Artifacts',
    'Private AI',
    'Image Creation'
  ];

  return (
    <div className="w-full flex flex-col">
      {/* 1. Colorful and Adjustable Cover Photo Banner */}
      <CoverPhotoBanner 
        settings={settings} 
        onUpdateSettings={onUpdateSettings} 
      />

      <section className="relative overflow-hidden bg-white pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-[#E8ECF4]">
      {/* Subtle Purple-Blue Ambient Background Glow */}
      <div 
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full opacity-60 blur-[100px]"
        style={{ 
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.12) 0%, rgba(66, 133, 244, 0.08) 50%, transparent 80%)' 
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines, Search Bar & Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Kicker */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 px-3.5 py-1 text-xs text-[#6C5CE7] font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>{settings.siteName}</span>
              <span className="text-[#64748B]">·</span>
              <span className="text-[#172033] font-medium">Beginner-Friendly Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172033] leading-[1.14]">
              Discover AI. <br className="hidden sm:inline" />
              <span className="gradient-text-purple-blue">
                Unlock Your Potential.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base sm:text-lg text-[#64748B] font-normal leading-relaxed">
              {settings.heroSubtitle}
            </p>

            {/* Large Rounded Search Bar */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center h-14 sm:h-16 w-full rounded-2xl bg-white border-2 border-[#E8ECF4] shadow-lg shadow-[#172033]/5 focus-within:border-[#6C5CE7] focus-within:ring-4 focus-within:ring-[#6C5CE7]/10 transition-all">
                <div className="flex items-center justify-center pl-4 sm:pl-5 text-[#6C5CE7]">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={settings.searchPlaceholder}
                  className="w-full bg-transparent px-3 sm:px-4 text-sm sm:text-base text-[#172033] placeholder-[#64748B] focus:outline-none font-medium"
                />

                {searchQuery && (
                  <button
                    onClick={onClearSearch}
                    className="p-2 text-[#64748B] hover:text-[#172033] transition-colors mr-2 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Quick Suggestion Pills */}
              <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs">
                <span className="text-[#64748B] font-medium mr-1">Popular:</span>
                {quickTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick && onTagClick(tag)}
                    className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E8ECF4] text-[#64748B] hover:text-[#6C5CE7] hover:border-[#6C5CE7]/30 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                onClick={onExploreTools}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-[#6C5CE7]/25 hover:shadow-xl hover:shadow-[#6C5CE7]/35 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Explore AI Tools</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreIncomeGuides}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[#E8ECF4] hover:border-[#6C5CE7] text-[#172033] hover:text-[#6C5CE7] text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Explore Income Guides</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tasteful Modern AI Graphic on White Desktop */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9] border border-[#E8ECF4] shadow-xl shadow-[#6C5CE7]/5">
              {/* Graphic Header Ribbon */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8ECF4]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#172033] block">NextGen Intelligence</span>
                    <span className="text-[10px] text-[#64748B]">Practical Digital Leverage</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  7 Featured
                </span>
              </div>

              {/* Central Abstract AI Node Illustration */}
              <div className="py-6 flex items-center justify-center">
                <svg viewBox="0 0 280 180" className="w-full h-auto" fill="none">
                  {/* Subtle background neural grid */}
                  <circle cx="140" cy="90" r="70" stroke="#6C5CE7" strokeOpacity="0.1" strokeWidth="1.5" strokeDasharray="4 4" />
                  <circle cx="140" cy="90" r="45" stroke="#4285F4" strokeOpacity="0.15" strokeWidth="1.5" />
                  
                  {/* Glowing interconnecting arcs */}
                  <path d="M50 50 Q 140 20 230 50" stroke="url(#arcGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
                  <path d="M50 130 Q 140 160 230 130" stroke="url(#arcGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
                  <path d="M140 30 V 150" stroke="#6C5CE7" strokeOpacity="0.2" strokeWidth="1.5" />
                  <path d="M40 90 H 240" stroke="#4285F4" strokeOpacity="0.2" strokeWidth="1.5" />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6C5CE7" />
                      <stop offset="100%" stopColor="#4285F4" />
                    </linearGradient>
                    <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6C5CE7" />
                      <stop offset="50%" stopColor="#8075F0" />
                      <stop offset="100%" stopColor="#4285F4" />
                    </linearGradient>
                  </defs>

                  {/* Node 1: Writing (Top Left) */}
                  <g className="cursor-pointer">
                    <circle cx="60" cy="50" r="18" fill="white" stroke="#6C5CE7" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(108,92,231,0.15))" />
                    <text x="60" y="54" textAnchor="middle" fill="#6C5CE7" fontSize="11" fontWeight="bold">AI</text>
                  </g>

                  {/* Node 2: Research (Top Right) */}
                  <g className="cursor-pointer">
                    <circle cx="220" cy="50" r="18" fill="white" stroke="#4285F4" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(66,133,244,0.15))" />
                    <text x="220" y="54" textAnchor="middle" fill="#4285F4" fontSize="11" fontWeight="bold">WEB</text>
                  </g>

                  {/* Node 3: Core Assistant (Center) */}
                  <g>
                    <circle cx="140" cy="90" r="26" fill="url(#coreGrad)" filter="drop-shadow(0 8px 16px rgba(108,92,231,0.35))" />
                    <circle cx="140" cy="90" r="22" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                    <path d="M134 85 L146 85 M140 79 L140 101 M134 95 L146 95" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Node 4: Code & Logic (Bottom Left) */}
                  <g>
                    <circle cx="60" cy="130" r="18" fill="white" stroke="#6C5CE7" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(108,92,231,0.15))" />
                    <text x="60" y="134" textAnchor="middle" fill="#6C5CE7" fontSize="10" fontWeight="bold">&lt;/&gt;</text>
                  </g>

                  {/* Node 5: Earnings (Bottom Right) */}
                  <g>
                    <circle cx="220" cy="130" r="18" fill="white" stroke="#16A34A" strokeWidth="2" filter="drop-shadow(0 4px 6px rgba(22,163,74,0.15))" />
                    <text x="220" y="134" textAnchor="middle" fill="#16A34A" fontSize="12" fontWeight="bold">$</text>
                  </g>
                </svg>
              </div>

              {/* Graphic Feature Badges */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E8ECF4]">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8ECF4] shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-semibold text-[#172033]">Verified Pricing</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#E8ECF4] shadow-2xs">
                  <BookOpen className="w-4 h-4 text-[#6C5CE7] shrink-0" />
                  <span className="text-[11px] font-semibold text-[#172033]">Step-by-Step Guides</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};
