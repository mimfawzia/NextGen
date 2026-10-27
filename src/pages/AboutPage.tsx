import React from 'react';
import { Sparkles, ShieldCheck, Heart, ArrowRight, Eye, Users } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-3.5 py-1 text-xs text-rose-700 font-bold">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#172033] tracking-tight">
            About NextGen AI Guide
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Making the world of artificial intelligence simple, approachable, and actionable for everyone.
          </p>
        </div>

        {/* Narrative Section */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-10 space-y-4 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
            Why We Built NextGen AI Guide
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            The AI landscape moves at breakneck speed. Every single week, dozens of new tools, jargon-heavy benchmarks, and overhyped promises flood social media. For students, freelancers, career switchers, and small business owners, this noise can feel overwhelming and intimidating.
          </p>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            NextGen AI Guide was created to do the opposite: to strip away the clutter, avoid technical gatekeeping, and provide clear, honest, step-by-step guidance on the tools that actually matter.
          </p>
        </section>

        {/* Core Editorial Values */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
            Our Editorial Commitments
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-[#E8ECF4] space-y-2 shadow-2xs">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <h3 className="text-base font-bold text-[#172033]">Verified Pricing Only</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We never guess or invent numbers. If a tool offers a genuine free tier, we explain exactly what is included and what limitations to expect.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-[#E8ECF4] space-y-2 shadow-2xs">
              <Eye className="w-6 h-6 text-[#4285F4]" />
              <h3 className="text-base font-bold text-[#172033]">Beginner-First Perspective</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                No complex math or developer jargon. We explain what each tool is for, how to get started in 4 simple steps, and provide prompts you can copy immediately.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-[#E8ECF4] space-y-2 shadow-2xs">
              <Users className="w-6 h-6 text-[#6C5CE7]" />
              <h3 className="text-base font-bold text-[#172033]">Pragmatic Digital Skills</h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We believe AI is a skill multiplier. Our income guides focus on real, ethical service delivery for clients rather than automated &ldquo;passive income&rdquo; myths.
              </p>
            </div>
          </div>
        </section>

        {/* Independent statement & link */}
        <section className="rounded-3xl bg-gradient-to-br from-[#F8FAFC] via-white to-[#F8FAFC] border border-[#E8ECF4] p-6 sm:p-8 space-y-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-[#172033]">
              Constantly Maintained & Updated
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-lg leading-relaxed">
              Our guides are independently maintained and updated to reflect changes in model capabilities, interface updates, and pricing policies.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/ai-tools')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer inline-flex items-center gap-2 shrink-0"
          >
            <span>Explore Featured Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </div>
    </div>
  );
};
