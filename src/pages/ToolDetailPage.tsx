import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Check, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  DollarSign, 
  BookOpen, 
  Layers, 
  Share2,
  ShieldCheck,
  ChevronRight,
  List
} from 'lucide-react';
import { ToolItem } from '../types';
import { ToolIcon } from '../components/ToolIcons';
import { ToolStorageService } from '../services/toolStorage';

interface ToolDetailPageProps {
  tool: ToolItem;
  onNavigate: (path: string) => void;
  onSelectRelatedTool: (slug: string) => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({
  tool,
  onNavigate,
  onSelectRelatedTool
}) => {
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleCopyPrompt = (promptText: string, index: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const relatedTools = (tool.relatedToolSlugs || [])
    .map(slug => ToolStorageService.getToolBySlug(slug))
    .filter((t): t is ToolItem => t !== undefined && t.id !== tool.id);

  const getPricingBadge = (status: string) => {
    switch (status) {
      case 'Free':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Free Plan Available':
        return 'bg-blue-50 text-[#4285F4] border-blue-200';
      case 'Freemium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Paid':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <article className="min-h-screen bg-white py-8 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('/ai-tools')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#6C5CE7] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All AI Tools</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8ECF4] text-xs font-semibold text-[#64748B] hover:text-[#172033] hover:border-[#6C5CE7]/40 transition-colors cursor-pointer shadow-2xs"
              title="Copy link to this tool guide"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
            </button>

            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/15 transition-all cursor-pointer"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 1. Tool Header Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#F8FAFC] via-white to-[#F8FAFC] border border-[#E8ECF4] p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-white border border-[#E8ECF4] shadow-md shadow-[#172033]/5">
                <ToolIcon type={tool.iconType || tool.slug} className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
                    {tool.name}
                  </h1>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getPricingBadge(tool.pricingStatus)}`}>
                    {tool.pricingStatus}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  Category: <span className="text-[#6C5CE7] font-semibold">{tool.category}</span>
                </p>
              </div>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">Official Domain</span>
              <a 
                href={tool.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#6C5CE7] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                {tool.websiteUrl.replace('https://', '')}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Introduction */}
          <div className="space-y-2 pt-5 border-t border-[#E8ECF4]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6C5CE7]">
              Introduction & Overview
            </h2>
            <p className="text-sm sm:text-base text-[#172033] leading-relaxed">
              {tool.intro}
            </p>
          </div>
        </div>

        {/* 2. What the Tool is Used For */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-3 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-[#172033] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
            What {tool.name} is Used For
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            {tool.whatIsUsedFor}
          </p>
        </section>

        {/* 3. Key Features */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-4 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-[#172033] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tool.keyFeatures.map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs sm:text-sm text-[#172033]"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Free Plan & Usage Limitations */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-[#172033] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4285F4]" />
              Free Plan & Usage Limitations
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Verified Information
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] space-y-3">
            <p className="text-sm font-semibold text-[#172033]">
              {tool.freePlanLimitations.summary}
            </p>
            <ul className="space-y-2 pt-2 border-t border-[#E8ECF4] text-xs sm:text-sm text-[#64748B]">
              {tool.freePlanLimitations.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#6C5CE7] font-bold">·</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {tool.pricingDetails && (
            <p className="text-xs text-[#64748B] italic">
              Note on Paid Tiers: {tool.pricingDetails}
            </p>
          )}
        </section>

        {/* 5. Step-by-Step Instructions for Beginners */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-5 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-[#172033] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Step-by-Step Instructions for Beginners
          </h2>

          <div className="space-y-3.5">
            {tool.beginnerGuide.map((step) => (
              <div 
                key={step.stepNumber}
                className="flex items-start gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#4285F4] text-xs font-bold text-white shadow-xs">
                  {step.stepNumber}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#172033]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Practical Example Prompts */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-4 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-[#172033] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Practical Example Prompts
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Copy these proven starter prompts directly into {tool.name} to see immediate results.
          </p>

          <div className="space-y-4 mt-3">
            {tool.examplePrompts.map((example, idx) => (
              <div 
                key={idx}
                className="rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8ECF4] bg-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#172033]">{example.title}</span>
                    <span className="text-[10px] text-[#64748B] font-semibold">({example.category})</span>
                  </div>
                  <button
                    onClick={() => handleCopyPrompt(example.prompt, idx)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#6C5CE7] hover:text-[#4285F4] bg-[#6C5CE7]/10 hover:bg-[#6C5CE7]/15 px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold"
                  >
                    {copiedPromptIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-5 font-mono text-xs sm:text-sm text-[#172033] whitespace-pre-wrap leading-relaxed bg-[#F8FAFC]">
                  {example.prompt}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Advantages and Limitations */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Key Advantages
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#172033]">
              {tool.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-[#64748B] leading-relaxed">{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Limitations to Keep in Mind
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#172033]">
              {tool.limitations.map((lim, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-amber-500 font-bold">!</span>
                  <span className="text-[#64748B] leading-relaxed">{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. Freelancing & Online Income Guide */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg sm:text-xl font-bold text-[#172033]">
              {tool.incomeAndFreelancing.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            {tool.incomeAndFreelancing.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {tool.incomeAndFreelancing.tactics.map((tactic, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs sm:text-sm text-[#172033]"
              >
                <span className="font-bold text-[#6C5CE7] mr-1.5">0{idx + 1}.</span>
                <span className="font-medium">{tactic}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Related Tools */}
        {relatedTools.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-[#E8ECF4]">
            <h2 className="text-base font-bold text-[#172033] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#64748B]" />
              Related Tools to Explore
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedTools.map((relTool) => (
                <div
                  key={relTool.id}
                  onClick={() => onSelectRelatedTool(relTool.slug)}
                  className="p-5 rounded-2xl bg-white border border-[#E8ECF4] hover:border-[#6C5CE7]/40 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <ToolIcon type={relTool.iconType || relTool.slug} className="w-5 h-5" />
                    <span className="font-bold text-[#172033] group-hover:text-[#6C5CE7] transition-colors text-sm">
                      {relTool.name}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2">
                    {relTool.shortDescription}
                  </p>
                  <span className="mt-3 text-xs font-bold text-[#6C5CE7] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Guide →
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 10. Official Website Launch Card */}
        <div className="rounded-3xl bg-gradient-to-r from-[#F8FAFC] to-[#EEF2FF] border border-[#E8ECF4] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-[#172033]">
              Ready to start using {tool.name}?
            </h3>
            <p className="text-xs text-[#64748B]">
              Open the tool directly on their official domain.
            </p>
          </div>
          <a
            href={tool.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Visit {tool.name} Official Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
};
