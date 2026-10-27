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
const ADMIN_AUTH_KEY = 'nextgen_admin_auth_user_v3';

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
    return savedTool;
  }

  static deleteTool(id: string): boolean {
    const all = this.getTools(true);
    const filtered = all.filter(t => t.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();
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
      pricingDetails: 'Free plan with standard features. Optional subscription available.',
      iconType: 'custom',
      category: 'Conversational & Writing',
      tags: ['AI', 'Assistant', 'Beginner Friendly'],
      isFeatured: false,
      isPublished: true,
      order: 99,
      intro: `${name} is an artificial intelligence tool designed to streamline everyday digital tasks and help beginners build new skills.`,
      whatIsUsedFor: 'Drafting text, answering questions, organizing notes, and learning new concepts.',
      keyFeatures: [
        'Natural language conversation interface',
        'Fast response generation',
        'Easy-to-use search and prompt options'
      ],
      freePlanLimitations: {
        summary: 'Free tier available with reasonable fair-use limits.',
        details: [
          'Basic features included without payment',
          'Higher capacity or advanced modes require a subscription'
        ]
      },
      beginnerGuide: [
        {
          stepNumber: 1,
          title: 'Visit Official Website',
          description: 'Open the tool in your web browser and sign up if prompted.'
        },
        {
          stepNumber: 2,
          title: 'Type a Clear Prompt',
          description: 'Describe what you want to achieve with specific context and desired tone.'
        },
        {
          stepNumber: 3,
          title: 'Review and Refine',
          description: 'Iterate on the response with follow-up instructions to fit your exact needs.'
        }
      ],
      examplePrompts: [
        {
          title: 'Summarize Text',
          category: 'Everyday Work',
          prompt: 'Please summarize the following text into 3 key takeaways: [Insert text]'
        },
        {
          title: 'Draft a Friendly Email',
          category: 'Communication',
          prompt: 'Draft a warm, polite email thanking a colleague for their help on our project.'
        }
      ],
      advantages: [
        'Simple and beginner friendly',
        'Works right inside modern browsers'
      ],
      limitations: [
        'Always verify critical facts before relying on generated output'
      ],
      incomeAndFreelancing: {
        title: 'Freelance & Online Income Ideas',
        description: `Leverage ${name} to boost speed and quality across independent client work.`,
        tactics: [
          'Speeding up client research and draft preparation',
          'Polishing customer communications and proposals'
        ]
      },
      relatedToolSlugs: ['chatgpt', 'gemini'],
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
    return category;
  }

  static deleteCategory(id: string): boolean {
    const all = this.getCategories();
    const filtered = all.filter(c => c.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();
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

  static getTutorialBySlug(slug: string): TutorialItem | undefined {
    const all = this.getTutorials(true);
    return all.find(t => t.slug.toLowerCase() === slug.toLowerCase());
  }

  static saveTutorial(tutorial: Partial<TutorialItem> & { title: string }): TutorialItem {
    const all = this.getTutorials(true);
    const now = new Date().toISOString();
    let saved: TutorialItem;

    if (tutorial.id) {
      const idx = all.findIndex(t => t.id === tutorial.id);
      if (idx >= 0) {
        saved = { ...all[idx], ...tutorial, updatedAt: now };
        all[idx] = saved;
      } else {
        saved = {
          id: tutorial.id,
          slug: tutorial.slug || tutorial.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: tutorial.title,
          summary: tutorial.summary || '',
          toolSlug: tutorial.toolSlug || 'chatgpt',
          toolName: tutorial.toolName || 'ChatGPT',
          category: tutorial.category || 'General',
          readTime: tutorial.readTime || '5 min read',
          steps: tutorial.steps || [],
          isPublished: tutorial.isPublished ?? true,
          createdAt: now,
          updatedAt: now
        };
        all.push(saved);
      }
    } else {
      const slug = tutorial.slug || tutorial.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      saved = {
        id: `tut-${Date.now()}`,
        slug,
        title: tutorial.title,
        summary: tutorial.summary || '',
        toolSlug: tutorial.toolSlug || 'chatgpt',
        toolName: tutorial.toolName || 'ChatGPT',
        category: tutorial.category || 'General',
        readTime: tutorial.readTime || '5 min read',
        steps: tutorial.steps || [],
        isPublished: tutorial.isPublished ?? true,
        createdAt: now,
        updatedAt: now
      };
      all.push(saved);
    }

    localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();
    return saved;
  }

  static deleteTutorial(id: string): boolean {
    const all = this.getTutorials(true);
    const filtered = all.filter(t => t.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();
      return true;
    }
    return false;
  }

  static toggleTutorialPublished(id: string): boolean {
    const all = this.getTutorials(true);
    const item = all.find(t => t.id === id);
    if (!item) return false;
    item.isPublished = !item.isPublished;
    item.updatedAt = new Date().toISOString();
    localStorage.setItem(TUTORIALS_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();
    return item.isPublished;
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

  static saveIncomeGuide(guide: Partial<IncomeGuideItem> & { title: string }): IncomeGuideItem {
    const all = this.getIncomeGuides(true);
    const now = new Date().toISOString();
    let saved: IncomeGuideItem;

    if (guide.id) {
      const idx = all.findIndex(g => g.id === guide.id);
      if (idx >= 0) {
        saved = { ...all[idx], ...guide, updatedAt: now };
        all[idx] = saved;
      } else {
        saved = {
          id: guide.id,
          slug: guide.slug || guide.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          title: guide.title,
          category: guide.category || 'Freelancing',
          difficulty: guide.difficulty || 'Beginner',
          estimatedEarnings: guide.estimatedEarnings || '$25 – $50 / hr',
          summary: guide.summary || '',
          recommendedTools: guide.recommendedTools || ['ChatGPT'],
          executionSteps: guide.executionSteps || [],
          deliverableExample: guide.deliverableExample || '',
          isPublished: guide.isPublished ?? true,
          createdAt: now,
          updatedAt: now
        };
        all.push(saved);
      }
    } else {
      const slug = guide.slug || guide.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      saved = {
        id: `guide-${Date.now()}`,
        slug,
        title: guide.title,
        category: guide.category || 'Freelancing',
        difficulty: guide.difficulty || 'Beginner',
        estimatedEarnings: guide.estimatedEarnings || '$25 – $50 / hr',
        summary: guide.summary || '',
        recommendedTools: guide.recommendedTools || ['ChatGPT'],
        executionSteps: guide.executionSteps || [],
        deliverableExample: guide.deliverableExample || '',
        isPublished: guide.isPublished ?? true,
        createdAt: now,
        updatedAt: now
      };
      all.push(saved);
    }

    localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();
    return saved;
  }

  static deleteIncomeGuide(id: string): boolean {
    const all = this.getIncomeGuides(true);
    const filtered = all.filter(g => g.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();
      return true;
    }
    return false;
  }

  static toggleIncomeGuidePublished(id: string): boolean {
    const all = this.getIncomeGuides(true);
    const item = all.find(g => g.id === id);
    if (!item) return false;
    item.isPublished = !item.isPublished;
    item.updatedAt = new Date().toISOString();
    localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();
    return item.isPublished;
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
        saved = { ...all[idx], ...article, updatedAt: now };
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
    return saved;
  }

  static deleteArticle(id: string): boolean {
    const all = this.getArticles(true);
    const filtered = all.filter(a => a.id !== id);
    if (filtered.length !== all.length) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(filtered));
      notifyListeners();
      return true;
    }
    return false;
  }

  static toggleArticlePublished(id: string): boolean {
    const all = this.getArticles(true);
    const item = all.find(a => a.id === id);
    if (!item) return false;
    item.isPublished = !item.isPublished;
    item.updatedAt = new Date().toISOString();
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(all));
    notifyListeners();
    return item.isPublished;
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

  // ================= ADMIN AUTHENTICATION =================

  static getAdminUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem(ADMIN_AUTH_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static isAdminLoggedIn(): boolean {
    const user = this.getAdminUser();
    return user !== null && !!user.token;
  }

  static loginAdmin(email: string, pass: string): { success: boolean; message?: string } {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = pass.trim();

    // Default administrator accounts
    const validCredentials = [
      { email: 'admin@nextgenai.guide', pass: 'admin2026' },
      { email: 'admin@nextgen.com', pass: 'admin2026' },
      { email: 'admin', pass: 'admin2026' },
      { email: 'mimfawzia6@gmail.com', pass: 'admin2026' }
    ];

    const match = validCredentials.find(c => 
      (c.email === cleanEmail || cleanEmail === 'admin') && c.pass === cleanPass
    );

    if (match || (cleanEmail && cleanPass === 'admin2026')) {
      const user: AdminUser = {
        email: cleanEmail.includes('@') ? cleanEmail : 'admin@nextgenai.guide',
        role: 'Super Administrator',
        token: `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(user));
      notifyListeners();
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Invalid credentials. Please enter a valid administrator email and password.' 
    };
  }

  static logoutAdmin(): void {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    notifyListeners();
  }
}
