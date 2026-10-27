import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { ToolItem } from '../types';
import { ToolCard } from '../components/ToolCard';

interface ToolsDirectoryPageProps {
  tools: ToolItem[];
  onLearnMore: (tool: ToolItem) => void;
  initialSearch?: string;
  initialCategory?: string;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({
  tools,
  onLearnMore,
  initialSearch = '',
  initialCategory = 'All'
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const categories = useMemo(() => {
    const set = new Set<string>();
    tools.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return ['All', ...Array.from(set)];
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      if (!tool.isPublished) return false;

      if (selectedCategory !== 'All' && tool.category !== selectedCategory) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.shortDescription.toLowerCase().includes(q);
        const matchCat = tool.category.toLowerCase().includes(q);
        const matchTags = (tool.tags || []).some(t => t.toLowerCase().includes(q));
        const matchWhat = (tool.whatIsUsedFor || '').toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat && !matchTags && !matchWhat) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => a.order - b.order);
  }, [tools, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 px-3 py-1 text-xs text-[#6C5CE7] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated AI Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#172033] tracking-tight">
            Explore All AI Tools
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Discover beginner-friendly assistants to help you write, research, automate everyday tasks, and build digital skills.
          </p>
        </div>

        {/* Search Bar & Category Filter Chips */}
        <div className="space-y-4">
          <div className="relative flex items-center h-14 w-full max-w-xl rounded-2xl bg-[#F8FAFC] border-2 border-[#E8ECF4] focus-within:border-[#6C5CE7] focus-within:ring-4 focus-within:ring-[#6C5CE7]/10 transition-all shadow-xs">
            <Search className="w-5 h-5 text-[#6C5CE7] ml-4 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tool name, task, or purpose (e.g. writing, research, privacy)..."
              className="w-full bg-transparent px-3 text-sm sm:text-base text-[#172033] placeholder-[#64748B] focus:outline-none font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="p-2 text-[#64748B] hover:text-[#172033] mr-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                    active
                      ? 'bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] border-transparent text-white shadow-md shadow-[#6C5CE7]/20'
                      : 'bg-[#F8FAFC] border-[#E8ECF4] text-[#64748B] hover:text-[#172033] hover:border-[#6C5CE7]/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#E8ECF4]">
          <span className="font-medium">
            Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          </span>
          {(search || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="text-[#6C5CE7] font-semibold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* 3 Columns Desktop, 2 Columns Tablet, 1-2 Mobile Responsive Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onLearnMore={onLearnMore}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-[#F8FAFC] border border-[#E8ECF4] p-8 space-y-4">
            <Search className="w-12 h-12 mx-auto text-[#64748B]/60" />
            <h3 className="text-lg font-bold text-[#172033]">No tools found matching &ldquo;{search}&rdquo;</h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
              We couldn&rsquo;t find any tools matching your search criteria. Try a different term or clear your category filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E8ECF4] hover:border-[#6C5CE7] text-[#172033] text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              View All Tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
