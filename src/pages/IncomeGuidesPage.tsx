import React from 'react';
import { DollarSign, Sparkles, Check, ArrowRight, ShieldAlert, Briefcase, TrendingUp } from 'lucide-react';
import { IncomeGuideItem } from '../types';

interface IncomeGuidesPageProps {
  guides: IncomeGuideItem[];
  onNavigate: (path: string) => void;
}

export const IncomeGuidesPage: React.FC<IncomeGuidesPageProps> = ({ guides, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs text-emerald-700 font-bold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Digital Skills & Income Playbooks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#172033] tracking-tight">
            How to Build Freelance Income with AI
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            AI is not an automated &ldquo;get rich quick&rdquo; button. Instead, it is an extraordinary productivity multiplier that helps skilled, disciplined individuals deliver real value to paying clients 3x faster.
          </p>
        </div>

        {/* Honest Foundation Callout */}
        <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-[#E8ECF4] flex items-start gap-4 shadow-2xs">
          <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <span className="font-bold text-[#172033] block text-sm">The Golden Rule of AI Freelancing:</span>
            <p className="text-[#64748B] leading-relaxed">
              Clients do not pay for raw, unedited AI output—they pay for finished, verified, tailored solutions. Your value as a freelancer lies in understanding your client&rsquo;s problem, steering the AI with thoughtful context, and thoroughly reviewing the final deliverable.
            </p>
          </div>
        </div>

        {/* Practical Service Blueprints */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#172033] flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#6C5CE7]" />
            Practical Service Blueprints
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {guides.map((guide, idx) => (
              <div 
                key={guide.id}
                className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-4 shadow-xs hover:border-[#6C5CE7]/40 hover:shadow-lg hover:shadow-[#6C5CE7]/6 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8ECF4] pb-4">
                  <div>
                    <span className="text-xs font-mono text-[#6C5CE7] font-bold uppercase tracking-wider">
                      Skill Blueprint 0{idx + 1} · {guide.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#172033] mt-0.5">
                      {guide.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {guide.estimatedEarnings}
                    </span>
                    <span className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E8ECF4] px-3 py-1 rounded-full font-medium">
                      {guide.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {guide.summary}
                </p>

                {/* Recommended tools */}
                <div className="flex items-center gap-2 text-xs text-[#64748B] pt-1">
                  <span className="font-semibold text-[#172033]">Recommended Tools:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {guide.recommendedTools.map((toolName) => (
                      <span key={toolName} className="font-semibold bg-[#6C5CE7]/8 text-[#6C5CE7] px-2.5 py-0.5 rounded-md text-[11px]">
                        {toolName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Execution steps */}
                <div className="pt-3 space-y-2.5">
                  <span className="text-xs font-bold text-[#172033] uppercase tracking-wider block">
                    Execution Steps:
                  </span>
                  <div className="space-y-2">
                    {guide.executionSteps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#172033]">
                        <span className="text-[#6C5CE7] font-bold shrink-0">→</span>
                        <span className="text-[#64748B]">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] p-8 sm:p-10 text-center text-white space-y-4 shadow-xl shadow-[#6C5CE7]/20">
          <h2 className="text-xl sm:text-2xl font-bold">
            Ready to test these tools for yourself?
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto">
            Explore step-by-step guides and example prompts for the 7 featured tools.
          </p>
          <button
            onClick={() => onNavigate('/ai-tools')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#6C5CE7] hover:bg-slate-50 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
          >
            <span>View All AI Tool Guides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
