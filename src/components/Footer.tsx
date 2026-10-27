import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#E8ECF4] bg-[#F8FAFC] text-[#64748B] text-xs py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E8ECF4]">
          <div className="space-y-1.5 text-center md:text-left">
            <div 
              onClick={() => onNavigate('/')}
              className="flex items-center justify-center md:justify-start gap-2.5 cursor-pointer group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#4285F4] text-white shadow-sm shadow-[#6C5CE7]/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-[#172033] text-base group-hover:text-[#6C5CE7] transition-colors">
                NextGen AI Guide
              </span>
            </div>
            <p className="text-[#64748B] text-xs max-w-md leading-relaxed">
              Explore powerful AI tools, learn step by step, and discover practical ways to build digital skills and earn online.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#64748B] font-medium">
            <button onClick={() => onNavigate('/')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => onNavigate('/ai-tools')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
              AI Tools
            </button>
            <button onClick={() => onNavigate('/how-to-use')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
              How to Use AI
            </button>
            <button onClick={() => onNavigate('/income-guides')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
              AI Income Guides
            </button>
            <button onClick={() => onNavigate('/tutorials')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
              Tutorials
            </button>
            <button onClick={() => onNavigate('/about')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => onNavigate('/admin')} className="text-[#6C5CE7] hover:text-[#4285F4] transition-colors cursor-pointer font-bold">
              Admin Portal
            </button>
          </nav>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[#64748B] text-[11px]">
          <div>
            © {new Date().getFullYear()} NextGen AI Guide. All trademarks belong to their respective owners.
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified pricing only
            </span>
            <span>·</span>
            <span>Independent & beginner-friendly</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

