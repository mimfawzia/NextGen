import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { ToolItem } from '../types';
import { ToolIcon } from './ToolIcons';

interface ToolCardProps {
  tool: ToolItem;
  onLearnMore: (tool: ToolItem) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onLearnMore }) => {
  // Pricing badge styling strictly adhering to the allowed labels
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

  const handleCardClick = () => {
    onLearnMore(tool);
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E8ECF4] shadow-xs hover:shadow-xl hover:shadow-[#6C5CE7]/10 hover:-translate-y-1 hover:border-[#6C5CE7]/40 transition-all duration-250 cursor-pointer overflow-hidden"
    >
      <div className="p-6">
        {/* Top Header: Official Icon & Pricing Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] group-hover:scale-105 group-hover:border-[#6C5CE7]/30 transition-all duration-200 shadow-2xs">
            <ToolIcon type={tool.iconType || tool.slug} className="w-7 h-7" />
          </div>

          {/* Pricing Status Label */}
          <span 
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getPricingBadge(tool.pricingStatus)}`}
          >
            {tool.pricingStatus}
          </span>
        </div>

        {/* Tool Name */}
        <h3 className="text-lg font-bold text-[#172033] group-hover:text-[#6C5CE7] transition-colors leading-snug">
          {tool.name}
        </h3>

        {/* Short, Beginner-Friendly Description */}
        <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed line-clamp-3">
          {tool.shortDescription}
        </p>

        {/* Category tag */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="font-semibold text-[#6C5CE7] bg-[#6C5CE7]/8 px-2 py-0.5 rounded-md text-[11px]">
            {tool.category}
          </span>
        </div>
      </div>

      {/* Card Actions: Learn More & Visit Official Website */}
      <div className="border-t border-[#E8ECF4] bg-[#F8FAFC]/70 px-6 py-3.5 flex items-center justify-between text-xs">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLearnMore(tool);
          }}
          className="inline-flex items-center gap-1.5 font-bold text-[#6C5CE7] group-hover:text-[#4285F4] transition-colors cursor-pointer"
        >
          <span>Learn More</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        <a
          href={tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleExternalClick}
          className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#172033] transition-colors py-1 cursor-pointer font-medium"
          title={`Visit official ${tool.name} website (opens in new tab)`}
        >
          <span>Official Site</span>
          <ExternalLink className="w-3 h-3 text-[#64748B]" />
        </a>
      </div>
    </div>
  );
};
