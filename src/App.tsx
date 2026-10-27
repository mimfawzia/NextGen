/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ToolCard } from './components/ToolCard';
import { HomeSections } from './components/HomeSections';
import { Footer } from './components/Footer';

// Pages
import { ToolDetailPage } from './pages/ToolDetailPage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { HowToUsePage } from './pages/HowToUsePage';
import { IncomeGuidesPage } from './pages/IncomeGuidesPage';
import { TutorialsPage } from './pages/TutorialsPage';
import { AboutPage } from './pages/AboutPage';
import { PromptsVault } from './pages/PromptsVault';
import { AdminDashboard } from './pages/AdminDashboard';

// Data & Services
import { ToolStorageService, subscribeToToolStorage } from './services/toolStorage';
import { ToolItem, SiteSettings, CategoryItem, TutorialItem, IncomeGuideItem } from './types';
import { Sparkles, ArrowRight, Search } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [tools, setTools] = useState<ToolItem[]>(() => ToolStorageService.getTools(false));
  const [categories, setCategories] = useState<CategoryItem[]>(() => ToolStorageService.getCategories());
  const [tutorials, setTutorials] = useState<TutorialItem[]>(() => ToolStorageService.getTutorials(false));
  const [incomeGuides, setIncomeGuides] = useState<IncomeGuideItem[]>(() => ToolStorageService.getIncomeGuides(false));
  const [settings, setSettings] = useState<SiteSettings>(() => ToolStorageService.getSettings());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshAllData = () => {
    setTools(ToolStorageService.getTools(false));
    setCategories(ToolStorageService.getCategories());
    setTutorials(ToolStorageService.getTutorials(false));
    setIncomeGuides(ToolStorageService.getIncomeGuides(false));
    setSettings(ToolStorageService.getSettings());
  };

  // Synchronize with database changes and backend server
  useEffect(() => {
    ToolStorageService.syncWithServer();
    const unsubscribe = subscribeToToolStorage(refreshAllData);
    return () => unsubscribe();
  }, []);

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current route is a tool detail page: /ai-tools/:slug
  const activeToolSlug = useMemo(() => {
    const match = currentPath.match(/^\/ai-tools\/([a-z0-9-]+)$/i);
    return match ? match[1].toLowerCase() : null;
  }, [currentPath]);

  const activeTool = useMemo(() => {
    if (!activeToolSlug) return null;
    return ToolStorageService.getToolBySlug(activeToolSlug);
  }, [activeToolSlug]);

  // Featured 7 tools for homepage (or filtered if search query is active)
  const featuredTools = useMemo(() => {
    const list = ToolStorageService.getFeaturedTools();
    if (!searchQuery.trim()) {
      return list;
    }
    const q = searchQuery.toLowerCase().trim();
    return tools.filter(tool => {
      if (!tool.isPublished) return false;
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.shortDescription.toLowerCase().includes(q);
      const matchCategory = tool.category.toLowerCase().includes(q);
      const matchTags = (tool.tags || []).some(t => t.toLowerCase().includes(q));
      const matchPurpose = (tool.whatIsUsedFor || '').toLowerCase().includes(q);
      return matchName || matchDesc || matchCategory || matchTags || matchPurpose;
    });
  }, [tools, searchQuery]);

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white text-[#172033] flex flex-col font-sans selection:bg-[#6C5CE7]/20 selection:text-[#6C5CE7]">
      {/* Navbar (hidden in admin full-page views if needed, but keeping consistent or rendering Navbar) */}
      {!isAdminRoute && (
        <Navbar 
          currentPath={currentPath}
          onNavigate={navigateTo}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ROUTE 1: TOOL DETAIL PAGE (/ai-tools/:slug) */}
        {activeToolSlug && (
          activeTool ? (
            <ToolDetailPage
              tool={activeTool}
              onNavigate={navigateTo}
              onSelectRelatedTool={(slug) => navigateTo(`/ai-tools/${slug}`)}
            />
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <h2 className="text-2xl font-bold text-[#172033]">Tool Not Found</h2>
              <p className="text-sm text-[#64748B] max-w-sm">
                The requested tool &ldquo;{activeToolSlug}&rdquo; could not be found in our verified directory.
              </p>
              <button
                onClick={() => navigateTo('/ai-tools')}
                className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
              >
                Back to AI Tools
              </button>
            </div>
          )
        )}

        {/* ROUTE 2: AI TOOLS DIRECTORY (/ai-tools) */}
        {!activeToolSlug && currentPath === '/ai-tools' && (
          <ToolsDirectoryPage
            tools={tools}
            onLearnMore={(tool) => navigateTo(`/ai-tools/${tool.slug}`)}
            initialSearch={searchQuery}
          />
        )}

        {/* ROUTE 3: HOW TO USE AI (/how-to-use) */}
        {!activeToolSlug && currentPath === '/how-to-use' && (
          <HowToUsePage onNavigate={navigateTo} />
        )}

        {/* ROUTE 4: INCOME GUIDES (/income-guides) */}
        {!activeToolSlug && currentPath === '/income-guides' && (
          <IncomeGuidesPage 
            guides={incomeGuides} 
            onNavigate={navigateTo} 
          />
        )}

        {/* ROUTE 5: TUTORIALS (/tutorials) */}
        {!activeToolSlug && currentPath === '/tutorials' && (
          <TutorialsPage 
            tutorials={tutorials} 
            onNavigate={navigateTo} 
          />
        )}

        {/* ROUTE 6: ABOUT PAGE (/about) */}
        {!activeToolSlug && currentPath === '/about' && (
          <AboutPage onNavigate={navigateTo} />
        )}

        {/* ROUTE 7: VIP EXCLUSIVE PROMPTS VAULT (/prompts) */}
        {!activeToolSlug && currentPath === '/prompts' && (
          <PromptsVault onNavigate={navigateTo} />
        )}

        {/* ROUTE 8: ADMIN DASHBOARD & SUBROUTES (/admin, /admin/dashboard, /admin/tools, etc.) */}
        {isAdminRoute && (
          <AdminDashboard 
            currentAdminRoute={currentPath}
            onNavigateAdmin={(route) => navigateTo(route)}
            onPublicNavigate={(path) => navigateTo(path)}
            onDataChanged={refreshAllData}
          />
        )}

        {/* ROUTE 8: CLEAN WHITE HOMEPAGE (/) */}
        {!activeToolSlug && !isAdminRoute && (currentPath === '/' || currentPath === '') && (
          <div className="space-y-16 sm:space-y-24 pb-20">
            {/* Hero Section */}
            <HeroSection
              settings={settings}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onClearSearch={() => setSearchQuery('')}
              onExploreTools={() => navigateTo('/ai-tools')}
              onExploreIncomeGuides={() => navigateTo('/income-guides')}
              onTagClick={(tag) => {
                setSearchQuery(tag);
                const el = document.getElementById('featured-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onUpdateSettings={(newSettings) => setSettings(newSettings)}
            />

            {/* Featured Tools Section */}
            <section id="featured-section" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8ECF4] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#172033] tracking-tight">
                      {searchQuery ? `Search Results (${featuredTools.length})` : settings.featuredSectionTitle}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-[#64748B]">
                    {searchQuery ? `Matching tools for "${searchQuery}"` : settings.featuredSectionSubtitle}
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('/ai-tools')}
                  className="text-xs font-bold text-[#6C5CE7] hover:text-[#4285F4] transition-colors inline-flex items-center gap-1.5 cursor-pointer group"
                >
                  <span>Explore All AI Tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Responsive Grid: 3 columns Desktop, 2 columns Tablet, 1-2 Mobile */}
              {featuredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onLearnMore={(t) => navigateTo(`/ai-tools/${t.slug}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center rounded-3xl bg-[#F8FAFC] border border-[#E8ECF4] p-8 space-y-3">
                  <Search className="w-10 h-10 mx-auto text-[#64748B]/40" />
                  <h3 className="text-base font-bold text-[#172033]">No tools found for &ldquo;{searchQuery}&rdquo;</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Try searching for common tasks like &ldquo;writing&rdquo;, &ldquo;research&rdquo;, &ldquo;coding&rdquo;, or &ldquo;privacy&rdquo;.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-white border border-[#E8ECF4] hover:border-[#6C5CE7] text-[#172033] text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </section>

            {/* Additional Homepage Sections: Categories, How to Use, Income Guides, Tutorials, Why NextGen, CTA */}
            <HomeSections 
              categories={categories}
              tutorials={tutorials}
              incomeGuides={incomeGuides}
              onNavigate={navigateTo}
              onSelectCategory={(_catName) => {
                navigateTo('/ai-tools');
              }}
            />
          </div>
        )}
      </main>

      {/* Footer (hidden in admin views) */}
      {!isAdminRoute && <Footer onNavigate={navigateTo} />}
    </div>
  );
}
