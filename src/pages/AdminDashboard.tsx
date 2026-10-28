import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Save, 
  Check, 
  X, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  Settings as SettingsIcon,
  ExternalLink,
  Layers,
  BookOpen,
  DollarSign,
  FileText,
  LayoutDashboard,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
  Palette,
  KeyRound,
  Sliders
} from 'lucide-react';

import { 
  ToolItem, 
  SiteSettings, 
  PricingLabel, 
  CategoryItem, 
  TutorialItem, 
  IncomeGuideItem, 
  ArticleItem,
  AdminUser,
  CoverStyle,
  PromptItem
} from '../types';

import { ToolStorageService } from '../services/toolStorage';
import { ToolIcon } from '../components/ToolIcons';

interface AdminDashboardProps {
  currentAdminRoute: string;
  onNavigateAdmin: (route: string) => void;
  onPublicNavigate: (path: string) => void;
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdminRoute,
  onNavigateAdmin,
  onPublicNavigate,
  onDataChanged
}) => {
  // Authentication State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => ToolStorageService.getAdminUser());
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState('');

  // Initial Administrator Setup State
  const [isConfigured, setIsConfigured] = useState(true);
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupError, setSetupError] = useState('');

  // Database Records
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [tutorials, setTutorials] = useState<TutorialItem[]>([]);
  const [incomeGuides, setIncomeGuides] = useState<IncomeGuideItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(ToolStorageService.getSettings());

  // Search filter for tables
  const [tableSearch, setTableSearch] = useState('');

  // Modals
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);
  const [isNewTool, setIsNewTool] = useState(false);
  const [deleteToolCandidate, setDeleteToolCandidate] = useState<ToolItem | null>(null);

  // Category Edit Modal
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Tutorial Edit Modal
  const [editingTutorial, setEditingTutorial] = useState<TutorialItem | null>(null);

  // Income Guide Edit Modal
  const [editingGuide, setEditingGuide] = useState<IncomeGuideItem | null>(null);

  // Article Edit Modal
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);

  // Prompt Edit Modal
  const [editingPrompt, setEditingPrompt] = useState<PromptItem | null>(null);
  const [isNewPrompt, setIsNewPrompt] = useState(false);
  const [promptFormTitle, setPromptFormTitle] = useState('');
  const [promptFormCategory, setPromptFormCategory] = useState('Income & Business');
  const [promptFormTargetAi, setPromptFormTargetAi] = useState('ChatGPT 4o');
  const [promptFormDesc, setPromptFormDesc] = useState('');
  const [promptFormText, setPromptFormText] = useState('');
  const [promptFormTags, setPromptFormTags] = useState('');
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'setup'>('login');

  // Change Password state for Settings tab
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [changePassError, setChangePassError] = useState('');
  const [changePassSuccess, setChangePassSuccess] = useState('');

  const loadAllData = async () => {
    // 1. Initial cached state
    setTools(ToolStorageService.getTools(true));
    setCategories(ToolStorageService.getCategories());
    setTutorials(ToolStorageService.getTutorials(true));
    setIncomeGuides(ToolStorageService.getIncomeGuides(true));
    setArticles(ToolStorageService.getArticles(true));
    setPrompts(ToolStorageService.getCachedPrompts());
    setSettings(ToolStorageService.getSettings());
    setAdminUser(ToolStorageService.getAdminUser());

    // 2. Fetch fresh data directly from protected /api/admin/* endpoints using Authorization: Bearer <token>
    if (ToolStorageService.isAdminLoggedIn()) {
      const syncResult = await ToolStorageService.syncAdminDataWithServer();
      if (syncResult.success) {
        setTools(ToolStorageService.getTools(true));
        setCategories(ToolStorageService.getCategories());
        setTutorials(ToolStorageService.getTutorials(true));
        setIncomeGuides(ToolStorageService.getIncomeGuides(true));
        setArticles(ToolStorageService.getArticles(true));
        setPrompts(ToolStorageService.getCachedPrompts());
        setSettings(ToolStorageService.getSettings());
      } else if (syncResult.error?.includes('Session expired')) {
        showToast('Administrator session expired. Please sign in again.');
        setAdminUser(null);
        onNavigateAdmin('/admin/login');
      }
    }
  };

  useEffect(() => {
    ToolStorageService.syncWithServer();
    ToolStorageService.checkAuthStatus().then(status => {
      setIsConfigured(status.isConfigured);
      if (!status.isConfigured) {
        setAuthMode('setup');
      }
      if (status.isAuthenticated && status.user) {
        setAdminUser(status.user);
        loadAllData();
      } else {
        setAdminUser(null);
        if (currentAdminRoute !== '/admin/login') {
          onNavigateAdmin('/admin/login');
        }
      }
    });
    loadAllData();
  }, [currentAdminRoute]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    const cleanEmail = emailInput.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().toLowerCase();
    const cleanPassword = passwordInput.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

    try {
      const res = await ToolStorageService.loginAdmin(cleanEmail, cleanPassword);
      setIsLoggingIn(false);

      if (res.success) {
        setAdminUser(ToolStorageService.getAdminUser());
        setPasswordInput('');
        showToast('Welcome back, Admin!');
        onNavigateAdmin('/admin/dashboard');
        await loadAllData();
      } else {
        if (res.needsSetup) {
          setIsConfigured(false);
          setAuthMode('setup');
          setSetupEmail(emailInput);
        }
        setAuthError(res.message || 'Invalid email or password.');
      }
    } catch {
      setIsLoggingIn(false);
      setAuthError('Invalid email or password.');
    }
  };

  const handleSetupFirstAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSettingUp(true);
    setSetupError('');

    if (setupPassword.length < 8) {
      setIsSettingUp(false);
      setSetupError('Password must be at least 8 characters long.');
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setIsSettingUp(false);
      setSetupError('Passwords do not match.');
      return;
    }

    try {
      const res = await ToolStorageService.setupFirstAdmin(setupEmail, setupPassword, setupConfirmPassword);
      setIsSettingUp(false);

      if (res.success) {
        setIsConfigured(true);
        setAdminUser(ToolStorageService.getAdminUser());
        setSetupPassword('');
        setSetupConfirmPassword('');
        showToast('Administrator account established successfully.');
        onNavigateAdmin('/admin/dashboard');
        await loadAllData();
      } else {
        setSetupError(res.message || 'Failed to create administrator account.');
      }
    } catch {
      setIsSettingUp(false);
      setSetupError('An error occurred during administrator setup.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPass(true);
    setChangePassError('');
    setChangePassSuccess('');

    if (newPass.length < 8) {
      setIsChangingPass(false);
      setChangePassError('New password must be at least 8 characters long.');
      return;
    }

    if (newPass !== confirmNewPass) {
      setIsChangingPass(false);
      setChangePassError('New passwords do not match.');
      return;
    }

    const res = await ToolStorageService.changePassword(currPass, newPass, confirmNewPass);
    setIsChangingPass(false);

    if (res.success) {
      setChangePassSuccess('Password changed successfully.');
      setCurrPass('');
      setNewPass('');
      setConfirmNewPass('');
      showToast('Administrator password updated.');
    } else {
      setChangePassError(res.message || 'Failed to change password.');
    }
  };

  const handleLogout = async () => {
    await ToolStorageService.logoutAdmin();
    setAdminUser(null);
    setEmailInput('');
    setPasswordInput('');
    showToast('Signed out successfully.');
    onNavigateAdmin('/admin/login');
  };

  // Check route guard
  const isAuthenticated = !!adminUser?.token;

  // Real Counts for Overview
  const totalTools = tools.length;
  const publishedTools = tools.filter(t => t.isPublished).length;
  const draftTools = tools.filter(t => !t.isPublished).length;
  const featuredToolsCount = tools.filter(t => t.isFeatured && t.isPublished).length;

  // Tool Handlers
  const handleToggleFeatured = (id: string) => {
    ToolStorageService.toggleFeatured(id);
    loadAllData();
    onDataChanged();
    showToast('Featured status updated.');
  };

  const handleTogglePublished = (id: string) => {
    ToolStorageService.togglePublished(id);
    loadAllData();
    onDataChanged();
    showToast('Tool visibility toggled.');
  };

  const handleDeleteTool = () => {
    if (!deleteToolCandidate) return;
    ToolStorageService.deleteTool(deleteToolCandidate.id);
    setDeleteToolCandidate(null);
    loadAllData();
    onDataChanged();
    showToast(`Deleted "${deleteToolCandidate.name}".`);
  };

  const handleSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool || !editingTool.name.trim()) return;

    ToolStorageService.saveTool(editingTool);
    setEditingTool(null);
    setIsNewTool(false);
    loadAllData();
    onDataChanged();
    showToast(`Saved "${editingTool.name}".`);
  };

  // Category Handlers
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    ToolStorageService.saveCategory(editingCategory);
    setEditingCategory(null);
    loadAllData();
    onDataChanged();
    showToast('Category saved.');
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      ToolStorageService.deleteCategory(id);
      loadAllData();
      onDataChanged();
      showToast('Category deleted.');
    }
  };

  // Tutorial Handlers
  const handleSaveTutorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTutorial) return;
    ToolStorageService.saveTutorial(editingTutorial);
    setEditingTutorial(null);
    loadAllData();
    onDataChanged();
    showToast('Tutorial saved.');
  };

  const handleDeleteTutorial = (id: string) => {
    if (window.confirm('Delete this tutorial?')) {
      ToolStorageService.deleteTutorial(id);
      loadAllData();
      onDataChanged();
      showToast('Tutorial deleted.');
    }
  };

  // Income Guide Handlers
  const handleSaveGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuide) return;
    ToolStorageService.saveIncomeGuide(editingGuide);
    setEditingGuide(null);
    loadAllData();
    onDataChanged();
    showToast('Income Guide saved.');
  };

  const handleDeleteGuide = (id: string) => {
    if (window.confirm('Delete this income guide?')) {
      ToolStorageService.deleteIncomeGuide(id);
      loadAllData();
      onDataChanged();
      showToast('Guide deleted.');
    }
  };

  // Article Handlers
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    ToolStorageService.saveArticle(editingArticle);
    setEditingArticle(null);
    loadAllData();
    onDataChanged();
    showToast('Article saved.');
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Delete this article?')) {
      ToolStorageService.deleteArticle(id);
      loadAllData();
      onDataChanged();
      showToast('Article deleted.');
    }
  };

  // Settings Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    ToolStorageService.saveSettings(settings);
    loadAllData();
    onDataChanged();
    showToast('Website settings saved successfully.');
  };

  // Reset to default 7 tools
  const handleResetDefaults = () => {
    if (window.confirm('Reset database to default verified state with the 7 featured tools? All custom modifications will be restored.')) {
      ToolStorageService.resetToDefaults();
      loadAllData();
      onDataChanged();
      showToast('Database reset to verified default state.');
    }
  };

  // AUTHENTICATION VIEW (Shown when unauthenticated or on /admin/login)
  if (!isAuthenticated || currentAdminRoute === '/admin/login') {
    const isShowingSetup = !isConfigured || authMode === 'setup';

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
          <div 
            onClick={() => onPublicNavigate('/')}
            className="inline-flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#4285F4] text-white shadow-md shadow-[#6C5CE7]/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#172033]">
              NextGen AI Guide
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-[#172033] tracking-tight">
            {isShowingSetup ? 'Initialize Administrator Account' : 'Welcome Back, Admin'}
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            {isShowingSetup 
              ? 'Set your secure administrator credentials to initialize your platform.' 
              : 'Sign in to manage AI tools, categories, tutorials, and site settings.'}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
          <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-[#E8ECF4] shadow-xl shadow-[#172033]/5 space-y-6">
            
            {/* Mode Switch Tabs (When unconfigured, lets admin toggle smoothly between setup and sign-in) */}
            {!isConfigured && (
              <div className="flex rounded-xl bg-[#F8FAFC] p-1 border border-[#E8ECF4] text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setAuthMode('setup'); setAuthError(''); }}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'setup' 
                      ? 'bg-white text-[#6C5CE7] shadow-xs' 
                      : 'text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  Admin Setup
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setSetupError(''); }}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    authMode === 'login' 
                      ? 'bg-white text-[#6C5CE7] shadow-xs' 
                      : 'text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  Sign In
                </button>
              </div>
            )}

            {isShowingSetup ? (
              /* SETUP FIRST ADMIN FORM */
              <form onSubmit={handleSetupFirstAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider mb-1">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={setupEmail}
                    onChange={(e) => setSetupEmail(e.target.value)}
                    placeholder="Enter administrator email"
                    className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-3 text-sm text-[#172033] placeholder-[#64748B] focus:border-[#6C5CE7] focus:outline-none transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider mb-1">
                    Password (min 8 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-3 text-sm text-[#172033] placeholder-[#64748B] focus:border-[#6C5CE7] focus:outline-none transition-colors font-medium pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#172033] cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={setupConfirmPassword}
                    onChange={(e) => setSetupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-3 text-sm text-[#172033] placeholder-[#64748B] focus:border-[#6C5CE7] focus:outline-none transition-colors font-medium"
                  />
                </div>

                {setupError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                    {setupError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSettingUp}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-sm font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSettingUp ? (
                    <span>Initializing Administrator...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Establish Administrator Account</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STANDARD LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider mb-1">
                    Administrator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter administrator email"
                    className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-3 text-sm text-[#172033] placeholder-[#64748B] focus:border-[#6C5CE7] focus:outline-none transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-3 text-sm text-[#172033] placeholder-[#64748B] focus:border-[#6C5CE7] focus:outline-none transition-colors font-medium pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#172033] cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium space-y-1.5">
                    <div>{authError}</div>
                    {!isConfigured && (
                      <button
                        type="button"
                        onClick={() => { setAuthMode('setup'); setSetupEmail(emailInput); }}
                        className="text-xs font-bold underline cursor-pointer text-[#6C5CE7]"
                      >
                        Click here to set up your administrator account now →
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-sm font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isLoggingIn ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In to Admin Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <button
                onClick={() => onPublicNavigate('/')}
                className="text-xs font-semibold text-[#6C5CE7] hover:underline cursor-pointer"
              >
                ← Return to Public Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active admin tab helper
  const activeTab = currentAdminRoute.replace('/admin/', '') || 'dashboard';

  // Navigation Items
  const sidebarItems = [
    { label: 'Dashboard Overview', path: '/admin/dashboard', key: 'dashboard', icon: LayoutDashboard },
    { label: 'AI Tools Management', path: '/admin/tools', key: 'tools', icon: Layers, count: tools.length },
    { label: 'Categories', path: '/admin/categories', key: 'categories', icon: Tag, count: categories.length },
    { label: 'Tutorials', path: '/admin/tutorials', key: 'tutorials', icon: BookOpen, count: tutorials.length },
    { label: 'Income Guides', path: '/admin/income-guides', key: 'income-guides', icon: DollarSign, count: incomeGuides.length },
    { label: 'Articles', path: '/admin/articles', key: 'articles', icon: FileText, count: articles.length },
    { label: 'Prompts Vault', path: '/admin/prompts', key: 'prompts', icon: Sparkles, count: prompts.length },
    { label: 'Website Settings', path: '/admin/settings', key: 'settings', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-white border border-emerald-300 px-4 py-3 text-xs font-bold text-emerald-800 shadow-xl animate-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E8ECF4] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onPublicNavigate('/')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#4285F4] text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-[#172033] hidden sm:inline">
              NextGen Admin
            </span>
          </div>

          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            Database Live
          </span>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] font-bold border border-[#6C5CE7]/20" title="All protected admin endpoints attach Authorization: Bearer <token> retrieved from localStorage">
            <Lock className="w-3 h-3" />
            <span>Authorization: Bearer Active</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onPublicNavigate('/')}
            className="text-xs font-semibold text-[#64748B] hover:text-[#172033] px-3 py-1.5 rounded-xl border border-[#E8ECF4] bg-[#F8FAFC] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Shell: Sidebar + Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Admin Sidebar Navigation */}
          <aside className="lg:col-span-3 rounded-3xl bg-white border border-[#E8ECF4] p-4 shadow-sm space-y-2 sticky top-22">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              Content Management
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavigateAdmin(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6C5CE7] text-white shadow-md shadow-[#6C5CE7]/20'
                        : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#E8ECF4]">
              <button
                onClick={handleResetDefaults}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database to Defaults</span>
              </button>
            </div>
          </aside>

          {/* Main Workspace Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* ROUTE 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#172033]">
                    Dashboard Overview
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B]">
                    Real-time database statistics and quick action controls.
                  </p>
                </div>

                {/* Real Database Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Total AI Tools</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#172033]">{totalTools}</div>
                    <span className="text-[11px] text-[#6C5CE7] font-semibold block">{publishedTools} published · {draftTools} draft</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Homepage Featured</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#6C5CE7]">{featuredToolsCount} / 7</div>
                    <span className="text-[11px] text-[#64748B] block">Initial 7 Tools Active</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Tutorials</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#4285F4]">{tutorials.length}</div>
                    <span className="text-[11px] text-[#64748B] block">Step-by-step guides</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Income Playbooks</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{incomeGuides.length}</div>
                    <span className="text-[11px] text-[#64748B] block">Freelancing blueprints</span>
                  </div>
                </div>

                {/* Quick Actions Row */}
                <div className="p-6 rounded-3xl bg-white border border-[#E8ECF4] shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#172033] uppercase tracking-wider">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        onNavigateAdmin('/admin/tools');
                        setIsNewTool(true);
                        setEditingTool({
                          id: '',
                          slug: '',
                          name: '',
                          shortDescription: '',
                          websiteUrl: 'https://',
                          pricingStatus: 'Free Plan Available',
                          pricingDetails: '',
                          iconType: 'custom',
                          category: 'Conversational & Writing',
                          tags: ['Beginner Friendly'],
                          isFeatured: false,
                          isPublished: true,
                          order: tools.length + 1,
                          intro: '',
                          whatIsUsedFor: '',
                          keyFeatures: ['Fast and accessible'],
                          freePlanLimitations: { summary: 'Free plan available', details: ['Basic features included'] },
                          beginnerGuide: [{ stepNumber: 1, title: 'Open website', description: 'Visit tool in browser' }],
                          examplePrompts: [{ title: 'Example', category: 'General', prompt: 'Summarize text' }],
                          advantages: ['Simple to use'],
                          limitations: ['Verify facts'],
                          incomeAndFreelancing: { title: 'Income Strategy', description: 'Client work', tactics: ['Research'] },
                          relatedToolSlugs: ['chatgpt'],
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New AI Tool</span>
                    </button>

                    <button
                      onClick={() => onNavigateAdmin('/admin/tutorials')}
                      className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E8ECF4] text-[#172033] text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
                      <span>Create Tutorial</span>
                    </button>

                    <button
                      onClick={() => onNavigateAdmin('/admin/income-guides')}
                      className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E8ECF4] text-[#172033] text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Add Income Guide</span>
                    </button>

                    <button
                      onClick={() => onNavigateAdmin('/admin/settings')}
                      className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#E8ECF4] text-[#172033] text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <SettingsIcon className="w-4 h-4 text-[#4285F4]" />
                      <span>Configure Settings</span>
                    </button>
                  </div>
                </div>

                {/* Recently Added Tools Table Preview */}
                <div className="rounded-3xl bg-white border border-[#E8ECF4] overflow-hidden shadow-xs">
                  <div className="p-6 border-b border-[#E8ECF4] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#172033]">
                      Recently Managed Tools ({tools.length})
                    </h3>
                    <button
                      onClick={() => onNavigateAdmin('/admin/tools')}
                      className="text-xs font-bold text-[#6C5CE7] hover:underline cursor-pointer"
                    >
                      View All Tools →
                    </button>
                  </div>

                  <div className="divide-y divide-[#E8ECF4]">
                    {tools.slice(0, 5).map((tool) => (
                      <div key={tool.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E8ECF4]">
                            <ToolIcon type={tool.iconType || tool.slug} className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#172033] block">{tool.name}</span>
                            <span className="text-xs text-[#64748B]">{tool.category} · {tool.pricingStatus}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {tool.isFeatured && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              Featured
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tool.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tool.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ROUTE 2: AI TOOLS MANAGEMENT */}
            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#172033]">
                      AI Tools Management
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">
                      Add, edit, publish, feature, or remove AI tool profiles and guides.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsNewTool(true);
                      setEditingTool({
                        id: '',
                        slug: '',
                        name: '',
                        shortDescription: '',
                        websiteUrl: 'https://',
                        pricingStatus: 'Free Plan Available',
                        pricingDetails: '',
                        iconType: 'custom',
                        category: 'Conversational & Writing',
                        tags: ['Beginner Friendly'],
                        isFeatured: false,
                        isPublished: true,
                        order: tools.length + 1,
                        intro: '',
                        whatIsUsedFor: '',
                        keyFeatures: ['Easy to use', 'High speed generation'],
                        freePlanLimitations: { summary: 'Free tier available', details: ['Standard usage included'] },
                        beginnerGuide: [{ stepNumber: 1, title: 'Visit Site', description: 'Open official tool link' }],
                        examplePrompts: [{ title: 'Quick Prompt', category: 'General', prompt: 'Draft text' }],
                        advantages: ['Accessible'],
                        limitations: ['Check accuracy'],
                        incomeAndFreelancing: { title: 'Income Ideas', description: 'Freelancing services', tactics: ['Drafting'] },
                        relatedToolSlugs: ['chatgpt'],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-[#6C5CE7]/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Tool</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center h-11 w-full max-w-md rounded-xl bg-white border border-[#E8ECF4] px-3.5 shadow-2xs">
                  <Search className="w-4 h-4 text-[#6C5CE7] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Filter tools by name or category..."
                    className="w-full text-xs text-[#172033] placeholder-[#64748B] focus:outline-none font-medium"
                  />
                  {tableSearch && (
                    <button onClick={() => setTableSearch('')} className="p-1 text-[#64748B] hover:text-[#172033]">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Tools Table */}
                <div className="rounded-3xl bg-white border border-[#E8ECF4] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#172033]">
                      <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-bold text-[11px] border-b border-[#E8ECF4]">
                        <tr>
                          <th className="p-4">Tool</th>
                          <th className="p-4">Pricing Status</th>
                          <th className="p-4">Category</th>
                          <th className="p-4 text-center">Featured (Homepage)</th>
                          <th className="p-4 text-center">Visibility</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8ECF4]">
                        {tools
                          .filter(t => !tableSearch || t.name.toLowerCase().includes(tableSearch.toLowerCase()) || t.category.toLowerCase().includes(tableSearch.toLowerCase()))
                          .map((tool) => (
                          <tr key={tool.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E8ECF4]">
                                  <ToolIcon type={tool.iconType || tool.slug} className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-bold text-sm text-[#172033]">{tool.name}</div>
                                  <div className="text-[11px] text-[#64748B] font-mono">/ai-tools/{tool.slug}</div>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 font-semibold text-xs">
                              <span className="px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E8ECF4] text-[#172033]">
                                {tool.pricingStatus}
                              </span>
                            </td>

                            <td className="p-4 text-[#64748B] font-medium">
                              {tool.category}
                            </td>

                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleToggleFeatured(tool.id)}
                                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                  tool.isFeatured
                                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                                    : 'bg-[#F8FAFC] border-[#E8ECF4] text-slate-300 hover:text-slate-600'
                                }`}
                                title={tool.isFeatured ? 'Featured on Homepage' : 'Not featured'}
                              >
                                <Star className={`w-4 h-4 ${tool.isFeatured ? 'fill-current' : ''}`} />
                              </button>
                            </td>

                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleTogglePublished(tool.id)}
                                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                  tool.isPublished
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                    : 'bg-slate-100 border-slate-200 text-slate-400'
                                }`}
                                title={tool.isPublished ? 'Published' : 'Hidden'}
                              >
                                {tool.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>
                            </td>

                            <td className="p-4 text-right space-x-1.5">
                              <button
                                onClick={() => {
                                  setEditingTool({ ...tool });
                                  setIsNewTool(false);
                                }}
                                className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#6C5CE7]/10 text-[#6C5CE7] border border-[#E8ECF4] transition-colors cursor-pointer"
                                title="Edit Tool Details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeleteToolCandidate(tool)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                                title="Delete Tool"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ROUTE 3: CATEGORIES MANAGEMENT */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#172033]">Categories Management</h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">Add, edit, or reorder tool discovery categories.</p>
                  </div>
                  <button
                    onClick={() => setEditingCategory({
                      id: `cat-${Date.now()}`,
                      name: '',
                      slug: '',
                      description: '',
                      iconName: 'Sparkles',
                      order: categories.length + 1
                    })}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-5 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="font-bold text-sm text-[#172033] block">{cat.name}</span>
                        <span className="text-xs text-[#64748B] block leading-relaxed">{cat.description}</span>
                        <span className="text-[10px] font-mono text-[#6C5CE7] block">Slug: {cat.slug}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingCategory({ ...cat })}
                          className="p-1.5 rounded-lg bg-[#F8FAFC] text-[#6C5CE7] hover:bg-[#6C5CE7]/10"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE 4: TUTORIALS MANAGEMENT */}
            {activeTab === 'tutorials' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#172033]">Tutorials Management</h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">Create, edit, preview, and publish step-by-step guides.</p>
                  </div>
                  <button
                    onClick={() => setEditingTutorial({
                      id: '',
                      title: '',
                      slug: '',
                      summary: '',
                      toolSlug: 'chatgpt',
                      toolName: 'ChatGPT',
                      category: 'Foundations',
                      readTime: '4 min read',
                      steps: [
                        { stepNumber: 1, title: 'Step 1 Title', description: 'Step description...' }
                      ],
                      isPublished: true,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    })}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Tutorial</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {tutorials.map((tut) => (
                    <div key={tut.id} className="p-6 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#172033]">{tut.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7]">
                            {tut.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] line-clamp-1">{tut.summary}</p>
                        <span className="text-[11px] text-[#64748B]">Tool: {tut.toolName} · {tut.readTime}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTutorial({ ...tut })}
                          className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] text-[#6C5CE7] hover:bg-[#6C5CE7]/10 border border-[#E8ECF4] text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTutorial(tut.id)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE 5: INCOME GUIDES MANAGEMENT */}
            {activeTab === 'income-guides' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#172033]">AI Income Guides Management</h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">Manage freelance playbooks, rates, and step-by-step strategies.</p>
                  </div>
                  <button
                    onClick={() => setEditingGuide({
                      id: '',
                      title: '',
                      slug: '',
                      category: 'Freelancing',
                      difficulty: 'Beginner',
                      estimatedEarnings: '$30 – $60 / hour',
                      summary: '',
                      recommendedTools: ['ChatGPT', 'Claude'],
                      executionSteps: ['Identify client need', 'Generate draft', 'Polish and verify deliverable'],
                      deliverableExample: 'Sample client deliverable',
                      isPublished: true,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    })}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Income Guide</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {incomeGuides.map((guide) => (
                    <div key={guide.id} className="p-6 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#172033]">{guide.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {guide.estimatedEarnings}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] line-clamp-1">{guide.summary}</p>
                        <span className="text-[11px] text-[#64748B]">Difficulty: {guide.difficulty}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingGuide({ ...guide })}
                          className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] text-[#6C5CE7] hover:bg-[#6C5CE7]/10 border border-[#E8ECF4] text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE 6: ARTICLES MANAGEMENT */}
            {activeTab === 'articles' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#172033]">Articles & Editorial Management</h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">Write and publish thought leadership pieces and updates.</p>
                  </div>
                  <button
                    onClick={() => setEditingArticle({
                      id: '',
                      title: '',
                      slug: '',
                      category: 'Industry Insights',
                      summary: '',
                      content: '',
                      author: 'NextGen Editorial Team',
                      readTime: '4 min read',
                      isPublished: true,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    })}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Article</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {articles.map((art) => (
                    <div key={art.id} className="p-6 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-bold text-sm text-[#172033] block">{art.title}</span>
                        <p className="text-xs text-[#64748B] line-clamp-1">{art.summary}</p>
                        <span className="text-[11px] text-[#64748B]">{art.category} · {art.readTime}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingArticle({ ...art })}
                          className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] text-[#6C5CE7] hover:bg-[#6C5CE7]/10 border border-[#E8ECF4] text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ROUTE 7: WEBSITE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* 1. Brand & SEO Settings Card */}
                <div className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-10 space-y-6 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#172033]">
                      Website Brand & SEO Settings
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">
                      Update platform headlines, search placeholders, contact details, and public metadata.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-5 max-w-2xl">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                        Brand / Platform Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                        Hero Headline
                      </label>
                      <input
                        type="text"
                        value={settings.heroHeadline}
                        onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                        className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                        Hero Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={settings.heroSubtitle}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                        className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] p-3 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                          Search Placeholder
                        </label>
                        <input
                          type="text"
                          value={settings.searchPlaceholder}
                          onChange={(e) => setSettings({ ...settings, searchPlaceholder: e.target.value })}
                          className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                          Contact Support Email
                        </label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                          className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer inline-flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Brand Settings</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Colorful & Adjustable Cover Photo (কালারফুল ও আডজাস্টেবল কভার ফটো) Card */}
                <div className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-10 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E8ECF4]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-[#6C5CE7]" />
                        <h2 className="text-xl font-extrabold text-[#172033]">
                          Cover Photo & Banner (কালারফুল কভার ফটো)
                        </h2>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">
                        Customize the colorful cover banner on the homepage: adjust colors, height, opacity, and custom images.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.coverPhoto?.enabled !== false}
                        onChange={(e) => {
                          const updated = {
                            ...settings,
                            coverPhoto: {
                              ...(settings.coverPhoto || {
                                style: 'gradient-vibrant',
                                height: 'medium',
                                opacity: 90,
                                blur: 0,
                                title: 'Explore Next-Generation AI Intelligence',
                                subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
                                showBadges: true
                              }),
                              enabled: e.target.checked
                            }
                          };
                          setSettings(updated);
                          ToolStorageService.saveSettings(updated);
                          showToast('Cover photo status updated.');
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5CE7]" />
                    </label>
                  </div>

                  {settings.coverPhoto?.enabled !== false && (
                    <div className="space-y-6 max-w-3xl">
                      {/* Live Visual Preview */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase text-[#172033] tracking-wider block">
                          Live Banner Preview
                        </span>
                        <div 
                          className={`w-full rounded-2xl relative overflow-hidden transition-all duration-300 flex items-center justify-center p-6 ${
                            settings.coverPhoto?.height === 'compact' ? 'h-32' : settings.coverPhoto?.height === 'tall' ? 'h-52' : 'h-40'
                          }`}
                          style={{
                            background: settings.coverPhoto?.style === 'custom-image' && settings.coverPhoto?.customImageUrl
                              ? `url("${settings.coverPhoto.customImageUrl}") center/cover no-repeat`
                              : settings.coverPhoto?.style === 'gradient-sunset'
                              ? 'linear-gradient(135deg, #FF6B6B 0%, #FD79A8 30%, #6C5CE7 70%, #4285F4 100%)'
                              : settings.coverPhoto?.style === 'gradient-aurora'
                              ? 'linear-gradient(135deg, #00B894 0%, #0984E3 45%, #6C5CE7 85%, #55EFC4 100%)'
                              : settings.coverPhoto?.style === 'gradient-cyber'
                              ? 'linear-gradient(135deg, #E056FD 0%, #686DE0 40%, #30336B 80%, #22A6B3 100%)'
                              : settings.coverPhoto?.style === 'gradient-ocean'
                              ? 'linear-gradient(135deg, #0984E3 0%, #74B9FF 50%, #6C5CE7 100%)'
                              : 'linear-gradient(135deg, #6C5CE7 0%, #4834D4 35%, #4285F4 70%, #00CEC9 100%)',
                            opacity: (settings.coverPhoto?.opacity || 90) / 100,
                            filter: settings.coverPhoto?.blur ? `blur(${settings.coverPhoto.blur}px)` : 'none'
                          }}
                        >
                          <div className="text-center text-white drop-shadow-md space-y-1">
                            <span className="text-sm sm:text-base font-extrabold block">
                              {settings.coverPhoto?.title || 'Explore Next-Generation AI Intelligence'}
                            </span>
                            <span className="text-xs font-medium text-white/90 block">
                              {settings.coverPhoto?.subtitle || 'Curated AI tools, guided workflows, and practical digital income strategies.'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Style Preset Selector */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider">
                          Color Style Preset
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {[
                            { id: 'gradient-vibrant', name: 'Vibrant Electric', grad: 'from-[#6C5CE7] to-[#00CEC9]' },
                            { id: 'gradient-sunset', name: 'Sunset Magenta', grad: 'from-[#FF6B6B] to-[#4285F4]' },
                            { id: 'gradient-aurora', name: 'Aurora Northern', grad: 'from-[#00B894] to-[#6C5CE7]' },
                            { id: 'gradient-cyber', name: 'Cyberpunk Mesh', grad: 'from-[#E056FD] to-[#22A6B3]' },
                            { id: 'gradient-ocean', name: 'Ocean Azure', grad: 'from-[#0984E3] to-[#6C5CE7]' },
                            { id: 'custom-image', name: 'Custom Image URL', grad: 'from-[#6C5CE7] to-[#4285F4]' }
                          ].map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...settings,
                                  coverPhoto: {
                                    ...(settings.coverPhoto || {
                                      enabled: true,
                                      height: 'medium',
                                      opacity: 90,
                                      blur: 0,
                                      title: 'Explore Next-Generation AI Intelligence',
                                      subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
                                      showBadges: true
                                    }),
                                    style: preset.id as CoverStyle
                                  }
                                };
                                setSettings(updated);
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                                settings.coverPhoto?.style === preset.id
                                  ? 'border-[#6C5CE7] bg-[#6C5CE7]/10 ring-2 ring-[#6C5CE7]/20 font-bold'
                                  : 'border-[#E8ECF4] hover:border-[#6C5CE7]/30 bg-white'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-lg bg-gradient-to-r ${preset.grad} shrink-0`} />
                              <span className="text-xs text-[#172033] truncate">{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Height Selector */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider">
                          Cover Height
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['compact', 'medium', 'tall'] as const).map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...settings,
                                  coverPhoto: {
                                    ...(settings.coverPhoto || {
                                      enabled: true,
                                      style: 'gradient-vibrant',
                                      opacity: 90,
                                      blur: 0,
                                      title: 'Explore Next-Generation AI Intelligence',
                                      subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
                                      showBadges: true
                                    }),
                                    height: h
                                  }
                                };
                                setSettings(updated);
                              }}
                              className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                                settings.coverPhoto?.height === h
                                  ? 'bg-[#6C5CE7] text-white shadow-xs'
                                  : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E8ECF4]'
                              }`}
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sliders: Opacity & Blur */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-[#172033]">
                            <span>Opacity / Intensity</span>
                            <span className="text-[#6C5CE7]">{settings.coverPhoto?.opacity || 90}%</span>
                          </div>
                          <input
                            type="range"
                            min={20}
                            max={100}
                            step={5}
                            value={settings.coverPhoto?.opacity || 90}
                            onChange={(e) => {
                              const updated = {
                                ...settings,
                                coverPhoto: {
                                  ...(settings.coverPhoto || {
                                    enabled: true,
                                    style: 'gradient-vibrant',
                                    height: 'medium',
                                    blur: 0,
                                    title: 'Explore Next-Generation AI Intelligence',
                                    subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
                                    showBadges: true
                                  }),
                                  opacity: Number(e.target.value)
                                }
                              };
                              setSettings(updated);
                            }}
                            className="w-full accent-[#6C5CE7] cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-[#172033]">
                            <span>Softness / Blur</span>
                            <span className="text-[#6C5CE7]">{settings.coverPhoto?.blur || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={20}
                            step={1}
                            value={settings.coverPhoto?.blur || 0}
                            onChange={(e) => {
                              const updated = {
                                ...settings,
                                coverPhoto: {
                                  ...(settings.coverPhoto || {
                                    enabled: true,
                                    style: 'gradient-vibrant',
                                    height: 'medium',
                                    opacity: 90,
                                    title: 'Explore Next-Generation AI Intelligence',
                                    subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
                                    showBadges: true
                                  }),
                                  blur: Number(e.target.value)
                                }
                              };
                              setSettings(updated);
                            }}
                            className="w-full accent-[#6C5CE7] cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Custom Image URL (When style === 'custom-image') */}
                      {settings.coverPhoto?.style === 'custom-image' && (
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                            Custom Image URL
                          </label>
                          <input
                            type="url"
                            value={settings.coverPhoto?.customImageUrl || ''}
                            onChange={(e) => {
                              const updated = {
                                ...settings,
                                coverPhoto: {
                                  ...(settings.coverPhoto || {
                                    enabled: true,
                                    style: 'custom-image',
                                    height: 'medium',
                                    opacity: 90,
                                    blur: 0,
                                    title: 'Explore Next-Generation AI Intelligence',
                                    subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
                                    showBadges: true
                                  }),
                                  customImageUrl: e.target.value
                                }
                              };
                              setSettings(updated);
                            }}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Save Cover Button */}
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            ToolStorageService.saveSettings(settings);
                            showToast('Cover photo settings saved.');
                          }}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer inline-flex items-center gap-2"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Cover Photo Changes</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Administrator Password Security Card */}
                <div className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-10 space-y-6 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-[#6C5CE7]" />
                      <h2 className="text-xl font-extrabold text-[#172033]">
                        Change Administrator Password
                      </h2>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      Update your administrator password securely. Passwords are salted and hashed with scrypt.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currPass}
                        onChange={(e) => setCurrPass(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                        New Password (min 8 characters)
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Create strong new password"
                        className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#172033] mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={confirmNewPass}
                        onChange={(e) => setConfirmNewPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                      />
                    </div>

                    {changePassError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                        {changePassError}
                      </div>
                    )}

                    {changePassSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                        {changePassSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="px-5 py-2.5 rounded-xl bg-[#172033] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
                    >
                      {isChangingPass ? (
                        <span>Updating Password...</span>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ROUTE: PROMPTS VAULT MANAGEMENT */}
            {activeTab === 'prompts' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#172033]">
                      VIP Prompts Vault Management
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">
                      Manage exclusive master prompts accessible only by authenticated administrators (<span className="text-[#6C5CE7] font-semibold">admin@nextgenai.guide</span>).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPublicNavigate('/prompts')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-[#E8ECF4] text-xs font-bold text-[#172033] hover:text-[#6C5CE7] hover:border-[#6C5CE7]/30 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Public Vault</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsNewPrompt(true);
                        setPromptFormTitle('');
                        setPromptFormCategory('Income & Business');
                        setPromptFormTargetAi('ChatGPT 4o');
                        setPromptFormDesc('');
                        setPromptFormText('');
                        setPromptFormTags('Sales, Client Acquisition');
                        setEditingPrompt({
                          id: '',
                          title: '',
                          category: 'Income & Business',
                          targetAi: 'ChatGPT 4o',
                          description: '',
                          promptText: '',
                          tags: ['AI Prompt'],
                          order: prompts.length + 1,
                          isPublished: true,
                          isExclusiveAdmin: true,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Master Prompt</span>
                    </button>
                  </div>
                </div>

                {/* Prompts Grid */}
                <div className="space-y-4">
                  {prompts.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8ECF4] shadow-xs space-y-4 hover:border-[#6C5CE7]/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#6C5CE7]/10 text-[#6C5CE7]">
                              {p.targetAi}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {p.category}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Admin-Only</span>
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[#172033]">{p.title}</h3>
                          <p className="text-xs text-[#64748B]">{p.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setIsNewPrompt(false);
                              setPromptFormTitle(p.title);
                              setPromptFormCategory(p.category);
                              setPromptFormTargetAi(p.targetAi);
                              setPromptFormDesc(p.description);
                              setPromptFormText(p.promptText);
                              setPromptFormTags((p.tags || []).join(', '));
                              setEditingPrompt(p);
                            }}
                            className="p-2 rounded-lg text-slate-600 hover:text-[#6C5CE7] hover:bg-[#F8FAFC] border border-[#E8ECF4] cursor-pointer"
                            title="Edit Prompt"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete prompt "${p.title}"?`)) {
                                const ok = await ToolStorageService.deletePrompt(p.id);
                                if (ok) {
                                  setPrompts(prev => prev.filter(x => x.id !== p.id));
                                  showToast('Prompt removed.');
                                }
                              }
                            }}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                            title="Delete Prompt"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Code Instruction Preview */}
                      <div className="p-3.5 rounded-xl bg-[#0F172A] text-slate-200 text-xs font-mono max-h-32 overflow-y-auto leading-relaxed border border-slate-800">
                        {p.promptText}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span>Variables: {p.variables?.length || 0} dynamic fields</span>
                        <div className="flex items-center gap-1.5">
                          {(p.tags || []).map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {prompts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E8ECF4] p-6 text-sm text-[#64748B]">
                      No prompts found in the database. Click &ldquo;Add Master Prompt&rdquo; to create your first one.
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODAL: EDIT / CREATE TOOL */}
      {editingTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#E8ECF4] shadow-2xl p-6 sm:p-10 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8ECF4]">
              <h3 className="text-xl font-bold text-[#172033]">
                {isNewTool ? 'Add New AI Tool' : `Edit Tool: ${editingTool.name}`}
              </h3>
              <button
                onClick={() => setEditingTool(null)}
                className="p-2 rounded-xl text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTool} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTool.name}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    URL Slug * (e.g. chatgpt, gemini)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTool.slug}
                    onChange={(e) => setEditingTool({ ...editingTool, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                    className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2.5 text-sm text-[#172033] font-mono focus:border-[#6C5CE7] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Official Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editingTool.websiteUrl}
                    onChange={(e) => setEditingTool({ ...editingTool, websiteUrl: e.target.value })}
                    className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Pricing Status (Allowed Labels Only) *
                  </label>
                  <select
                    value={editingTool.pricingStatus}
                    onChange={(e) => setEditingTool({ ...editingTool, pricingStatus: e.target.value as PricingLabel })}
                    className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2 text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none font-semibold"
                  >
                    <option value="Free">Free</option>
                    <option value="Free Plan Available">Free Plan Available</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                    <option value="Pricing not verified">Pricing not verified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Official Icon
                  </label>
                  <select
                    value={editingTool.iconType}
                    onChange={(e) => setEditingTool({ ...editingTool, iconType: e.target.value as any })}
                    className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] px-4 py-2 text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none font-semibold"
                  >
                    <option value="chatgpt">ChatGPT</option>
                    <option value="gemini">Google Gemini</option>
                    <option value="claude">Claude</option>
                    <option value="copilot">Microsoft Copilot</option>
                    <option value="perplexity">Perplexity AI</option>
                    <option value="duck-ai">Duck.ai</option>
                    <option value="meta-ai">Meta AI</option>
                    <option value="custom">Generic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Short Description (Homepage Card)
                </label>
                <textarea
                  rows={2}
                  value={editingTool.shortDescription}
                  onChange={(e) => setEditingTool({ ...editingTool, shortDescription: e.target.value })}
                  className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] p-3 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Introduction (Detail Page)
                </label>
                <textarea
                  rows={3}
                  value={editingTool.intro}
                  onChange={(e) => setEditingTool({ ...editingTool, intro: e.target.value })}
                  className="w-full rounded-xl bg-[#F8FAFC] border-2 border-[#E8ECF4] p-3 text-sm text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-[#E8ECF4]">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#172033]">
                  <input
                    type="checkbox"
                    checked={editingTool.isFeatured}
                    onChange={(e) => setEditingTool({ ...editingTool, isFeatured: e.target.checked })}
                    className="accent-[#6C5CE7] w-4 h-4"
                  />
                  <span>Feature in Homepage 7 Tools</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#172033]">
                  <input
                    type="checkbox"
                    checked={editingTool.isPublished}
                    onChange={(e) => setEditingTool({ ...editingTool, isPublished: e.target.checked })}
                    className="accent-[#6C5CE7] w-4 h-4"
                  />
                  <span>Published (Publicly Visible)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8ECF4]">
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E8ECF4] text-[#64748B] hover:text-[#172033] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/20"
                >
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteToolCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-[#E8ECF4] p-6 space-y-4 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#172033]">
              Delete &ldquo;{deleteToolCandidate.name}&rdquo;?
            </h3>
            <p className="text-xs text-[#64748B]">
              Are you sure you want to remove this tool from the directory? This action will immediately remove it from public view.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteToolCandidate(null)}
                className="px-4 py-2 rounded-xl border border-[#E8ECF4] text-xs font-bold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTool}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / CREATE PROMPT */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#E8ECF4] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8ECF4]">
              <h3 className="text-xl font-bold text-[#172033]">
                {isNewPrompt ? 'Add VIP Master Prompt' : `Edit Prompt: ${promptFormTitle || editingPrompt.title}`}
              </h3>
              <button
                onClick={() => setEditingPrompt(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!promptFormTitle.trim() || !promptFormText.trim()) return;
                setIsSavingPrompt(true);

                const tagArray = promptFormTags.split(',').map(t => t.trim()).filter(Boolean);
                const varMatches = Array.from(new Set(promptFormText.match(/\[([A-Z0-9_]+)\]/g) || []));
                const extractedVariables = varMatches.map(m => {
                  const key = m.replace(/[\[\]]/g, '');
                  return {
                    key,
                    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
                    placeholder: `Enter ${key.toLowerCase().replace(/_/g, ' ')}`
                  };
                });

                const payload = {
                  id: editingPrompt.id || undefined,
                  title: promptFormTitle.trim(),
                  category: promptFormCategory,
                  targetAi: promptFormTargetAi,
                  description: promptFormDesc.trim() || 'Curated high-performance master prompt.',
                  promptText: promptFormText.trim(),
                  variables: extractedVariables,
                  tags: tagArray.length > 0 ? tagArray : ['AI Prompt'],
                  order: editingPrompt.order || prompts.length + 1,
                  isPublished: true,
                  isExclusiveAdmin: true
                };

                const res = await ToolStorageService.savePrompt(payload);
                setIsSavingPrompt(false);
                if (res.success && res.prompt) {
                  showToast(isNewPrompt ? 'Master prompt created.' : 'Master prompt updated.');
                  setEditingPrompt(null);
                  setPrompts(prev => {
                    const idx = prev.findIndex(p => p.id === res.prompt!.id);
                    if (idx >= 0) {
                      const copy = [...prev];
                      copy[idx] = res.prompt!;
                      return copy;
                    }
                    return [res.prompt!, ...prev];
                  });
                } else {
                  showToast(res.message || 'Failed to save prompt.');
                }
              }}
              className="space-y-4 pt-3"
            >
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  required
                  value={promptFormTitle}
                  onChange={(e) => setPromptFormTitle(e.target.value)}
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
                    value={promptFormCategory}
                    onChange={(e) => setPromptFormCategory(e.target.value)}
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
                    value={promptFormTargetAi}
                    onChange={(e) => setPromptFormTargetAi(e.target.value)}
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
                  value={promptFormDesc}
                  onChange={(e) => setPromptFormDesc(e.target.value)}
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
                    Tip: Use [VARIABLE_NAME] for dynamic placeholders
                  </span>
                </div>
                <textarea
                  required
                  rows={6}
                  value={promptFormText}
                  onChange={(e) => setPromptFormText(e.target.value)}
                  placeholder="Act as a world-class copywriter... Write an offer for [TARGET_INDUSTRY]..."
                  className="w-full p-3.5 rounded-xl bg-[#0F172A] text-slate-100 font-mono text-xs border border-slate-800 focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={promptFormTags}
                  onChange={(e) => setPromptFormTags(e.target.value)}
                  placeholder="Sales, Email, Outreach, Freelance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E8ECF4]">
                <button
                  type="button"
                  onClick={() => setEditingPrompt(null)}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] text-xs font-bold text-[#64748B] hover:text-[#172033] border border-[#E8ECF4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPrompt}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] text-white text-xs font-bold hover:opacity-95 shadow-md shadow-[#6C5CE7]/20 disabled:opacity-60"
                >
                  {isSavingPrompt ? 'Saving...' : 'Save Master Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
