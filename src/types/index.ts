export type PricingLabel = 
  | 'Free'
  | 'Free Plan Available'
  | 'Freemium'
  | 'Paid'
  | 'Pricing not verified';

export interface BeginnerStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface ExamplePrompt {
  title: string;
  category: string;
  prompt: string;
}

export interface FreePlanLimitations {
  summary: string;
  details: string[];
}

export interface IncomeStrategy {
  title: string;
  description: string;
  tactics: string[];
}

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  websiteUrl: string;
  pricingStatus: PricingLabel;
  pricingDetails: string;
  iconType: 'chatgpt' | 'gemini' | 'claude' | 'copilot' | 'perplexity' | 'duck-ai' | 'meta-ai' | 'custom';
  iconUrl?: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  
  // Detail page comprehensive content
  intro: string;
  whatIsUsedFor: string;
  keyFeatures: string[];
  freePlanLimitations: FreePlanLimitations;
  beginnerGuide: BeginnerStep[];
  examplePrompts: ExamplePrompt[];
  advantages: string[];
  limitations: string[];
  incomeAndFreelancing: IncomeStrategy;
  relatedToolSlugs: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  order: number;
}

export interface TutorialItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  toolSlug: string;
  toolName: string;
  category: string;
  readTime: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    codeOrPrompt?: string;
  }[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeGuideItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedEarnings: string;
  summary: string;
  recommendedTools: string[];
  executionSteps: string[];
  deliverableExample: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  readTime: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  siteName: string;
  heroHeadline: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  searchSubtitle: string;
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
  footerBio: string;
  contactEmail: string;
  socialTwitter: string;
  socialGithub: string;
  seoTitle: string;
  seoDescription: string;
}

export interface AdminUser {
  email: string;
  role: string;
  token: string;
  loginTime: string;
}
