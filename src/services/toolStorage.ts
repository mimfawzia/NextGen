import { 
  ToolItem, 
  SiteSettings, 
  CategoryItem, 
  TutorialItem, 
  IncomeGuideItem, 
  ArticleItem, 
  AdminUser 
} from '../types';

import { 
  INITIAL_TOOLS, 
  INITIAL_SITE_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_TUTORIALS, 
  INITIAL_INCOME_GUIDES, 
  INITIAL_ARTICLES 
} from '../data/initialTools';

const TOOLS_STORAGE_KEY = 'nextgen_ai_tools_db_v3';
const SETTINGS_STORAGE_KEY = 'nextgen_ai_settings_v3';
const CATEGORIES_STORAGE_KEY = 'nextgen_ai_categories_v3';
const TUTORIALS_STORAGE_KEY = 'nextgen_ai_tutorials_v3';
const GUIDES_STORAGE_KEY = 'nextgen_ai_income_guides_v3';
const ARTICLES_STORAGE_KEY = 'nextgen_ai_articles_v3';
const ADMIN_SESSION_TOKEN_KEY = 'nextgen_admin_session_token';
const ADMIN_USER_KEY = 'nextgen_admin_profile';

type ChangeListener = () => void;
const listeners: Set<ChangeListener> = new Set();

function notifyListeners() {
  listeners.forEach(fn => {
    try { fn(); } catch (err) { console.error('Storage listener error:', err); }
  });
}

export function subscribeToToolStorage(listener: ChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export class ToolStorageService {
  // Sync data with server on application launch
  static async syncWithServer(): Promise<void> {
    try {
      const [toolsRes, catRes, tutRes, guideRes, artRes, settingsRes] = await Promise.allSettled([
        fetch('/api/public/tools').then(r => r.ok ? r.json() : null),
        fetch('/api/public/categories').then(r => r.ok ? r.json() : null),
        fetch('/api/public/tutorials').then(r => r.ok ? r.json() : null),
        fetch('/api/public/income-guides').then(r => r.ok ? r.json() : null),
        fetch('/api/public/articles').then(r => r.ok ? r.json() : null),
        fetch('/api/public/settings').then(r => r.ok ? r.json() : null)
      ]);

      if (toolsRes.status === 'fulfilled' && toolsRes.value) {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(toolsRes.value));
      }
      if (catRes.status === 'fulfilled' && catRes.value) {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(catRes.value));
      }
      if (tutRes.status === 'fulfilled' && tutRes.value) {
        localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(tutRes.value));
      }
      if (guideRes.status === 'fulfilled' && guideRes.value) {
        localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(guideRes.value));
      }
      if (artRes.status === 'fulfilled' && artRes.value) {
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(artRes.value));
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value) {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsRes.value));
      }

      notifyListeners();
    } catch {
      // Offline fallback: use local initial state
    }
  }

  // ================= TOOLS =================

  static getTools(includeUnpublished = false): ToolItem[] {
    try {
      const data = localStorage.getItem(TOOLS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(INITIAL_TOOLS));
        return includeUnpublished ? INITIAL_TOOLS : INITIAL_TOOLS.filter(t => t.isPublished);
      }
      const tools: ToolItem[] = JSON.parse(data);
      return includeUnpublished ? tools : tools.filter(t => t.isPublished);
    } catch {
      return includeUnpublished ? INITIAL_TOOLS : INITIAL_TOOLS.filter(t => t.isPublished);
    }
  }

  static getFeaturedTools(): ToolItem[] {
    const all = this.getTools(false);
    return all.filter(t => t.isFeatured).sort((a, b) => a.order - b.order);
  }

  static getToolBySlug(slug: string): ToolItem | undefined {
    const all = this.getTools(true);
    const clean = slug.toLowerCase().trim();
    return all.find(t => t.slug.toLowerCase() === clean);
  }

  static getToolById(id: string): ToolItem | undefined {
    const all = this.getTools(true);
    return all.find(t => t.id === id);
  }

  static saveTool(toolData: Partial<ToolItem> & { name: string }): ToolItem {
    const all = this.getTools(true);
    const now = new Date().toISOString();
    let savedTool: ToolItem;

    if (toolData.id) {
      const index = all.findIndex(t => t.id === toolData.id);
      if (index >= 0) {
        savedTool = {
          ...all[index],
          ...toolData,
          updatedAt: now
        };
        all[index] = savedTool;
      } else {
        savedTool = {
          ...this.getDefaultToolTemplate(toolData.name),
          ...toolData,
          id: toolData.id,
          createdAt: now,
          updatedAt: now
        };
        all.push(savedTool);
      }
    } else {
      const slug = toolData.slug || toolData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = slug || `tool-${Date.now()}`;
      savedTool = {
        ...this.getDefaultToolTemplate(toolData.name),
        ...toolData,
        id,
        slug,
        order: all.length + 1,
        createdAt: now,
        updatedAt: now
      };
      all.push(savedTool);
    }

    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();

    // Persist to backend server if admin session token exists
    const token = this.getAuthToken();
    if (token) {
      fetch('/api/admin/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(savedTool)
      }).catch(err => console.error('Error saving tool to server:', err));
    }

    return savedTool;
  }

  static deleteTool(id: string): boolean {
    const all = this.getTools(true);
    const filtered = all.filter(t => t.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();

      const token = this.getAuthToken();
      if (token) {
        fetch(`/api/admin/tools/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.error('Error deleting tool from server:', err));
      }
      return true;
    }
    return false;
  }

  static toggleFeatured(id: string): boolean {
    const all = this.getTools(true);
    const tool = all.find(t => t.id === id);
    if (!tool) return false;
    tool.isFeatured = !tool.isFeatured;
    tool.updatedAt = new Date().toISOString();
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();

    const token = this.getAuthToken();
    if (token) {
      fetch('/api/admin/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tool)
      }).catch(err => console.error('Error updating tool to server:', err));
    }

    return tool.isFeatured;
  }

  static togglePublished(id: string): boolean {
    const all = this.getTools(true);
    const tool = all.find(t => t.id === id);
    if (!tool) return false;
    tool.isPublished = !tool.isPublished;
    tool.updatedAt = new Date().toISOString();
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();

    const token = this.getAuthToken();
    if (token) {
      fetch('/api/admin/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tool)
      }).catch(err => console.error('Error updating tool to server:', err));
    }

    return tool.isPublished;
  }

  private static getDefaultToolTemplate(name: string): ToolItem {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
      id: slug || `tool-${Date.now()}`,
      slug,
      name,
      shortDescription: `A powerful AI assistant for writing, research, and productivity.`,
      websiteUrl: 'https://example.com',
      pricingStatus: 'Free Plan Available',
      pricingDetails: 'Free tier available with core capabilities. Optional paid plan unlocks advanced features.',
      iconType: 'custom',
      category: 'General',
      tags: ['AI', 'Productivity'],
      isFeatured: false,
      isPublished: true,
      order: 99,
      intro: `${name} is an artificial intelligence assistant created to improve productivity and streamline creative workflows.`,
      whatIsUsedFor: 'Brainstorming, draft generation, researching unfamiliar topics, and everyday assistance.',
      keyFeatures: [
        'Natural conversational interface',
        'Multi-step workflow assistance',
        'Beginner-friendly guidance'
      ],
      freePlanLimitations: {
        summary: 'Free tier includes standard features with usage limits during peak periods.',
        details: [
          'Standard response speeds',
          'Daily generation limits',
          'Basic customer support'
        ]
      },
      beginnerGuide: [
        {
          stepNumber: 1,
          title: 'Sign Up',
          description: 'Visit the official website and register for a free account.'
        },
        {
          stepNumber: 2,
          title: 'Enter Your Prompt',
          description: 'Be specific about what you need and provide context for best results.'
        }
      ],
      examplePrompts: [
        {
          title: 'Draft an Introduction',
          category: 'Writing',
          prompt: 'Write an engaging introductory paragraph about the benefits of AI in digital education.'
        }
      ],
      advantages: [
        'Easy to learn for beginners',
        'High versatility across multiple tasks',
        'Generous free starter plan'
      ],
      limitations: [
        'Occasional inaccuracies on niche topics',
        'Requires clear, structured prompting'
      ],
      incomeAndFreelancing: {
        title: 'Freelance Research & Writing Support',
        description: 'Use this tool to outline client articles, draft summaries, and proofread content faster.',
        tactics: [
          'Generate comprehensive research outlines for blog clients',
          'Proofread and polish client documents 3x faster'
        ]
      },
      relatedToolSlugs: ['chatgpt', 'gemini', 'claude'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // ================= CATEGORIES =================

  static getCategories(): CategoryItem[] {
    try {
      const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
        return INITIAL_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  static saveCategory(category: CategoryItem): CategoryItem {
    const all = this.getCategories();
    const idx = all.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      all[idx] = category;
    } else {
      all.push(category);
    }
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();

    const token = this.getAuthToken();
    if (token) {
      fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(category)
      }).catch(err => console.error('Error saving category to server:', err));
    }

    return category;
  }

  static deleteCategory(id: string): boolean {
    const all = this.getCategories();
    const filtered = all.filter(c => c.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();

      const token = this.getAuthToken();
      if (token) {
        fetch(`/api/admin/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.error('Error deleting category from server:', err));
      }

      return true;
    }
    return false;
  }

  // ================= TUTORIALS =================

  static getTutorials(includeUnpublished = false): TutorialItem[] {
    try {
      const data = localStorage.getItem(TUTORIALS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(INITIAL_TUTORIALS));
        return includeUnpublished ? INITIAL_TUTORIALS : INITIAL_TUTORIALS.filter(t => t.isPublished);
      }
      const list: TutorialItem[] = JSON.parse(data);
      return includeUnpublished ? list : list.filter(t => t.isPublished);
    } catch {
      return includeUnpublished ? INITIAL_TUTORIALS : INITIAL_TUTORIALS.filter(t => t.isPublished);
    }
  }

  static saveTutorial(tut: TutorialItem): TutorialItem {
    const all = this.getTutorials(true);
    const now = new Date().toISOString();
    let saved: TutorialItem;
    const idx = all.findIndex(t => t.id === tut.id);
    if (idx >= 0) {
      saved = { ...tut, updatedAt: now };
      all[idx] = saved;
    } else {
      saved = {
        ...tut,
        id: tut.id || `tut-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      all.push(saved);
    }
    localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();

    const token = this.getAuthToken();
    if (token) {
      fetch('/api/admin/tutorials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saved)
      }).catch(err => console.error('Error saving tutorial to server:', err));
    }

    return saved;
  }

  static deleteTutorial(id: string): boolean {
    const all = this.getTutorials(true);
    const filtered = all.filter(t => t.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();

      const token = this.getAuthToken();
      if (token) {
        fetch(`/api/admin/tutorials/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.error('Error deleting tutorial from server:', err));
      }

      return true;
    }
    return false;
  }

  // ================= INCOME GUIDES =================

  static getIncomeGuides(includeUnpublished = false): IncomeGuideItem[] {
    try {
      const data = localStorage.getItem(GUIDES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(INITIAL_INCOME_GUIDES));
        return includeUnpublished ? INITIAL_INCOME_GUIDES : INITIAL_INCOME_GUIDES.filter(g => g.isPublished);
      }
      const list: IncomeGuideItem[] = JSON.parse(data);
      return includeUnpublished ? list : list.filter(g => g.isPublished);
    } catch {
      return includeUnpublished ? INITIAL_INCOME_GUIDES : INITIAL_INCOME_GUIDES.filter(g => g.isPublished);
    }
  }

  static saveIncomeGuide(guide: IncomeGuideItem): IncomeGuideItem {
    const all = this.getIncomeGuides(true);
    const now = new Date().toISOString();
    let saved: IncomeGuideItem;
    const idx = all.findIndex(g => g.id === guide.id);
    if (idx >= 0) {
      saved = { ...guide, updatedAt: now };
      all[idx] = saved;
    } else {
      saved = {
        ...guide,
        id: guide.id || `guide-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      all.push(saved);
    }
    localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();

    const token = this.getAuthToken();
    if (token) {
      fetch('/api/admin/income-guides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saved)
      }).catch(err => console.error('Error saving income guide to server:', err));
    }

    return saved;
  }

  static deleteIncomeGuide(id: string): boolean {
    const all = this.getIncomeGuides(true);
    const filtered = all.filter(g => g.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();

      const token = this.getAuthToken();
      if (token) {
        fetch(`/api/admin/income-guides/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.error('Error deleting income guide from server:', err));
      }

      return true;
    }
    return false;
  }

  // ================= ARTICLES =================

  static getArticles(includeUnpublished = false): ArticleItem[] {
    try {
      const data = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
        return includeUnpublished ? INITIAL_ARTICLES : INITIAL_ARTICLES.filter(a => a.isPublished);
      }
      const list: ArticleItem[] = JSON.parse(data);
      return includeUnpublished ? list : list.filter(a => a.isPublished);
    } catch {
      return includeUnpublished ? INITIAL_ARTICLES : INITIAL_ARTICLES.filter(a => a.isPublished);
    }
  }

  static saveArticle(article: Partial<ArticleItem> & { title: string }): ArticleItem {
    const all = this.getArticles(true);
    const now = new Date().toISOString();
    let saved: ArticleItem;

    if (article.id) {
      const idx = all.findIndex(a => a.id === article.id);
      if (idx >= 0) {
        saved = { ...all[idx], ...article, updatedAt: now } as ArticleItem;
        all[idx] = saved;
      } else {
        saved = {
          id: article.id,
          slug: article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: article.title,
          category: article.category || 'General',
          summary: article.summary || '',
          content: article.content || '',
          author: article.author || 'NextGen Team',
          readTime: article.readTime || '4 min read',
          isPublished: article.isPublished ?? true,
          createdAt: now,
          updatedAt: now
        };
        all.push(saved);
      }
    } else {
      const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      saved = {
        id: `art-${Date.now()}`,
        slug,
        title: article.title,
        category: article.category || 'General',
        summary: article.summary || '',
        content: article.content || '',
        author: article.author || 'NextGen Team',
        readTime: article.readTime || '4 min read',
        isPublished: article.isPublished ?? true,
        createdAt: now,
        updatedAt: now
      };
      all.push(saved);
    }

    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();

    const token = this.getAuthToken();
    if (token) {
      fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saved)
      }).catch(err => console.error('Error saving article to server:', err));
    }

    return saved;
  }

  static deleteArticle(id: string): boolean {
    const all = this.getArticles(true);
    const filtered = all.filter(a => a.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();

      const token = this.getAuthToken();
      if (token) {
        fetch(`/api/admin/articles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.error('Error deleting article from server:', err));
      }

      return true;
    }
    return false;
  }

  // ================= SETTINGS =================

  static getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SITE_SETTINGS));
        return INITIAL_SITE_SETTINGS;
      }
      return { ...INITIAL_SITE_SETTINGS, ...JSON.parse(data) };
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  }

  static saveSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    notifyListeners();

    const token = this.getAuthToken();
    if (token) {
      fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updated)
      }).catch(err => console.error('Error saving settings to server:', err));
    }

    return updated;
  }

  static resetToDefaults(): void {
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(INITIAL_TOOLS));
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SITE_SETTINGS));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(INITIAL_TUTORIALS));
    localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(INITIAL_INCOME_GUIDES));
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
    notifyListeners();
  }

  // ================= SECURE BACKEND AUTHENTICATION =================

  static getAuthToken(): string | null {
    return sessionStorage.getItem(ADMIN_SESSION_TOKEN_KEY) || localStorage.getItem(ADMIN_SESSION_TOKEN_KEY);
  }

  static getAdminUser(): AdminUser | null {
    try {
      const raw = sessionStorage.getItem(ADMIN_USER_KEY) || localStorage.getItem(ADMIN_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static isAdminLoggedIn(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  // Check backend server auth status
  static async checkAuthStatus(): Promise<{
    isConfigured: boolean;
    isAuthenticated: boolean;
    user: AdminUser | null;
  }> {
    try {
      const token = this.getAuthToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/auth/status', { headers });
      if (!res.ok) {
        return { isConfigured: true, isAuthenticated: false, user: null };
      }

      const data = await res.json();
      if (!data.isAuthenticated) {
        // Clear expired or invalidated session
        sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_USER_KEY);
        localStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
      }

      return {
        isConfigured: data.isConfigured !== false,
        isAuthenticated: !!data.isAuthenticated,
        user: data.user ? {
          email: data.user.email,
          role: data.user.role || 'Super Administrator',
          token: token || '',
          loginTime: new Date().toISOString()
        } : null
      };
    } catch {
      // Offline fallback
      return {
        isConfigured: true,
        isAuthenticated: this.isAdminLoggedIn(),
        user: this.getAdminUser()
      };
    }
  }

  // Setup First Administrator (One-time, only if no admin exists)
  static async setupFirstAdmin(email: string, pass: string, confirmPass: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const res = await fetch('/api/auth/setup-first-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: pass,
          confirmPassword: confirmPass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Failed to initialize administrator account.' };
      }

      const user: AdminUser = {
        email: data.user.email,
        role: 'Super Administrator',
        token: data.token,
        loginTime: new Date().toISOString()
      };

      sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, data.token);
      sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      localStorage.setItem(ADMIN_SESSION_TOKEN_KEY, data.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));

      notifyListeners();
      return { success: true };
    } catch {
      return { success: false, message: 'Server communication error. Please try again.' };
    }
  }

  // Login Administrator with real server verification
  static async loginAdmin(email: string, pass: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: pass
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { 
          success: false, 
          message: data.error || 'Invalid email or password.' 
        };
      }

      const user: AdminUser = {
        email: data.user.email,
        role: 'Super Administrator',
        token: data.token,
        loginTime: new Date().toISOString()
      };

      sessionStorage.setItem(ADMIN_SESSION_TOKEN_KEY, data.token);
      sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      localStorage.setItem(ADMIN_SESSION_TOKEN_KEY, data.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));

      notifyListeners();
      return { success: true };
    } catch {
      return { 
        success: false, 
        message: 'Invalid email or password.' 
      };
    }
  }

  // Logout Administrator
  static async logoutAdmin(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {
        // Ignore network errors on logout
      }
    }

    sessionStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_SESSION_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    notifyListeners();
  }
}
