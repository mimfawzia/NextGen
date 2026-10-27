import fs from 'node:fs';
import path from 'node:path';
import { 
  ToolItem, 
  SiteSettings, 
  CategoryItem, 
  TutorialItem, 
  IncomeGuideItem, 
  ArticleItem,
  PromptItem 
} from '../types';
import { 
  INITIAL_TOOLS, 
  INITIAL_SITE_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_TUTORIALS, 
  INITIAL_INCOME_GUIDES, 
  INITIAL_ARTICLES,
  INITIAL_PROMPTS,
  INITIAL_ADMIN
} from '../data/initialTools';

interface AdminRecord {
  email: string;
  salt: string;
  hash: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface ServerDatabase {
  admin: AdminRecord | null;
  tools: ToolItem[];
  categories: CategoryItem[];
  tutorials: TutorialItem[];
  incomeGuides: IncomeGuideItem[];
  articles: ArticleItem[];
  prompts: PromptItem[];
  settings: SiteSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'server_db.json');

class DatabaseManager {
  private data: ServerDatabase;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): ServerDatabase {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.admin || !parsed.admin.email || !parsed.admin.hash) {
          parsed.admin = INITIAL_ADMIN;
        }
        if (!parsed.prompts || !Array.isArray(parsed.prompts) || parsed.prompts.length === 0) {
          parsed.prompts = INITIAL_PROMPTS;
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to load database from disk, using initial state:', err);
    }

    // Default seeded state
    const initialDb: ServerDatabase = {
      admin: INITIAL_ADMIN,
      tools: INITIAL_TOOLS,
      categories: INITIAL_CATEGORIES,
      tutorials: INITIAL_TUTORIALS,
      incomeGuides: INITIAL_INCOME_GUIDES,
      articles: INITIAL_ARTICLES,
      prompts: INITIAL_PROMPTS,
      settings: INITIAL_SITE_SETTINGS
    };

    this.persist(initialDb);
    return initialDb;
  }

  private persist(dbData = this.data): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to write database to disk (e.g. read-only serverless environment):', err);
    }
  }

  // ================= ADMIN ACCOUNT =================

  public getAdmin(): AdminRecord | null {
    return this.data.admin;
  }

  public isAdminConfigured(): boolean {
    return this.data.admin !== null && !!this.data.admin.hash;
  }

  public setAdmin(email: string, salt: string, hash: string): void {
    this.data.admin = {
      email: email.toLowerCase().trim(),
      salt,
      hash,
      createdAt: new Date().toISOString()
    };
    this.persist();
  }

  public updateAdminPassword(salt: string, hash: string): void {
    if (this.data.admin) {
      this.data.admin.salt = salt;
      this.data.admin.hash = hash;
      this.persist();
    }
  }

  public updateLastLogin(): void {
    if (this.data.admin) {
      this.data.admin.lastLoginAt = new Date().toISOString();
      this.persist();
    }
  }

  // ================= TOOLS =================

  public getTools(includeUnpublished = false): ToolItem[] {
    if (includeUnpublished) return this.data.tools;
    return this.data.tools.filter(t => t.isPublished);
  }

  public getToolBySlug(slug: string): ToolItem | undefined {
    const clean = slug.toLowerCase().trim();
    return this.data.tools.find(t => t.slug.toLowerCase() === clean);
  }

  public saveTool(toolData: Partial<ToolItem> & { name: string }): ToolItem {
    const all = this.data.tools;
    const now = new Date().toISOString();
    let saved: ToolItem;

    if (toolData.id) {
      const idx = all.findIndex(t => t.id === toolData.id);
      if (idx >= 0) {
        saved = {
          ...all[idx],
          ...toolData,
          updatedAt: now
        };
        all[idx] = saved;
      } else {
        saved = {
          id: toolData.id,
          slug: toolData.slug || toolData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: toolData.name,
          shortDescription: toolData.shortDescription || '',
          websiteUrl: toolData.websiteUrl || '',
          pricingStatus: toolData.pricingStatus || 'Free',
          pricingDetails: toolData.pricingDetails || '',
          iconType: toolData.iconType || 'custom',
          category: toolData.category || 'General',
          tags: toolData.tags || [],
          isFeatured: !!toolData.isFeatured,
          isPublished: toolData.isPublished !== false,
          order: toolData.order || all.length + 1,
          intro: toolData.intro || '',
          whatIsUsedFor: toolData.whatIsUsedFor || '',
          keyFeatures: toolData.keyFeatures || [],
          freePlanLimitations: toolData.freePlanLimitations || { summary: '', details: [] },
          beginnerGuide: toolData.beginnerGuide || [],
          examplePrompts: toolData.examplePrompts || [],
          advantages: toolData.advantages || [],
          limitations: toolData.limitations || [],
          incomeAndFreelancing: toolData.incomeAndFreelancing || { title: '', description: '', tactics: [] },
          relatedToolSlugs: toolData.relatedToolSlugs || [],
          createdAt: now,
          updatedAt: now
        };
        all.push(saved);
      }
    } else {
      const slug = toolData.slug || toolData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      saved = {
        id: slug || `tool-${Date.now()}`,
        slug,
        name: toolData.name,
        shortDescription: toolData.shortDescription || '',
        websiteUrl: toolData.websiteUrl || '',
        pricingStatus: toolData.pricingStatus || 'Free',
        pricingDetails: toolData.pricingDetails || '',
        iconType: toolData.iconType || 'custom',
        category: toolData.category || 'General',
        tags: toolData.tags || [],
        isFeatured: !!toolData.isFeatured,
        isPublished: toolData.isPublished !== false,
        order: all.length + 1,
        intro: toolData.intro || '',
        whatIsUsedFor: toolData.whatIsUsedFor || '',
        keyFeatures: toolData.keyFeatures || [],
        freePlanLimitations: toolData.freePlanLimitations || { summary: '', details: [] },
        beginnerGuide: toolData.beginnerGuide || [],
        examplePrompts: toolData.examplePrompts || [],
        advantages: toolData.advantages || [],
        limitations: toolData.limitations || [],
        incomeAndFreelancing: toolData.incomeAndFreelancing || { title: '', description: '', tactics: [] },
        relatedToolSlugs: toolData.relatedToolSlugs || [],
        createdAt: now,
        updatedAt: now
      };
      all.push(saved);
    }

    this.persist();
    return saved;
  }

  public deleteTool(id: string): boolean {
    const initialLen = this.data.tools.length;
    this.data.tools = this.data.tools.filter(t => t.id !== id);
    if (this.data.tools.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // ================= CATEGORIES =================

  public getCategories(): CategoryItem[] {
    return this.data.categories;
  }

  public saveCategory(category: CategoryItem): CategoryItem {
    const all = this.data.categories;
    const idx = all.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      all[idx] = category;
    } else {
      all.push(category);
    }
    this.persist();
    return category;
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // ================= TUTORIALS =================

  public getTutorials(includeUnpublished = false): TutorialItem[] {
    if (includeUnpublished) return this.data.tutorials;
    return this.data.tutorials.filter(t => t.isPublished);
  }

  public saveTutorial(tut: TutorialItem): TutorialItem {
    const all = this.data.tutorials;
    const now = new Date().toISOString();
    const idx = all.findIndex(t => t.id === tut.id);
    let saved: TutorialItem;
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
    this.persist();
    return saved;
  }

  public deleteTutorial(id: string): boolean {
    const initialLen = this.data.tutorials.length;
    this.data.tutorials = this.data.tutorials.filter(t => t.id !== id);
    if (this.data.tutorials.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // ================= INCOME GUIDES =================

  public getIncomeGuides(includeUnpublished = false): IncomeGuideItem[] {
    if (includeUnpublished) return this.data.incomeGuides;
    return this.data.incomeGuides.filter(g => g.isPublished);
  }

  public saveIncomeGuide(guide: IncomeGuideItem): IncomeGuideItem {
    const all = this.data.incomeGuides;
    const now = new Date().toISOString();
    const idx = all.findIndex(g => g.id === guide.id);
    let saved: IncomeGuideItem;
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
    this.persist();
    return saved;
  }

  public deleteIncomeGuide(id: string): boolean {
    const initialLen = this.data.incomeGuides.length;
    this.data.incomeGuides = this.data.incomeGuides.filter(g => g.id !== id);
    if (this.data.incomeGuides.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // ================= ARTICLES =================

  public getArticles(includeUnpublished = false): ArticleItem[] {
    if (includeUnpublished) return this.data.articles;
    return this.data.articles.filter(a => a.isPublished);
  }

  public saveArticle(art: ArticleItem): ArticleItem {
    const all = this.data.articles;
    const now = new Date().toISOString();
    const idx = all.findIndex(a => a.id === art.id);
    let saved: ArticleItem;
    if (idx >= 0) {
      saved = { ...art, updatedAt: now };
      all[idx] = saved;
    } else {
      saved = {
        ...art,
        id: art.id || `art-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      all.push(saved);
    }
    this.persist();
    return saved;
  }

  public deleteArticle(id: string): boolean {
    const initialLen = this.data.articles.length;
    this.data.articles = this.data.articles.filter(a => a.id !== id);
    if (this.data.articles.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // ================= PROMPTS VAULT =================

  public getPrompts(includeUnpublished = false): PromptItem[] {
    const list = this.data.prompts || INITIAL_PROMPTS;
    if (includeUnpublished) return list;
    return list.filter(p => p.isPublished);
  }

  public getPromptById(id: string): PromptItem | undefined {
    const list = this.data.prompts || INITIAL_PROMPTS;
    return list.find(p => p.id === id);
  }

  public savePrompt(prompt: PromptItem): PromptItem {
    if (!this.data.prompts) {
      this.data.prompts = [...INITIAL_PROMPTS];
    }
    const all = this.data.prompts;
    const now = new Date().toISOString();
    const idx = all.findIndex(p => p.id === prompt.id);
    let saved: PromptItem;
    if (idx >= 0) {
      saved = { ...prompt, updatedAt: now };
      all[idx] = saved;
    } else {
      saved = {
        ...prompt,
        id: prompt.id || `prompt-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      };
      all.push(saved);
    }
    this.persist();
    return saved;
  }

  public deletePrompt(id: string): boolean {
    if (!this.data.prompts) {
      this.data.prompts = [...INITIAL_PROMPTS];
    }
    const initialLen = this.data.prompts.length;
    this.data.prompts = this.data.prompts.filter(p => p.id !== id);
    if (this.data.prompts.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // ================= SETTINGS =================

  public getSettings(): SiteSettings {
    return { ...INITIAL_SITE_SETTINGS, ...this.data.settings };
  }

  public saveSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    this.data.settings = { ...INITIAL_SITE_SETTINGS, ...this.data.settings, ...newSettings };
    this.persist();
    return this.data.settings;
  }
}

export const serverDb = new DatabaseManager();
