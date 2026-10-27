import React, { useState } from 'react';
import { Sparkles, Menu, X, Search, Shield, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { ToolStorageService } from '../services/toolStorage';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onSearchClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = ToolStorageService.isAdminLoggedIn();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'AI Tools', path: '/ai-tools' },
    { label: 'How to Use AI', path: '/how-to-use' },
    { label: 'AI Income Guides', path: '/income-guides' },
    { label: 'Tutorials', path: '/tutorials' },
    { label: 'VIP Prompts', path: '/prompts', isVip: true },
    { label: 'About', path: '/about' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E8ECF4] shadow-[0_2px_12px_rgba(23,32,51,0.03)] transition-all">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#4285F4] text-white shadow-md shadow-[#6C5CE7]/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#172033] group-hover:text-[#6C5CE7] transition-colors leading-tight">
              NextGen AI Guide
            </span>
            <span className="text-[10px] text-[#64748B] font-semibold tracking-wider uppercase">
              Discover AI · Unlock Potential
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`px-3.5 py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#6C5CE7]/10 text-[#6C5CE7]'
                    : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]'
                }`}
              >
                <span>{link.label}</span>
                {link.isVip && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-0.5 ${
                    isAdmin 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-purple-100 text-[#6C5CE7]'
                  }`}>
                    {isAdmin ? <Sparkles className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                    <span>{isAdmin ? 'VIP' : 'VIP'}</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Search & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Compact search action */}
          <button
            onClick={() => {
              if (currentPath === '/') {
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
                searchInput?.focus();
              } else {
                onNavigate('/');
                setTimeout(() => {
                  const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
                  searchInput?.focus();
                }, 100);
              }
            }}
            className="flex items-center gap-2 h-9 px-3 rounded-lg bg-[#F8FAFC] border border-[#E8ECF4] text-xs font-medium text-[#64748B] hover:text-[#172033] hover:border-[#6C5CE7]/40 transition-colors cursor-pointer"
            title="Search AI Tools, Tutorials, or Guides"
          >
            <Search className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span className="hidden md:inline">Quick Search</span>
          </button>

          {/* Admin link */}
          {isAdmin ? (
            <button
              onClick={() => handleLinkClick('/admin/dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => handleLinkClick('/admin/login')}
              className="text-xs text-[#64748B] hover:text-[#6C5CE7] px-2 py-1 transition-colors cursor-pointer font-medium"
            >
              Admin
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={() => handleLinkClick('/ai-tools')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/20 hover:shadow-lg hover:shadow-[#6C5CE7]/30 transition-all cursor-pointer"
          >
            <span>Explore 7 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => {
              if (currentPath === '/') {
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
                searchInput?.focus();
              } else {
                onNavigate('/');
              }
            }}
            className="p-2 text-[#64748B] hover:text-[#172033]"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-[#6C5CE7]" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#172033] hover:bg-[#F8FAFC] transition-colors cursor-pointer border border-[#E8ECF4]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Functional Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8ECF4] bg-white px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-[#6C5CE7]/10 text-[#6C5CE7]'
                    : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]'
                }`}
              >
                <span>{link.label}</span>
                {link.isVip && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isAdmin 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-purple-100 text-[#6C5CE7]'
                  }`}>
                    {isAdmin ? <Sparkles className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    <span>{isAdmin ? 'Unlocked' : 'VIP'}</span>
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-[#E8ECF4] flex items-center justify-between">
            <button
              onClick={() => handleLinkClick(isAdmin ? '/admin/dashboard' : '/admin/login')}
              className="text-xs text-[#64748B] hover:text-[#6C5CE7] py-2 font-medium"
            >
              {isAdmin ? 'Admin Dashboard (Active)' : 'Admin Login'}
            </button>
            <button
              onClick={() => handleLinkClick('/ai-tools')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/20"
            >
              Explore AI Tools
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
