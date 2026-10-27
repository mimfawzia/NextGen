import React from 'react';
import { 
  Layers, 
  Sparkles, 
  BookOpen, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  Search, 
  Code, 
  Briefcase, 
  Shield, 
  Clock, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { CategoryItem, TutorialItem, IncomeGuideItem } from '../types';

interface HomeSectionsProps {
  categories: CategoryItem[];
  tutorials: TutorialItem[];
  incomeGuides: IncomeGuideItem[];
  onNavigate: (path: string) => void;
  onSelectCategory: (categoryName: string) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  categories,
  tutorials,
  incomeGuides,
  onNavigate,
  onSelectCategory
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-[#6C5CE7]" />;
      case 'Search': return <Search className="w-5 h-5 text-[#4285F4]" />;
      case 'Code': return <Code className="w-5 h-5 text-[#6C5CE7]" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-[#4285F4]" />;
      case 'Shield': return <Shield className="w-5 h-5 text-[#16A34A]" />;
      default: return <Sparkles className="w-5 h-5 text-[#6C5CE7]" />;
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 py-8">
      {/* 1. Browse AI Tools by Category */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
            Curated Discovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Browse AI Tools by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Find the right assistant for writing, research, coding, or privacy-conscious work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.name);
                onNavigate('/ai-tools');
              }}
              className="group p-6 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs hover:border-[#6C5CE7]/40 hover:shadow-lg hover:shadow-[#6C5CE7]/8 hover:-translate-y-1 transition-all duration-200 cursor-pointer space-y-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] group-hover:bg-[#6C5CE7]/10 transition-colors">
                {getCategoryIcon(cat.iconName)}
              </div>
              <h3 className="text-base font-bold text-[#172033] group-hover:text-[#6C5CE7] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-2">
                {cat.description}
              </p>
              <div className="pt-2 flex items-center text-xs font-bold text-[#6C5CE7] group-hover:translate-x-1 transition-transform">
                <span>Explore Tools</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Learn How to Use AI Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#F8FAFC] border border-[#E8ECF4] p-8 sm:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
                Beginner Fundamentals
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                Learn How to Use AI Effectively
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                You don’t need a computer science degree to get brilliant results. Follow these simple rules to turn vague questions into crisp, professional outcomes.
              </p>
            </div>

            <button
              onClick={() => onNavigate('/how-to-use')}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E8ECF4] hover:border-[#6C5CE7] text-[#172033] hover:text-[#6C5CE7] text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5 shrink-0"
            >
              <span>Read Full Prompt Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-[#E8ECF4] space-y-2 shadow-2xs">
              <div className="font-mono text-xs font-bold text-[#6C5CE7]">01. Role & Identity</div>
              <h3 className="text-sm font-bold text-[#172033]">Tell the AI Who to Be</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Start with &ldquo;Act as a senior book editor&rdquo; or &ldquo;Act as an experienced career coach&rdquo; to instantly calibrate vocabulary and tone.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8ECF4] space-y-2 shadow-2xs">
              <div className="font-mono text-xs font-bold text-[#4285F4]">02. Context & Background</div>
              <h3 className="text-sm font-bold text-[#172033]">Provide Real Details</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Give your background, target audience, and specific goal instead of sending a one-sentence request.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#E8ECF4] space-y-2 shadow-2xs">
              <div className="font-mono text-xs font-bold text-[#16A34A]">03. Strict Format</div>
              <h3 className="text-sm font-bold text-[#172033]">Specify the Exact Layout</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Ask for &ldquo;3 bullet points under 50 words&rdquo;, &ldquo;a markdown table&rdquo;, or &ldquo;a step-by-step numbered checklist&rdquo;.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Income Guides Highlights */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#16A34A]" />
              Digital Skills & Freelancing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              AI Income Guides
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Practical ways to use modern AI tools to deliver genuine value to freelance clients.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/income-guides')}
            className="text-xs font-bold text-[#6C5CE7] hover:text-[#4285F4] transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Income Playbooks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {incomeGuides.slice(0, 3).map((guide) => (
            <div
              key={guide.id}
              onClick={() => onNavigate('/income-guides')}
              className="p-6 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs hover:border-[#6C5CE7]/40 hover:shadow-lg hover:shadow-[#6C5CE7]/8 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {guide.estimatedEarnings}
                  </span>
                  <span className="text-[11px] font-medium text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E8ECF4]">
                    {guide.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#172033] leading-snug">
                  {guide.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                  {guide.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {guide.recommendedTools.map((t) => (
                    <span key={t} className="text-[10px] font-bold text-[#6C5CE7] bg-[#6C5CE7]/8 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E8ECF4] flex items-center justify-between text-xs font-bold text-[#6C5CE7]">
                <span>Read Full Strategy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Latest Tutorials Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              Practical Learning
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              Latest AI Tutorials
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Step-by-step guides tested for accuracy and ease of use.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/tutorials')}
            className="text-xs font-bold text-[#6C5CE7] hover:text-[#4285F4] transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All Tutorials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutorials.slice(0, 3).map((tut) => (
            <div
              key={tut.id}
              onClick={() => onNavigate('/tutorials')}
              className="p-6 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs hover:border-[#6C5CE7]/40 hover:shadow-lg hover:shadow-[#6C5CE7]/8 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span className="font-semibold text-[#6C5CE7]">{tut.toolName}</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    {tut.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#172033] leading-snug">
                  {tut.title}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                  {tut.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E8ECF4] flex items-center justify-between text-xs font-bold text-[#6C5CE7]">
                <span>Start Tutorial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why NextGen AI Guide? */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-[#E8ECF4] p-8 sm:p-12 shadow-sm space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
              Why NextGen AI Guide?
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Built to cut through marketing hype, confusing jargon, and sponsored rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7] mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">Verified Pricing & Limits</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We never guess or invent numbers. If a tool has a free plan, we specify what it covers and where paid tiers begin so there are zero surprises.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4285F4]/10 text-[#4285F4] mx-auto sm:mx-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">Beginner-First Approach</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Every guide features actionable step-by-step instructions and copy-and-paste prompt templates designed for real daily tasks.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto sm:mx-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">Practical Skill Building</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We focus on empowering you with digital leverage for career growth, freelance services, and genuine productivity instead of automated gimmicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] p-8 sm:p-14 text-center text-white shadow-xl shadow-[#6C5CE7]/20 space-y-6 relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Ready to Get Started?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Start Exploring Popular AI Assistants Today
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Read beginner tutorials, test proven prompts, and discover how leading AI tools can boost your writing, research, and freelance income.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
            <button
              onClick={() => onNavigate('/ai-tools')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-[#6C5CE7] hover:bg-slate-50 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Explore All 7 AI Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/tutorials')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold border border-white/30 backdrop-blur-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Read Latest Tutorials</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
