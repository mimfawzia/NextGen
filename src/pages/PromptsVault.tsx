import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  Copy, 
  Check, 
  Search, 
  Sliders, 
  ExternalLink, 
  Shield, 
  ArrowRight, 
  Layers, 
  Code, 
  Image as ImageIcon, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Plus, 
  Eye, 
  EyeOff, 
  AlertCircle,
  HelpCircle,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { PromptItem, PromptVariable } from '../types';
import { ToolStorageService } from '../services/toolStorage';

interface PromptsVaultProps {
  onNavigate: (path: string) => void;
}

export const PromptsVault: React.FC<PromptsVaultProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [teasers, setTeasers] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeModel, setActiveModel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // In-page quick login state for locked mode
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Interactive variable customizer state: promptId -> { [variableKey]: value }
  const [customVariables, setCustomVariables] = useState<Record<string, Record<string, string>>>({});
  const [expandedCustomizer, setExpandedCustomizer] = useState<string | null>(null);

  // New prompt modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Income & Business');
  const [newTargetAi, setNewTargetAi] = useState('ChatGPT 4o');
  const [newDescription, setNewDescription] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [newTags, setNewTags] = useState('Prompts, AI');
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);

  const loadVaultData = async () => {
    setLoading(true);
    try {
      const res = await ToolStorageService.fetchPrompts();
      if (!res.locked && res.prompts) {
        setIsLocked(false);
        setPrompts(res.prompts);
      } else {
        setIsLocked(true);
        setTeasers(res.teasers || []);
      }
    } catch {
      setIsLocked(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVaultData();
  }, []);

  const handleInPageLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await ToolStorageService.loginAdmin(loginEmail, loginPassword);
      setIsLoggingIn(false);
      if (res.success) {
        setLoginPassword('');
        await loadVaultData();
      } else {
        setLoginError(res.message || 'Invalid administrator email or password.');
      }
    } catch {
      setIsLoggingIn(false);
      setLoginError('Invalid administrator email or password.');
    }
  };

  const handleCopyPrompt = (prompt: PromptItem) => {
    let textToCopy = prompt.promptText;

    // Apply custom variables if filled
    const vars = customVariables[prompt.id];
    if (vars) {
      Object.entries(vars).forEach(([key, val]) => {
        if (val && val.trim()) {
          const regex = new RegExp(`\\[${key}\\]`, 'g');
          textToCopy = textToCopy.replace(regex, val.trim());
        }
      });
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(prompt.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const handleVariableChange = (promptId: string, varKey: string, val: string) => {
    setCustomVariables(prev => ({
      ...prev,
      [promptId]: {
        ...(prev[promptId] || {}),
        [varKey]: val
      }
    }));
  };

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPromptText.trim()) return;

    setIsSavingPrompt(true);
    const tagArray = newTags.split(',').map(t => t.trim()).filter(Boolean);

    // Extract any [VARIABLE_NAME] matches from promptText
    const varMatches = Array.from(new Set(newPromptText.match(/\[([A-Z0-9_]+)\]/g) || []));
    const extractedVariables: PromptVariable[] = varMatches.map(m => {
      const key = m.replace(/[\[\]]/g, '');
      return {
        key,
        label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
        placeholder: `Enter ${key.toLowerCase().replace(/_/g, ' ')}`
      };
    });

    const newPrompt: Partial<PromptItem> & { title: string; promptText: string } = {
      title: newTitle.trim(),
      category: newCategory,
      targetAi: newTargetAi,
      description: newDescription.trim() || 'Curated high-performance master prompt.',
      promptText: newPromptText.trim(),
      variables: extractedVariables,
      tags: tagArray.length > 0 ? tagArray : ['AI Prompt'],
      order: prompts.length + 1,
      isPublished: true,
      isExclusiveAdmin: true
    };

    const res = await ToolStorageService.savePrompt(newPrompt);
    setIsSavingPrompt(false);
    if (res.success && res.prompt) {
      setPrompts(prev => [res.prompt!, ...prev]);
      setShowAddModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewPromptText('');
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach(p => set.add(p.category));
    teasers.forEach(t => set.add(t.category));
    return ['All', ...Array.from(set)];
  }, [prompts, teasers]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchModel = activeModel === 'All' || p.targetAi.toLowerCase().includes(activeModel.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.targetAi.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchModel && matchQuery;
    });
  }, [prompts, activeCategory, activeModel, searchQuery]);

  const getAiBadgeColor = (targetAi: string) => {
    const ai = targetAi.toLowerCase();
    if (ai.includes('chatgpt')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (ai.includes('claude')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (ai.includes('midjourney')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Banner Header */}
      <section className="bg-white border-b border-[#E8ECF4] pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-4 font-medium">
            <button onClick={() => onNavigate('/')} className="hover:text-[#6C5CE7] transition-colors cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-[#172033] font-semibold">VIP Prompts Vault</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Master Prompt Architectures</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172033] tracking-tight">
                VIP AI Prompts Vault
              </h1>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Tested, high-converting prompts engineered for ChatGPT 4o, Claude 3.5 Sonnet, Midjourney v6, and automated business workflows.
              </p>
            </div>

            {/* Status / Quick Action Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {isLocked ? (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-xs">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Admin Credentials Required</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Unlocked (Administrator)</span>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold hover:opacity-95 shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Prompt</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* ================= STATE 1: UNLOCKED VIEW ================= */}
        {!isLocked && (
          <div className="space-y-8">
            {/* Search & Model Filters */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E8ECF4] shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search prompts by keyword, goal, or tags..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs sm:text-sm text-[#172033] placeholder-[#64748B] focus:border-[#6C5CE7] focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#64748B] hover:text-[#172033]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Model Quick Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                  <span className="text-xs font-bold text-[#64748B] whitespace-nowrap">Model:</span>
                  {['All', 'ChatGPT', 'Claude', 'Midjourney'].map((model) => (
                    <button
                      key={model}
                      onClick={() => setActiveModel(model)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        activeModel === model
                          ? 'bg-[#172033] text-white shadow-xs'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E8ECF4]'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#F1F5F9]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-[#6C5CE7] text-white shadow-xs'
                        : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] hover:bg-slate-100 border border-[#E8ECF4]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count & Info */}
            <div className="flex items-center justify-between text-xs text-[#64748B] px-1 font-medium">
              <span>Showing {filteredPrompts.length} exclusive master prompts</span>
              <span>Click &ldquo;Copy Prompt&rdquo; or customize dynamic placeholders</span>
            </div>

            {/* Prompt Cards Grid */}
            <div className="grid grid-cols-1 gap-6">
              {filteredPrompts.map((prompt) => {
                const isCopied = copiedId === prompt.id;
                const isCustomizing = expandedCustomizer === prompt.id;
                const variables = prompt.variables || [];
                const currentVals = customVariables[prompt.id] || {};

                // Compute preview text with custom replacements
                let previewText = prompt.promptText;
                Object.entries(currentVals).forEach(([k, v]) => {
                  if (v && v.trim()) {
                    previewText = previewText.replace(new RegExp(`\\[${k}\\]`, 'g'), v.trim());
                  }
                });

                return (
                  <div
                    key={prompt.id}
                    className="bg-white rounded-3xl border border-[#E8ECF4] shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 space-y-6"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getAiBadgeColor(prompt.targetAi)}`}>
                            {prompt.targetAi}
                          </span>
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {prompt.category}
                          </span>
                          {variables.length > 0 && (
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {variables.length} Dynamic Variables
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
                          {prompt.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                          {prompt.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 sm:self-start">
                        {variables.length > 0 && (
                          <button
                            onClick={() => setExpandedCustomizer(isCustomizing ? null : prompt.id)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isCustomizing
                                ? 'bg-[#6C5CE7]/10 text-[#6C5CE7] border-[#6C5CE7]/30'
                                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border-[#E8ECF4]'
                            }`}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>{isCustomizing ? 'Hide Inputs' : 'Customize Variables'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleCopyPrompt(prompt)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white hover:opacity-95'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Interactive Variables Form (Expandable) */}
                    {isCustomizing && variables.length > 0 && (
                      <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5 text-[#6C5CE7]" />
                            <span>Customize Dynamic Values Before Copying</span>
                          </h3>
                          <button
                            onClick={() => {
                              setCustomVariables(prev => ({ ...prev, [prompt.id]: {} }));
                            }}
                            className="text-[11px] font-semibold text-[#6C5CE7] hover:underline"
                          >
                            Reset Inputs
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {variables.map((v) => (
                            <div key={v.key} className="space-y-1">
                              <label className="text-[11px] font-bold text-[#172033]">
                                {v.label} <span className="text-[#64748B] font-normal">[{v.key}]</span>
                              </label>
                              <input
                                type="text"
                                value={currentVals[v.key] || ''}
                                onChange={(e) => handleVariableChange(prompt.id, v.key, e.target.value)}
                                placeholder={v.placeholder}
                                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8ECF4] text-xs text-[#172033] placeholder-[#94A3B8] focus:border-[#6C5CE7] focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prompt Box */}
                    <div className="relative group">
                      <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl bg-[#1E293B] text-slate-300 text-xs font-mono border border-b-0 border-slate-700">
                        <span className="flex items-center gap-2">
                          <Code className="w-3.5 h-3.5 text-[#6C5CE7]" />
                          <span>Prompt Instruction Block</span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {prompt.targetAi}
                        </span>
                      </div>
                      <pre className="p-4 sm:p-5 rounded-b-xl bg-[#0F172A] text-slate-100 text-xs sm:text-[13px] font-mono leading-relaxed whitespace-pre-wrap break-words overflow-x-auto border border-slate-800">
                        {previewText}
                      </pre>
                    </div>

                    {/* Tips and Pro Advice */}
                    {prompt.tips && prompt.tips.length > 0 && (
                      <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900 space-y-1.5">
                        <span className="font-bold flex items-center gap-1.5 text-purple-800">
                          <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
                          Pro Advice for Maximum Results:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-purple-800/90 pl-1">
                          {prompt.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer Row: Tags and Launch Shortcuts */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#F1F5F9]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(prompt.tags || []).map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-[#64748B] text-[11px] font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#64748B] font-medium">Quick Launch:</span>
                        {prompt.targetAi.toLowerCase().includes('chatgpt') && (
                          <a
                            href="https://chatgpt.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E8ECF4] text-xs font-semibold text-[#172033] hover:text-[#6C5CE7] transition-colors"
                          >
                            <span>ChatGPT</span>
                            <ExternalLink className="w-3 h-3 text-[#64748B]" />
                          </a>
                        )}
                        {prompt.targetAi.toLowerCase().includes('claude') && (
                          <a
                            href="https://claude.ai/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E8ECF4] text-xs font-semibold text-[#172033] hover:text-[#6C5CE7] transition-colors"
                          >
                            <span>Claude</span>
                            <ExternalLink className="w-3 h-3 text-[#64748B]" />
                          </a>
                        )}
                        {prompt.targetAi.toLowerCase().includes('midjourney') && (
                          <a
                            href="https://www.midjourney.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E8ECF4] text-xs font-semibold text-[#172033] hover:text-[#6C5CE7] transition-colors"
                          >
                            <span>Midjourney</span>
                            <ExternalLink className="w-3 h-3 text-[#64748B]" />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STATE 2: LOCKED VIEW ================= */}
        {isLocked && (
          <div className="space-y-12">
            
            {/* Lock Hero Card */}
            <div className="bg-gradient-to-b from-white to-[#F8FAFC] rounded-3xl border-2 border-[#E8ECF4] p-8 sm:p-12 shadow-xl shadow-[#172033]/5 text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#6C5CE7] to-[#4285F4] text-white flex items-center justify-center shadow-lg shadow-[#6C5CE7]/30">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
                  Protected VIP Prompts Vault
                </h2>
                <p className="text-sm text-[#64748B] leading-relaxed max-w-lg mx-auto">
                  এই প্রম্পট ভল্টটি শুধুমাত্র অথেনটিকেটেড এ্যাডমিনিস্ট্রেটরের জন্য সংরক্ষিত। সম্পূর্ণ প্রম্পট টেমপ্লেট দেখতে ও কপি করতে এ্যাডমিন ক্রেডেনশিয়াল দিয়ে সাইন ইন করুন।
                </p>
              </div>

              {/* In-Page Quick Sign-In Form */}
              <form onSubmit={handleInPageLogin} className="space-y-4 max-w-md mx-auto text-left pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@nextgenai.guide"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8ECF4] text-sm text-[#172033] placeholder-slate-400 focus:border-[#6C5CE7] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#172033] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8ECF4] text-sm text-[#172033] placeholder-slate-400 focus:border-[#6C5CE7] focus:outline-none transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-sm font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Sign In & Unlock Master Prompts</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/admin/login')}
                  className="text-xs font-semibold text-[#6C5CE7] hover:underline"
                >
                  Or go to dedicated Admin Login page →
                </button>
              </div>
            </div>

            {/* Teaser Preview Cards (Shows locked previews without disclosing actual promptText) */}
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-[#172033]">
                  What&rsquo;s Inside the Exclusive Vault
                </h3>
                <p className="text-xs text-[#64748B]">
                  {teasers.length} verified production prompt architectures awaiting unlock
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teasers.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl border border-[#E8ECF4] p-5 space-y-3 shadow-2xs hover:border-[#6C5CE7]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getAiBadgeColor(t.targetAi)}`}>
                        {t.targetAi}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#172033]">
                      {t.title}
                    </h4>

                    <p className="text-xs text-[#64748B] line-clamp-2">
                      {t.description}
                    </p>

                    {/* Masked Prompt Preview Box */}
                    <div className="relative p-3 rounded-xl bg-slate-900/90 text-slate-400 font-mono text-[11px] overflow-hidden select-none">
                      <div className="blur-xs filter">
                        Act as a world-class consultant and architect... [REDACTED EXCLUSIVE PROMPT INSTRUCTION]
                      </div>
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px] flex items-center justify-center gap-1.5 text-xs text-white font-semibold">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sign in as Admin to View Template</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Modal: Add New Prompt */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#172033]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8ECF4] shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8ECF4]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="text-lg font-bold text-[#172033]">Add Exclusive Prompt</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePrompt} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. High-Ticket B2B Cold Outreach Generator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs sm:text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                  >
                    <option value="Income & Business">Income & Business</option>
                    <option value="Coding & Architecture">Coding & Architecture</option>
                    <option value="Midjourney & Visuals">Midjourney & Visuals</option>
                    <option value="Copywriting & Content">Copywriting & Content</option>
                    <option value="SEO & Growth">SEO & Growth</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Target AI Model
                  </label>
                  <select
                    value={newTargetAi}
                    onChange={(e) => setNewTargetAi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                  >
                    <option value="ChatGPT 4o">ChatGPT 4o</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="Midjourney v6">Midjourney v6</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summarize the core outcome of this prompt..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs sm:text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#172033]">
                    Prompt Template Text *
                  </label>
                  <span className="text-[11px] text-[#6C5CE7] font-semibold">
                    Tip: Use [VARIABLE_NAME] for dynamic fields
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="Act as a world-class copywriter... I need an email for [TARGET_INDUSTRY]..."
                  className="w-full p-3.5 rounded-xl bg-[#0F172A] text-slate-100 font-mono text-xs border border-slate-800 focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Sales, Email, Outreach, Freelance"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8ECF4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] text-xs font-bold text-[#64748B] hover:text-[#172033] border border-[#E8ECF4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPrompt}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold hover:opacity-95 shadow-md shadow-[#6C5CE7]/20 disabled:opacity-60"
                >
                  {isSavingPrompt ? 'Saving...' : 'Save & Publish to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
