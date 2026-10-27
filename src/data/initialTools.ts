import { 
  ToolItem, 
  SiteSettings, 
  CategoryItem, 
  TutorialItem, 
  IncomeGuideItem, 
  ArticleItem, 
  PromptItem 
} from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'NextGen AI Guide',
  heroHeadline: 'Discover AI. Unlock Your Potential.',
  heroSubtitle: 'Explore powerful AI tools, learn step by step, and discover practical ways to build digital skills and earn online.',
  searchPlaceholder: 'Search AI tools, tutorials, or income guides...',
  searchSubtitle: 'Find the right AI tool for your next idea.',
  featuredSectionTitle: 'Featured AI Tools',
  featuredSectionSubtitle: 'Start with these trusted, battle-tested assistants to write, research, code, and brainstorm.',
  footerBio: 'NextGen AI Guide is an independent, beginner-friendly discovery platform helping people learn AI tools, build digital skills, and unlock online earning opportunities.',
  contactEmail: 'hello@nextgenai.guide',
  socialTwitter: 'https://twitter.com',
  socialGithub: 'https://github.com',
  seoTitle: 'NextGen AI Guide — Discover AI. Unlock Your Potential.',
  seoDescription: 'Explore powerful AI tools, learn step by step, and discover practical ways to build digital skills and earn online.',
  coverPhoto: {
    enabled: true,
    style: 'gradient-vibrant',
    customImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    height: 'medium',
    opacity: 90,
    blur: 0,
    title: 'Explore Next-Generation AI Intelligence',
    subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
    showBadges: true
  }
};

export const INITIAL_ADMIN = {
  email: 'admin@nextgenai.guide',
  salt: '6e78a9aec5ae99e106a7ac4f48a0a9af',
  hash: '48137c46d89e496e5fbd0e5802d9c05f1a07971a350aa452a8f42eb872506467de78f35de1054588dab14b4f4928ab29db0a9453e9936f0014a301380769afba',
  createdAt: '2026-10-27T15:24:48.392Z'
};

export const INITIAL_TOOLS: ToolItem[] = [
  {
    id: 'chatgpt',
    slug: 'chatgpt',
    name: 'ChatGPT',
    shortDescription: 'OpenAI’s versatile conversational assistant for writing, problem-solving, everyday questions, and creative exploration.',
    websiteUrl: 'https://chatgpt.com/',
    pricingStatus: 'Free Plan Available',
    pricingDetails: 'Free access to GPT-4o mini, web search, custom GPTs, and basic voice. ChatGPT Plus is $20/month for advanced reasoning (o1/o3-mini), higher usage limits, Canvas workspace, and priority speeds.',
    iconType: 'chatgpt',
    category: 'Conversational & Writing',
    tags: ['Chat', 'Writing', 'Productivity', 'Brainstorming', 'Beginner Friendly'],
    isFeatured: true,
    isPublished: true,
    order: 1,
    intro: 'ChatGPT by OpenAI is the world’s most widely used generative artificial intelligence assistant. Designed to interact in natural language, it helps beginners and professionals draft clear emails, summarize extensive documents, learn complex subjects at their own pace, and brainstorm solutions across creative and technical projects.',
    whatIsUsedFor: 'Everyday question answering, email drafting, essay proofreading, step-by-step math problem explanations, language practice, recipe planning, and beginner coding support.',
    keyFeatures: [
      'Natural dialogue that remembers conversation context within each session',
      'Integrated web search for retrieving up-to-date facts and news',
      'File and image upload capability for document summaries and photo analysis',
      'Extensive library of Custom GPTs specialized in design, writing, and education',
      'Real-time voice conversation mode on iOS, Android, and desktop apps'
    ],
    freePlanLimitations: {
      summary: 'Standard free tier includes GPT-4o mini with generous usage limits, subject to dynamic throttling during global peak hours.',
      details: [
        'Free access uses the fast GPT-4o mini model with basic internet browsing',
        'Daily message limits on full flagship models (e.g., GPT-4o) before falling back to mini',
        'File upload analysis and image generation have daily usage caps on free accounts',
        'Advanced features like Canvas and high-tier reasoning models require ChatGPT Plus ($20/mo)'
      ]
    },
    beginnerGuide: [
      {
        stepNumber: 1,
        title: 'Create Your Free Account',
        description: 'Navigate to chatgpt.com. You can begin chatting immediately as a guest or sign up with an email or Google account to save your chat history across devices.'
      },
      {
        stepNumber: 2,
        title: 'Provide Clear Context and Your Goal',
        description: 'Instead of asking a one-word question, tell ChatGPT who you are and what format you want. For example: "I am writing a thank-you note to a mentor; keep it warm, sincere, and under 150 words."'
      },
      {
        stepNumber: 3,
        title: 'Iterate and Refine the Output',
        description: 'Treat the AI like a helpful collaborator. Reply with feedback such as "Make this sound less formal" or "Turn the second paragraph into 3 actionable bullet points."'
      },
      {
        stepNumber: 4,
        title: 'Fact-Check Important Details',
        description: 'Always review dates, numbers, citations, and legal/health claims before publishing or relying on generated content.'
      }
    ],
    examplePrompts: [
      {
        title: 'Professional Email Polish',
        category: 'Work & Communication',
        prompt: 'Please rewrite this draft email to a client asking for a contract update. Make it professional, friendly, and firm about our Friday project kickoff deadline:\n\n"[Paste your draft here]"'
      },
      {
        title: 'Explain Complex Topic Simply',
        category: 'Learning & Study',
        prompt: 'Explain how compound interest works to a complete beginner using a relatable everyday story with small numbers.'
      },
      {
        title: 'Meeting Notes Summary',
        category: 'Productivity',
        prompt: 'Here are my raw, messy meeting notes. Please organize them into three sections: 1. Main Decisions Made, 2. Open Questions, 3. Action Items with assigned owners:\n\n"[Paste notes here]"'
      }
    ],
    advantages: [
      'Very intuitive interface that feels like chatting with a knowledgeable friend',
      'Available across web, iOS, Android, and native Mac/Windows desktop apps',
      'Fast response times and strong performance across varied languages',
      'Extensive collection of specialized community GPT tools'
    ],
    limitations: [
      'May occasionally generate plausible-sounding incorrect answers (hallucinations)',
      'Free users experience dynamic rate limits during peak usage periods',
      'Knowledge of niche, hyper-recent local events requires enabling web search'
    ],
    incomeAndFreelancing: {
      title: 'Practical Freelance & Online Income Ideas',
      description: 'ChatGPT acts as a high-speed drafting partner that helps freelancers and solopreneurs produce more client work in less time.',
      tactics: [
        'Drafting customer service response templates and FAQ knowledge bases for small businesses',
        'Creating first drafts of blog posts, social media captions, and video scripts for marketing clients',
        'Proofreading, polishing, and formatting client resumes, cover letters, and bios',
        'Assisting in market research, questionnaire design, and email outreach sequences'
      ]
    },
    relatedToolSlugs: ['gemini', 'claude', 'copilot'],
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'gemini',
    slug: 'gemini',
    name: 'Google Gemini',
    shortDescription: 'Google’s multimodal AI assistant deeply connected with Google Workspace, YouTube, Maps, and live web information.',
    websiteUrl: 'https://gemini.google.com/',
    pricingStatus: 'Free Plan Available',
    pricingDetails: 'Free access to Gemini 2.0 / 1.5 Flash with standard Google account. Gemini Advanced with 2 Million token context, 1.5 Pro reasoning, and Deep Research is included in the Google One AI Premium plan for $19.99/month.',
    iconType: 'gemini',
    category: 'Search & Multimodal',
    tags: ['Google', 'Multimodal', 'YouTube', 'Workspace', 'Research'],
    isFeatured: true,
    isPublished: true,
    order: 2,
    intro: 'Google Gemini is Google’s state-of-the-art multimodal AI assistant. Built from the ground up to understand text, code, audio, images, and video simultaneously, Gemini integrates natively with Google’s ecosystem (YouTube, Google Docs, Gmail, Drive, and Maps) to make web research and daily task management effortless.',
    whatIsUsedFor: 'Drafting emails directly in Gmail, summarizing lengthy YouTube videos, travel planning with Google Maps, analyzing multi-page PDF documents, and verifying information against Google Search.',
    keyFeatures: [
      'Native Google Workspace extensions to pull insights from Drive, Docs, and Gmail',
      'YouTube integration that extracts chapters, timestamps, and summaries from video URLs',
      'Interactive "Double-check response" feature using Google Search to highlight corroborating sources',
      'Huge context window capable of ingesting books, research papers, and codebases',
      'Voice conversation mode available on mobile devices'
    ],
    freePlanLimitations: {
      summary: 'The standard Gemini tier is 100% free with any Google account, powered by high-speed Flash models with generous daily quotas.',
      details: [
        'Free tier uses Gemini 1.5 / 2.0 Flash with fast responses and generous rate limits',
        'Access to Gemini Advanced (Gemini 1.5 Pro with 2M token context and Deep Research) requires Google One AI Premium ($19.99/mo)',
        'Workspace extensions require enabling personal account permissions'
      ]
    },
    beginnerGuide: [
      {
        stepNumber: 1,
        title: 'Sign in with Your Google Account',
        description: 'Visit gemini.google.com and log in with your existing Google credentials. No extra account creation or payment information is required.'
      },
      {
        stepNumber: 2,
        title: 'Use Google Extensions for Smart Context',
        description: 'Type @YouTube followed by a video link to summarize key takeaways, or type @Google Drive to find specific details from your stored documents.'
      },
      {
        stepNumber: 3,
        title: 'Upload Photos or Documents',
        description: 'Click the plus or upload icon to add an image, invoice, or PDF. Ask Gemini to transcribe text, identify objects, or summarize main points.'
      },
      {
        stepNumber: 4,
        title: 'Click "Double-Check" for Source Verification',
        description: 'Click the Google "G" icon underneath any response. Gemini will cross-reference its text with live Google Search results, highlighting verified facts in green.'
      }
    ],
    examplePrompts: [
      {
        title: 'YouTube Video Breakdown',
        category: 'Learning',
        prompt: '@YouTube summarize the main 5 arguments presented in this video, including specific timestamps: [Paste YouTube link]'
      },
      {
        title: 'Custom Travel Itinerary',
        category: 'Lifestyle & Travel',
        prompt: 'Create a 4-day walking itinerary for Florence, Italy focused on Renaissance art, authentic gelato, and historic markets. Include estimated walking times between stops.'
      },
      {
        title: 'Document Key Takeaways',
        category: 'Work & Research',
        prompt: 'Review the attached 10-page PDF report. List the top 3 recommendations and explain the primary obstacles mentioned by the authors.'
      }
    ],
    advantages: [
      'Unmatched integration with YouTube, Google Maps, Gmail, and Google Docs',
      'Unique "Double-check response" feature provides direct confidence in factual claims',
      'Industry-leading large context window for ingesting long reports and documents',
      'Clean, distraction-free interface without advertisements'
    ],
    limitations: [
      'Certain advanced capabilities like deep scientific research require a paid Google One subscription',
      'Can sometimes be overly conservative in creative fiction writing due to safety filters'
    ],
    incomeAndFreelancing: {
      title: 'Freelance & Online Income Opportunities',
      description: 'Gemini gives research assistants, virtual assistants, and agency owners an edge in processing video and Google Docs faster.',
      tactics: [
        'Curating executive summaries of industry podcasts and YouTube webinars for busy business leaders',
        'Offering travel planning and custom itinerary design services utilizing Google Maps integration',
        'Assisting small businesses with Google Business Profile updates, review response drafts, and email newsletters',
        'Synthesizing customer feedback forms stored inside Google Sheets'
      ]
    },
    relatedToolSlugs: ['chatgpt', 'perplexity', 'copilot'],
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'claude',
    slug: 'claude',
    name: 'Claude',
    shortDescription: 'Anthropic’s thoughtful AI assistant celebrated for nuanced writing, reliable reasoning, and interactive Artifacts.',
    websiteUrl: 'https://claude.ai/',
    pricingStatus: 'Free Plan Available',
    pricingDetails: 'Free access to Claude 3.5 Sonnet with rolling session message caps. Claude Pro is $20/month for 5x more usage, priority peak access, early feature trials, and Projects workspace organization.',
    iconType: 'claude',
    category: 'Nuanced Writing & Code',
    tags: ['Writing', 'Coding', 'Artifacts', 'Reasoning', 'Safe AI'],
    isFeatured: true,
    isPublished: true,
    order: 3,
    intro: 'Claude is an artificial intelligence assistant created by Anthropic, a research company centered on AI safety. Renowned for its natural, thoughtful writing style that avoids generic corporate clichés, Claude excels at complex document synthesis, creative literature, analytical thinking, and generating interactive web interfaces in its live "Artifacts" pane.',
    whatIsUsedFor: 'Long-form editorial writing, polishing manuscripts, code debugging and interactive UI prototyping, in-depth legal and technical document analysis, and executive speech drafting.',
    keyFeatures: [
      'Live "Artifacts" side-panel that renders code, interactive React components, SVGs, and markdown live',
      'Superior prose quality that reads with genuine warmth and literary nuance',
      'Large 200,000-token context window that can process entire book chapters or codebases',
      'Claude Projects (Pro) for organizing reference materials and custom team instructions',
      'Strong safety guardrails designed to refuse harmful or dishonest generation'
    ],
    freePlanLimitations: {
      summary: 'Free tier provides access to the flagship Claude 3.5 Sonnet model with dynamic message limits per rolling 5-hour window.',
      details: [
        'Free users share capacity and receive a set number of messages every few hours based on traffic demand',
        'Claude Pro ($20/month) increases message limits by roughly 5x and grants priority access',
        'Free tier allows multiple document uploads per chat within the message quota'
      ]
    },
    beginnerGuide: [
      {
        stepNumber: 1,
        title: 'Sign Up at Claude.ai',
        description: 'Go to claude.ai and register using your email address or Google authentication. The onboarding is clean and takes less than a minute.'
      },
      {
        stepNumber: 2,
        title: 'Upload Large Files or Text Blocks',
        description: 'Attach PDFs, text transcripts, CSVs, or code files. Claude will digest the entire document and answer specific questions with high accuracy.'
      },
      {
        stepNumber: 3,
        title: 'Ask for Structured or Visual Output',
        description: 'Ask Claude to "create an interactive React component" or "draw an SVG diagram". It will open an interactive Artifacts window on the right to show live results.'
      },
      {
        stepNumber: 4,
        title: 'Refine Tone and Style',
        description: 'Tell Claude your target audience: "Write like an experienced economics editor explaining fiscal policy to high school students."'
      }
    ],
    examplePrompts: [
      {
        title: 'Article Polish & Critique',
        category: 'Editorial Writing',
        prompt: 'Act as a senior book editor. Review my draft essay below. Highlight any clichés, point out where the pacing slows down, and propose a stronger opening hook:\n\n"[Paste your draft]"'
      },
      {
        title: 'Interactive Web Prototype',
        category: 'Coding & Prototyping',
        prompt: 'Create a clean, modern compound interest calculator in React with Tailwind CSS. Include sliders for initial deposit, monthly contribution, and interest rate, and render it in Artifacts.'
      },
      {
        title: 'Legal Contract Plain-English Translation',
        category: 'Analysis & Work',
        prompt: 'I have attached a commercial lease agreement. Explain the tenant obligations regarding property maintenance and deposit return in plain English with bullet points.'
      }
    ],
    advantages: [
      'Best-in-class prose and essay generation with minimal robotic phrasing',
      'Artifacts pane makes code, diagrams, and components immediately visual and testable',
      'Exceptional at nuanced reasoning, logic puzzles, and multi-step directions',
      'Honest communication style that clearly states when it lacks sufficient information'
    ],
    limitations: [
      'Free message allowance can run out quickly during prolonged sessions',
      'No built-in web browsing search engine in standard chat (focuses on uploaded context and knowledge)'
    ],
    incomeAndFreelancing: {
      title: 'Freelance & Online Income Opportunities',
      description: 'Claude’s articulate tone and code comprehension make it a secret weapon for writers, editors, and web design freelancers.',
      tactics: [
        'Providing developmental editing and manuscript proofreading services for independent authors',
        'Building clickable UI prototypes and interactive landing page components for clients using Artifacts',
        'Writing compelling long-form case studies, whitepapers, and thought-leadership articles',
        'Summarizing complicated compliance handbooks and regulatory standards for corporate clients'
      ]
    },
    relatedToolSlugs: ['chatgpt', 'gemini', 'perplexity'],
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'copilot',
    slug: 'copilot',
    name: 'Microsoft Copilot',
    shortDescription: 'Microsoft’s AI companion integrated with Bing Search, Windows, and Edge, providing web-connected answers and image creation.',
    websiteUrl: 'https://copilot.microsoft.com/',
    pricingStatus: 'Free Plan Available',
    pricingDetails: 'Free web, Windows, and mobile access with a standard Microsoft account. Copilot Pro is $20/month for integration inside Word, Excel, PowerPoint, and Outlook, plus priority access to latest models during peak hours.',
    iconType: 'copilot',
    category: 'Productivity & Office',
    tags: ['Microsoft', 'Windows', 'Office', 'Image Generation', 'Bing Search'],
    isFeatured: true,
    isPublished: true,
    order: 4,
    intro: 'Microsoft Copilot is an AI-powered assistant woven into the Microsoft ecosystem. Built on cutting-edge OpenAI models and connected directly to Bing’s live internet search index, Copilot delivers verified web answers, creative DALL-E 3 image generation, and workflow automation directly inside Windows 11, the Edge browser, and Microsoft 365 apps.',
    whatIsUsedFor: 'Live internet search with citations, generating custom images, summarizing web pages inside Microsoft Edge, drafting presentations, and composing professional emails.',
    keyFeatures: [
      'Seamlessly embedded in Microsoft Windows 11 and the Edge browser sidebar',
      'DALL-E 3 image generation included for free with daily boost credits',
      'Live web grounding powered by Bing Search with clickable footnotes',
      'Voice input and conversational audio mode',
      'Optional deep integration with Microsoft Word, Excel, and PowerPoint (Copilot Pro)'
    ],
    freePlanLimitations: {
      summary: 'Completely free for web search, conversation, and image creation with any free personal Microsoft account.',
      details: [
        'Free web plan includes standard chat with web search and 15 daily Designer image creation boosts',
        'Integration inside desktop Office apps (Word, Excel, PowerPoint) requires Copilot Pro ($20/mo) and an M365 subscription',
        'Enterprise commercial data protection requires an eligible Microsoft work account'
      ]
    },
    beginnerGuide: [
      {
        stepNumber: 1,
        title: 'Open Copilot in Your Browser or Windows',
        description: 'Visit copilot.microsoft.com or press the Copilot key / taskbar icon on Windows 11. Sign in with a Microsoft account to keep your chat history.'
      },
      {
        stepNumber: 2,
        title: 'Choose a Task: Chat or Create',
        description: 'You can ask a factual question to search the web, ask for writing assistance, or type "Create an image of..." to generate artwork.'
      },
      {
        stepNumber: 3,
        title: 'Browse with the Edge Sidebar',
        description: 'When reading a long web article in Microsoft Edge, click the Copilot icon in the top right to generate a 3-bullet summary instantly.'
      },
      {
        stepNumber: 4,
        title: 'Verify via Numbered Links',
        description: 'Review the numbered footnote links in Copilot’s responses to inspect the source websites directly.'
      }
    ],
    examplePrompts: [
      {
        title: 'Image Concept Generation',
        category: 'Creative Design',
        prompt: 'Create an image of a cozy modern coffee shop with large rain-streaked windows, indoor plants, warm amber lighting, and steam rising from a latte. Studio quality, 4k.'
      },
      {
        title: 'Live Product Comparison',
        category: 'Consumer Research',
        prompt: 'Compare the latest noise-cancelling headphones released in 2026. Create a markdown table showing battery life, noise cancellation score, price, and top user complaints.'
      },
      {
        title: 'Edge Page Summary',
        category: 'Productivity',
        prompt: 'Summarize this webpage into 5 bullet points and highlight any dates, deadlines, or pricing mentioned.'
      }
    ],
    advantages: [
      'Accessible across Windows PCs without needing to install external software',
      'Free built-in AI image generation using DALL-E 3',
      'Dependable real-time web search with source links',
      'Strong compatibility with corporate enterprise Microsoft 365 environments'
    ],
    limitations: [
      'Desktop Office features require a paid Pro subscription',
      'Sidebar responses can sometimes feel constrained in length compared to full-window chats'
    ],
    incomeAndFreelancing: {
      title: 'Freelance & Online Income Opportunities',
      description: 'Copilot provides freelancers with image generation and corporate document tools that speed up client deliverables.',
      tactics: [
        'Generating royalty-free concept art, social media banners, and thumbnail backgrounds for clients',
        'Performing quick competitive intelligence and price comparisons for local business clients',
        'Drafting executive Word documents and PowerPoint slide outlines for consulting projects',
        'Assisting businesses in organizing spreadsheet data and summarizing vendor proposals'
      ]
    },
    relatedToolSlugs: ['chatgpt', 'perplexity', 'gemini'],
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'perplexity',
    slug: 'perplexity',
    name: 'Perplexity AI',
    shortDescription: 'An answer engine that pairs AI reasoning with live web search, synthesizing clear answers backed by direct citations.',
    websiteUrl: 'https://www.perplexity.ai/',
    pricingStatus: 'Free Plan Available',
    pricingDetails: 'Free plan includes unlimited Quick searches and 5 Pro searches every 4 hours. Perplexity Pro is $20/month for 300+ Pro searches/day, model selection (Claude 3.5 Sonnet, GPT-4o), file uploads, and API credits.',
    iconType: 'perplexity',
    category: 'Research & Search',
    tags: ['Search Engine', 'Citations', 'Research', 'Academic', 'Fact-Checking'],
    isFeatured: true,
    isPublished: true,
    order: 5,
    intro: 'Perplexity AI is a conversational answer engine built to replace traditional search engines with clear, synthesized answers. Rather than forcing users to sift through sponsored links and search results, Perplexity reads the live web, condenses multiple perspectives into a coherent overview, and adds clear citation numbers so you can verify every factual statement.',
    whatIsUsedFor: 'Academic research, market discovery, product buying guides, investigating medical and science topics, fact-checking viral claims, and tracking current events.',
    keyFeatures: [
      'Transparent, clickable inline citations referencing the original source websites',
      'Focus filters to restrict search to Academic papers, Reddit discussions, YouTube, or Writing only',
      'Pro Search multi-step reasoning that asks clarifying questions to narrow down complex queries',
      'Organized "Collections" for saving and sharing research projects with team members',
      'Discover feed highlighting trending news with AI-synthesized summaries'
    ],
    freePlanLimitations: {
      summary: 'The standard free plan offers unlimited Quick searches with real-time web citations, requiring no credit card.',
      details: [
        'Free users enjoy unlimited Quick searches with web citations',
        'Free accounts receive 5 Pro searches every 4 hours (deep multi-step research)',
        'Perplexity Pro ($20/mo) unlocks 300+ daily Pro searches, file analysis, and custom model choices'
      ]
    },
    beginnerGuide: [
      {
        stepNumber: 1,
        title: 'Type Your Question Directly',
        description: 'Go to perplexity.ai. You can start searching right away—no login is required for basic searches, though free registration lets you save your research library.'
      },
      {
        stepNumber: 2,
        title: 'Choose a Focus Filter',
        description: 'Click the "Focus" button below the search bar. Select "Academic" if you need peer-reviewed citations, or "Reddit" if you want candid consumer opinions.'
      },
      {
        stepNumber: 3,
        title: 'Review the Synthesized Answer',
        description: 'Read the concise summary. Hover over or click on citation numbers (e.g. [1], [2]) to visit and inspect the primary source websites.'
      },
      {
        stepNumber: 4,
        title: 'Explore Suggested Follow-Up Questions',
        description: 'Perplexity automatically recommends relevant follow-up questions at the bottom of the page to help you dig deeper into the topic.'
      }
    ],
    examplePrompts: [
      {
        title: 'Real Consumer Sentiment',
        category: 'Product Research',
        prompt: 'Focus: Reddit. What are the most common reliability issues real owners report with modern induction stove tops after 2 years of daily use?'
      },
      {
        title: 'Market Trends with Sources',
        category: 'Business & Finance',
        prompt: 'What are the main regulatory changes affecting remote workers in the European Union in 2026? Provide a bulleted summary with source links.'
      },
      {
        title: 'Academic Study Digest',
        category: 'Academic Study',
        prompt: 'Focus: Academic. Summarize recent peer-reviewed findings on how circadian light exposure affects morning cortisol levels and sleep onset latency.'
      }
    ],
    advantages: [
      'Eliminates the frustration of clicking through ten ad-filled search result links',
      'Every claim is backed by numbered, clickable citation links for easy fact-checking',
      'Focus filter allows pinpoint searching on academic databases or community forums',
      'Clean, distraction-free reading experience'
    ],
    limitations: [
      'Not designed for extended creative storytelling or fictional roleplay',
      'Occasionally relies on biased primary sources if search queries are phrased leadingly'
    ],
    incomeAndFreelancing: {
      title: 'Freelance & Online Income Opportunities',
      description: 'Perplexity turns anyone into a lightning-fast research analyst capable of delivering authoritative client reports in record time.',
      tactics: [
        'Conducting competitive intelligence and industry teardowns for startup founders and investors',
        'Fact-checking, reference sourcing, and bibliography formatting for journalists and authors',
        'Researching high-intent product buying guides and affiliate review roundups with citations',
        'Preparing background briefing dossiers for executives before prospective client meetings'
      ]
    },
    relatedToolSlugs: ['gemini', 'chatgpt', 'duck-ai'],
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'duck-ai',
    slug: 'duck-ai',
    name: 'Duck.ai',
    shortDescription: 'DuckDuckGo’s private, anonymous AI chat that lets you use leading AI models without creating an account or tracking your personal data.',
    websiteUrl: 'https://duck.ai/',
    pricingStatus: 'Free Plan Available',
    pricingDetails: '100% free anonymous access with daily usage limits per device. Optional DuckDuckGo Privacy Pro is $9.99/month, which bundles higher AI rate limits with a private VPN and personal identity restoration services.',
    iconType: 'duck-ai',
    category: 'Privacy-Focused AI',
    tags: ['Privacy', 'Anonymous', 'No Account Required', 'DuckDuckGo', 'No Tracking'],
    isFeatured: true,
    isPublished: true,
    order: 6,
    intro: 'Duck.ai (also known as DuckDuckGo AI Chat) is a privacy-first AI conversation service provided by DuckDuckGo. Designed for users who value confidentiality, Duck.ai enables you to interact with top foundation models without creating an account, without logging your IP address, and with an explicit guarantee that your prompts are never stored or used to train third-party AI models.',
    whatIsUsedFor: 'Private research, asking confidential health or financial questions, drafting sensitive correspondence, and trying multiple AI models through a single neutral interface.',
    keyFeatures: [
      'Zero account creation or email registration required to start chatting',
      'Anonymized requests: DuckDuckGo strips your IP address before routing prompts to AI model providers',
      'Choice of multiple AI models, including Claude 3 Haiku, GPT-4o mini, Llama 3.3, and Mixtral',
      'Strict privacy agreements guaranteeing your chats are never used to train future AI models',
      'Minimalist, distraction-free interface with rapid response delivery'
    ],
    freePlanLimitations: {
      summary: 'Completely free for daily confidential chatting, subject only to fair-use rate limits.',
      details: [
        'Free usage has generous daily message allowances that refresh automatically',
        'Chat histories are intentionally kept on your local device and cleared upon session close',
        'Higher message limits are bundled with DuckDuckGo Privacy Pro ($9.99/month)'
      ]
    },
    beginnerGuide: [
      {
        stepNumber: 1,
        title: 'Open Duck.ai in Any Web Browser',
        description: 'Navigate to duck.ai or duckduckgo.com/chat. Notice that you are never asked for a username, email, or credit card.'
      },
      {
        stepNumber: 2,
        title: 'Select Your Preferred AI Model',
        description: 'Use the model dropdown at the top of the chat to switch between OpenAI’s GPT-4o mini, Anthropic’s Claude 3 Haiku, or Meta’s open Llama model.'
      },
      {
        stepNumber: 3,
        title: 'Chat with Complete Peace of Mind',
        description: 'Ask any sensitive questions about career decisions, personal finances, or draft private emails without fear of ad tracking.'
      },
      {
        stepNumber: 4,
        title: 'Reset or Clear When Finished',
        description: 'Click "Clear Chat" when done to wipe local conversation tokens from your browser.'
      }
    ],
    examplePrompts: [
      {
        title: 'Confidential Resignation Letter',
        category: 'Career & Work',
        prompt: 'Help me write a graceful, professional resignation letter from my position as marketing manager. Give 2 weeks notice and express gratitude for team support.'
      },
      {
        title: 'Sensitive Medical Concept Explanation',
        category: 'Personal Wellness',
        prompt: 'Explain what an elevated ferritin level in blood work can indicate, in simple terms that I can discuss knowledgeably with my doctor.'
      },
      {
        title: 'Unbiased Decision Matrix',
        category: 'Decision Making',
        prompt: 'Help me weigh the pros, cons, and hidden costs of renting vs purchasing a home in an uncertain interest rate environment. Keep it impartial.'
      }
    ],
    advantages: [
      'Highest standard of consumer privacy: no account, no tracking, no ad retargeting',
      'Ability to test multiple major AI models (Anthropic, OpenAI, Meta) in one single place',
      'Zero clutter, fast loading, and beginner-accessible interface',
      'Completely free without pushy upselling'
    ],
    limitations: [
      'Cannot save chat history across multiple devices or long time spans due to privacy design',
      'No custom system prompts or persistent user profile memory'
    ],
    incomeAndFreelancing: {
      title: 'Freelance & Online Income Opportunities',
      description: 'Duck.ai is ideal for consultants, legal researchers, and privacy-conscious professionals working with sensitive client information.',
      tactics: [
        'Drafting sensitive client proposals and non-disclosure-bound project briefs safely',
        'Researching competitor trade secrets and market niches without triggering targeted ad campaigns',
        'Testing prompt behavior across Claude and GPT models simultaneously without paying dual subscriptions',
        'Offering privacy-focused content auditing and copywriting services'
      ]
    },
    relatedToolSlugs: ['perplexity', 'claude', 'chatgpt'],
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'meta-ai',
    slug: 'meta-ai',
    name: 'Meta AI',
    shortDescription: 'Meta’s open-weights assistant integrated across WhatsApp, Instagram, Messenger, and the web, completely free to use.',
    websiteUrl: 'https://www.meta.ai/',
    pricingStatus: 'Free',
    pricingDetails: '100% Free with no paid tier or subscription required. Accessible via web at meta.ai and integrated directly inside WhatsApp, Instagram, and Messenger apps.',
    iconType: 'meta-ai',
    category: 'Social & Creative',
    tags: ['Meta', 'WhatsApp', 'Instagram', 'Llama', 'Free Image Generation'],
    isFeatured: true,
    isPublished: true,
    order: 7,
    intro: 'Meta AI is an intelligent assistant powered by Meta’s open-source Llama foundation models. Available directly on the web at meta.ai and embedded inside the apps billions of people already use daily (WhatsApp, Instagram, Facebook, and Messenger), Meta AI delivers instant conversational answers, group chat assistance, and rapid image generation without any subscription fees.',
    whatIsUsedFor: 'Quick everyday queries, social media caption brainstorming, generating and animating creative images with "Imagine", and settling debates inside group messaging chats.',
    keyFeatures: [
      'Completely free with zero paywalls or premium tiers',
      'Direct integration inside WhatsApp, Instagram DMs, and Facebook Messenger',
      'Real-time image generation and animation with the "/imagine" command',
      'Powered by state-of-the-art open Llama model weights',
      'Voice input and audio responses on mobile devices'
    ],
    freePlanLimitations: {
      summary: 'Meta AI is completely free. There are no paid plans or subscriptions.',
      details: [
        'All capabilities (chat, search, and image generation) are free to use',
        'Subject to standard Meta Community Guidelines and safety protections',
        'Geographic availability varies slightly in certain countries pending local regulatory reviews'
      ]
    },
    beginnerGuide: [
      {
        stepNumber: 1,
        title: 'Access via Web or Your Favorite App',
        description: 'Go to meta.ai in your browser, or simply open WhatsApp, Instagram, or Messenger and look for the blue-purple ring icon.'
      },
      {
        stepNumber: 2,
        title: 'Use Inside Group Chats',
        description: 'Type @MetaAI in any WhatsApp or Messenger group conversation to ask for restaurant recommendations, settle trivia questions, or plan group events.'
      },
      {
        stepNumber: 3,
        title: 'Generate Images with "Imagine"',
        description: 'Type "imagine a vintage Volkswagen camper van parked on a cliff during sunset" to generate a realistic image in seconds.'
      },
      {
        stepNumber: 4,
        title: 'Animate Your Generated Images',
        description: 'Click the "Animate" button on any generated picture to turn static images into short looping video clips.'
      }
    ],
    examplePrompts: [
      {
        title: 'Social Media Content Calendar',
        category: 'Social Media & Marketing',
        prompt: 'Create 5 engaging Instagram post ideas with caption hooks and relevant hashtags for an artisanal handmade candle business.'
      },
      {
        title: 'Creative Art Generation',
        category: 'Creative Design',
        prompt: 'Imagine a serene Japanese rock garden under cherry blossom trees in the rain, studio photography style, soft natural lighting.'
      },
      {
        title: 'Quick Meal Inspiration',
        category: 'Everyday Practical',
        prompt: 'I have chicken breast, broccoli, garlic, soy sauce, and jasmine rice. Give me an easy 20-minute dinner recipe with step-by-step instructions.'
      }
    ],
    advantages: [
      '100% free with no monthly subscription fees or credit limits',
      'Built directly into WhatsApp, Instagram, and Messenger for frictionless access on mobile',
      'Extremely fast image generation and animation capabilities',
      'Powered by open-source Llama foundation architecture'
    ],
    limitations: [
      'Less specialized for advanced multi-file coding compared to Claude or ChatGPT',
      'Restricted availability in certain European Union regions due to AI regulatory reviews'
    ],
    incomeAndFreelancing: {
      title: 'Freelance & Online Income Opportunities',
      description: 'Because Meta AI is ubiquitous on WhatsApp and Instagram, freelancers can leverage it for immediate social media client management.',
      tactics: [
        'Managing social media accounts for local shops by generating daily content calendars and graphics',
        'Drafting fast customer service reply scripts for WhatsApp business catalog inquiries',
        'Creating concept mood boards and visual mockups for e-commerce clients using /imagine',
        'Running quick copywriting polls and brainstorms directly on mobile between client meetings'
      ]
    },
    relatedToolSlugs: ['chatgpt', 'copilot', 'gemini'],
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  }
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-chat',
    name: 'Conversational & Writing',
    slug: 'conversational-writing',
    description: 'General conversational assistants for drafting emails, essays, and brainstorming ideas.',
    iconName: 'MessageSquare',
    order: 1
  },
  {
    id: 'cat-research',
    name: 'Search & Research',
    slug: 'search-research',
    description: 'Answer engines and web-grounded models with citations for academic and market inquiry.',
    iconName: 'Search',
    order: 2
  },
  {
    id: 'cat-coding',
    name: 'Nuanced Writing & Code',
    slug: 'nuanced-writing-code',
    description: 'High-reasoning assistants specialized in prose editing, coding assistance, and artifacts.',
    iconName: 'Code',
    order: 3
  },
  {
    id: 'cat-productivity',
    name: 'Productivity & Office',
    slug: 'productivity-office',
    description: 'Assistants integrated with spreadsheets, documents, presentations, and daily workflows.',
    iconName: 'Briefcase',
    order: 4
  },
  {
    id: 'cat-privacy',
    name: 'Privacy-Focused AI',
    slug: 'privacy-focused',
    description: 'Anonymous, zero-tracking AI chats that respect personal data and private queries.',
    iconName: 'Shield',
    order: 5
  },
  {
    id: 'cat-social',
    name: 'Social & Creative',
    slug: 'social-creative',
    description: 'Fast image generation, mobile group chat helpers, and social media creative brainstorms.',
    iconName: 'Sparkles',
    order: 6
  }
];

export const INITIAL_TUTORIALS: TutorialItem[] = [
  {
    id: 'tut-1',
    title: 'Beginner Prompting: The 4 Core Rules That Change Everything',
    slug: 'beginner-prompting-rules',
    summary: 'Master the four foundational rules of AI prompting to turn vague or disappointing answers into crisp, professional outputs.',
    toolSlug: 'chatgpt',
    toolName: 'ChatGPT & Claude',
    category: 'Foundations',
    readTime: '4 min read',
    steps: [
      {
        stepNumber: 1,
        title: 'Define the Persona / Role',
        description: 'Give the assistant a clear identity. Starting your prompt with "Act as an experienced career counselor" or "Act as an editor at a tech publication" instantly tailors vocabulary and depth.'
      },
      {
        stepNumber: 2,
        title: 'Provide Relevant Context',
        description: 'Explain the background: who you are speaking to, the goal of the piece, and any important constraints (e.g. "I have 5 years in marketing and want to transition to UX research").'
      },
      {
        stepNumber: 3,
        title: 'Specify the Output Format',
        description: 'Demand a specific structure: "Return 3 bullet points under 40 words each", "Create a markdown comparison table", or "Draft a polite 2-paragraph email".'
      },
      {
        stepNumber: 4,
        title: 'Iterate with Follow-Ups',
        description: 'Do not retype from scratch. Simply reply with feedback: "Make point 2 less formal" or "Add an illustrative real-world example".'
      }
    ],
    isPublished: true,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'tut-2',
    title: 'How to Fact-Check AI and Avoid Hallucinations in 2 Minutes',
    slug: 'fact-checking-ai-hallucinations',
    summary: 'A simple step-by-step workflow to verify statistics, citations, and critical facts using Perplexity and Gemini double-checking.',
    toolSlug: 'perplexity',
    toolName: 'Perplexity AI',
    category: 'Research',
    readTime: '5 min read',
    steps: [
      {
        stepNumber: 1,
        title: 'Use Answer Engines with Citations',
        description: 'When researching factual topics, choose Perplexity AI rather than standard chat. Every claim includes clickable footnote numbers referencing original web sources.'
      },
      {
        stepNumber: 2,
        title: 'Use Google Gemini’s Double-Check Button',
        description: 'In Gemini, click the Google "G" icon underneath any response. Gemini searches the live web and highlights corroborated statements in green.'
      },
      {
        stepNumber: 3,
        title: 'Verify Primary Data Points',
        description: 'Always click the original link to confirm critical statistics, medical advice, legal timelines, or prices before relying on them.'
      }
    ],
    isPublished: true,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'tut-3',
    title: 'Building Interactive Prototypes Without Coding Using Claude Artifacts',
    slug: 'interactive-prototypes-claude-artifacts',
    summary: 'Turn your napkin sketches into clickable React components and live web calculators right in Claude’s interactive preview panel.',
    toolSlug: 'claude',
    toolName: 'Claude',
    category: 'Coding & Prototyping',
    readTime: '6 min read',
    steps: [
      {
        stepNumber: 1,
        title: 'Describe Your Component Concept',
        description: 'Ask Claude: "Create an interactive mortgage repayment calculator in React with Tailwind CSS and show it as an Artifact."'
      },
      {
        stepNumber: 2,
        title: 'Interact with the Live Preview',
        description: 'Claude opens a split-screen Artifact window. You can drag sliders, click buttons, and test the user experience in real time.'
      },
      {
        stepNumber: 3,
        title: 'Refine Design and Styling',
        description: 'Request visual tweaks: "Make the sliders larger, add an amortization graph, and use a modern purple and blue color palette."'
      }
    ],
    isPublished: true,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  }
];

export const INITIAL_INCOME_GUIDES: IncomeGuideItem[] = [
  {
    id: 'guide-1',
    title: 'Content Polishing & Editorial Services for Local Small Businesses',
    slug: 'content-polishing-small-businesses',
    category: 'Writing & Editorial',
    difficulty: 'Beginner',
    estimatedEarnings: '$25 – $50 / hour',
    summary: 'Help local businesses (dentists, contractors, law offices, boutique shops) rewrite messy website copy, weekly customer newsletters, and customer FAQs.',
    recommendedTools: ['ChatGPT', 'Claude'],
    executionSteps: [
      'Find local business websites in your region with outdated or poorly formatted FAQ/About pages.',
      'Prepare a complimentary 1-page sample rewrite showing improved clarity, warmth, and professionalism.',
      'Use Claude or ChatGPT to polish draft outlines while adding human local knowledge and real testimonials.',
      'Package as a monthly maintenance retainer offering 4 polished articles or newsletters per month.'
    ],
    deliverableExample: 'A polished, professional 500-word FAQ guide with clear headlines and zero grammatical errors.',
    isPublished: true,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'guide-2',
    title: 'Market Intelligence & Competitor Dossiers for Startup Consultants',
    slug: 'market-intelligence-competitor-dossiers',
    category: 'Research & Strategy',
    difficulty: 'Intermediate',
    estimatedEarnings: '$150 – $400 / dossier',
    summary: 'Deliver structured competitive intelligence reports, customer sentiment analysis, and pricing comparison tables for founders and consulting firms.',
    recommendedTools: ['Perplexity AI', 'Google Gemini'],
    executionSteps: [
      'Gather the top 5 questions the founder has regarding a competitor’s feature set and pricing.',
      'Use Perplexity AI (Focus: Reddit & Web) to compile unfiltered user reviews, pain points, and pricing trends.',
      'Verify citations and create clean comparison tables in Google Sheets or Docs.',
      'Deliver an executive 3-page PDF briefing that saves the client 15 hours of manual research.'
    ],
    deliverableExample: 'A concise 3-page competitor analysis document citing verified web sources with actionable SWOT bullet points.',
    isPublished: true,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'guide-3',
    title: 'Social Media Content Calendars & Visual Ideation for E-Commerce',
    slug: 'social-media-content-calendars',
    category: 'Social Media & Design',
    difficulty: 'Beginner',
    estimatedEarnings: '$300 – $600 / month per client',
    summary: 'Build high-engagement 30-day social media calendars, catchy caption variations, and royalty-free concept art for boutique brands.',
    recommendedTools: ['Meta AI', 'Microsoft Copilot'],
    executionSteps: [
      'Interview the brand owner about their seasonal product promotion and core brand values.',
      'Use Meta AI to brainstorm 30 caption ideas with hooks, calls to action, and relevant hashtags.',
      'Generate complementary visual backgrounds and thematic concept illustrations using Copilot (DALL-E 3).',
      'Deliver as a scheduled Notion board or spreadsheet for client approval.'
    ],
    deliverableExample: 'A 30-day social media calendar with caption copy, hashtag bundles, and matching visual concepts.',
    isPublished: true,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  }
];

export const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'The AI Shift: Why Learning Practical Prompts Matters More Than Theory',
    slug: 'ai-shift-practical-prompts-vs-theory',
    category: 'Industry Insights',
    summary: 'Why non-technical operators and digital creators are gaining an unprecedented competitive edge by mastering conversational AI workflows.',
    author: 'NextGen Editorial Team',
    readTime: '4 min read',
    content: `Artificial intelligence has crossed a fundamental threshold. For decades, leveraging advanced computation required specialized engineering skills, complex math, and deep programming knowledge. Today, the interface to the world's most powerful reasoning models is plain natural language.

What separates ordinary users from high-leverage builders is not access to secret software—it is the clarity, discipline, and context with which they prompt the tool. When you learn how to frame problems clearly, define exact constraints, and rigorously fact-check outcomes, AI becomes an extraordinary cognitive multiplier.`,
    isPublished: true,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  },
  {
    id: 'art-2',
    title: 'Privacy and AI: How to Protect Your Personal and Client Data',
    slug: 'privacy-and-ai-protect-client-data',
    category: 'Safety & Privacy',
    summary: 'A straightforward guide to understanding data retention, model training opt-outs, and when to use anonymous tools like Duck.ai.',
    author: 'NextGen Editorial Team',
    readTime: '5 min read',
    content: `Whenever you paste text into a generative AI tool, it is essential to understand what happens to that data. Most commercial providers offer distinct consumer and enterprise data policies. 

For everyday brainstorming, standard accounts are sufficient. But for sensitive financial documents, non-disclosure-bound client drafts, or personal health questions, choosing privacy-first solutions like Duck.ai or toggling off model training history ensures your information remains strictly confidential.`,
    isPublished: true,
    createdAt: '2026-10-26T00:00:00.000Z',
    updatedAt: '2026-10-26T00:00:00.000Z'
  }
];

export const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: 'prompt-1',
    title: 'High-Ticket Freelance Pitch & Irresistible Offer Generator',
    description: 'Generates a compelling, customized freelance pitch with problem diagnosis, value proposition, risk-reversal guarantee, and call-to-action.',
    category: 'Income & Business',
    targetAi: 'ChatGPT 4o',
    promptText: `Act as a world-class freelance sales consultant and direct-response copywriter. I want to pitch a high-ticket client in the [TARGET_INDUSTRY] industry for my service: [MY_SERVICE].

Client Situation:
- Target Prospect Role: [CLIENT_ROLE] (e.g., Founder, Head of Growth, Marketing Director)
- Core Pain Point: [CLIENT_PAIN_POINT] (e.g., Low conversion rates on paid traffic)
- My Proposed Solution: [MY_PROPOSED_SOLUTION]
- My Unique Credibility / Past Win: [MY_CREDIBILITY]

Please generate:
1. A concise, zero-fluff Cold Email (under 120 words) with a personalized hook, proof metric, and low-friction CTA (e.g. 5-min audit).
2. A high-converting LinkedIn DM variation (under 75 words).
3. A 3-step value-packed follow-up sequence spaced over 10 days.
4. An Objection Handling script if they ask "What are your rates?" before getting on a call.

Keep tone professional, confident, consultative, and completely free of generic buzzwords.`,
    variables: [
      { key: 'TARGET_INDUSTRY', label: 'Target Industry', placeholder: 'e.g. B2B SaaS, E-commerce, Real Estate' },
      { key: 'MY_SERVICE', label: 'My Service', placeholder: 'e.g. Conversion Rate Optimization & AI Automation' },
      { key: 'CLIENT_ROLE', label: 'Client Role', placeholder: 'e.g. Founder, CMO, VP of Sales' },
      { key: 'CLIENT_PAIN_POINT', label: 'Client Pain Point', placeholder: 'e.g. High customer acquisition cost' },
      { key: 'MY_PROPOSED_SOLUTION', label: 'Proposed Solution', placeholder: 'e.g. 14-day landing page redesign sprint' },
      { key: 'MY_CREDIBILITY', label: 'Credibility / Past Win', placeholder: 'e.g. Increased checkout conversion by 34% for an e-commerce brand' }
    ],
    tags: ['Freelance', 'High Ticket', 'Client Acquisition', 'Cold Email', 'Sales'],
    tips: [
      'Tailor the credibility variable with specific numbers rather than vague statements.',
      'Send the follow-up sequence exactly as timed to maintain respectful persistence.'
    ],
    order: 1,
    isPublished: true,
    isExclusiveAdmin: true,
    createdAt: '2026-10-27T00:00:00.000Z',
    updatedAt: '2026-10-27T00:00:00.000Z'
  },
  {
    id: 'prompt-2',
    title: 'Autonomous Full-Stack Architecture & Clean Code Blueprint',
    description: 'Instructs Claude 3.5 Sonnet or Cursor to design scalable system architectures, clean TypeScript interfaces, resilient database schemas, and robust API handlers.',
    category: 'Coding & Architecture',
    targetAi: 'Claude 3.5 Sonnet',
    promptText: `You are a Principal Software Architect and Senior Full-Stack Engineer. I need an architectural specification and production-grade implementation blueprint for:

Feature / Application: [APPLICATION_NAME_AND_PURPOSE]
Tech Stack: [TECH_STACK] (e.g., React 19, TypeScript, Express, PostgreSQL/Drizzle, Tailwind CSS)
Core User Stories:
[USER_STORIES]

Requirements:
1. Domain Model: Strict TypeScript interfaces and enums with comprehensive field annotations.
2. Database Schema: Normalized relational schema or document structure with primary keys, indexes, and constraints.
3. API Contract: RESTful endpoints with input validation schemas, error envelopes, and HTTP status codes.
4. Edge Case Hardening: Concurrency handling, authorization checks, idempotency, and network failure retries.
5. Code Example: Provide complete, pristine code for the most critical API handler and its associated database transaction. Do not use placeholders or omit error handling.`,
    variables: [
      { key: 'APPLICATION_NAME_AND_PURPOSE', label: 'App / Feature Purpose', placeholder: 'e.g. Multi-tenant subscription billing engine' },
      { key: 'TECH_STACK', label: 'Tech Stack', placeholder: 'e.g. React 19, Node.js, TypeScript, PostgreSQL' },
      { key: 'USER_STORIES', label: 'User Stories', placeholder: 'e.g. Users can subscribe, upgrade plan, receive webhook events' }
    ],
    tags: ['Full-Stack', 'Architecture', 'TypeScript', 'Clean Code', 'Database'],
    tips: [
      'Best used with Claude 3.5 Sonnet or Cursor IDE for deep architectural reasoning.',
      'Specify your ORM and styling library in the Tech Stack parameter.'
    ],
    order: 2,
    isPublished: true,
    isExclusiveAdmin: true,
    createdAt: '2026-10-27T00:00:00.000Z',
    updatedAt: '2026-10-27T00:00:00.000Z'
  },
  {
    id: 'prompt-3',
    title: 'Photorealistic Midjourney v6 Cinematic Commercial Photography',
    description: 'Generates studio-quality, ultra-realistic commercial product shots and editorial portraits with precise lighting, lens, and color grading parameters.',
    category: 'Midjourney & Visuals',
    targetAi: 'Midjourney v6',
    promptText: `A commercial editorial studio photograph of [SUBJECT_DESCRIPTION], shot on Hasselblad H6D-100c, 85mm f/1.4 lens. 
Lighting: [LIGHTING_STYLE] (e.g. soft diffuse morning sunlight with subtle rim lighting and atmospheric volumetric haze). 
Environment: [ENVIRONMENT_SETTING] (e.g. modern minimalist architectural interior with concrete textures and warm cedar accents).
Color Palette: [COLOR_TONES] (e.g. earthy muted tones, deep navy shadows, warm highlights).
Composition: Rule of thirds, shallow depth of field, natural skin/surface micro-textures, authentic reflections, cinematic depth, 8k resolution, photorealistic, hyper-detailed commercial quality --ar 16:9 --style raw --v 6.1`,
    variables: [
      { key: 'SUBJECT_DESCRIPTION', label: 'Subject Description', placeholder: 'e.g. luxury ceramic coffee dripper pouring hot coffee' },
      { key: 'LIGHTING_STYLE', label: 'Lighting Style', placeholder: 'e.g. Golden hour side lighting through fluted glass' },
      { key: 'ENVIRONMENT_SETTING', label: 'Environment Setting', placeholder: 'e.g. Sleek Scandinavian marble kitchen counter' },
      { key: 'COLOR_TONES', label: 'Color Tones', placeholder: 'e.g. Warm amber, deep charcoal, natural terracotta' }
    ],
    tags: ['Midjourney', 'Photography', 'Commercial', 'Product Art', 'Prompt Engineering'],
    tips: [
      'Copy the output directly into Discord or Midjourney web UI.',
      'Keep --style raw to avoid Midjourney default fantasy glossiness.'
    ],
    order: 3,
    isPublished: true,
    isExclusiveAdmin: true,
    createdAt: '2026-10-27T00:00:00.000Z',
    updatedAt: '2026-10-27T00:00:00.000Z'
  },
  {
    id: 'prompt-4',
    title: 'Viral Thought-Leadership LinkedIn & Twitter Hook Matrix',
    description: 'Crafts 10 high-engagement hooks, narrative structures, and takeaway lessons from any business or tech insight.',
    category: 'Copywriting & Content',
    targetAi: 'ChatGPT 4o',
    promptText: `Act as a top 0.1% personal brand strategist and viral LinkedIn/Twitter ghostwriter for founders and tech executives.

Core Insight / Story I Want to Share:
[CORE_INSIGHT_OR_STORY]

Target Audience:
[TARGET_AUDIENCE] (e.g., Indie hackers, Product Managers, Agency Owners)

Please provide:
1. 10 High-Engagement Hook Options categorized by style:
   - Contrarion / Myth Buster (challenges conventional wisdom)
   - The Breakdown / Framework (step-by-step tactical value)
   - The Vulnerable Case Study (failure turned into success)
   - The Data / Observation (curated pattern recognition)
2. A complete 250-word LinkedIn Post utilizing the strongest hook. Format with short, punchy paragraphs, bullet points for scannability, and an engaging question CTA at the end.
3. A 5-tweet Twitter/X Thread adapting the same insight for fast scrolling.`,
    variables: [
      { key: 'CORE_INSIGHT_OR_STORY', label: 'Core Insight or Story', placeholder: 'e.g. Why we switched from custom code to AI micro-tools and saved 20 hours a week' },
      { key: 'TARGET_AUDIENCE', label: 'Target Audience', placeholder: 'e.g. Solo entrepreneurs, SaaS founders, digital freelancers' }
    ],
    tags: ['Social Media', 'LinkedIn', 'Viral Content', 'Ghostwriting', 'Personal Brand'],
    tips: [
      'Focus the insight on a specific quantifiable transformation.',
      'Check readability grade level — aim for 6th-8th grade reading level for maximum reach.'
    ],
    order: 4,
    isPublished: true,
    isExclusiveAdmin: true,
    createdAt: '2026-10-27T00:00:00.000Z',
    updatedAt: '2026-10-27T00:00:00.000Z'
  },
  {
    id: 'prompt-5',
    title: 'Programmatic SEO & Content Cluster Architecture Engine',
    description: 'Generates a complete semantic topic cluster, keyword hierarchy, content briefs, and internal linking strategy to rank on Google search.',
    category: 'SEO & Growth',
    targetAi: 'ChatGPT 4o',
    promptText: `You are an elite Search Engine Optimization (SEO) Director and Content Strategist. I need a comprehensive programmatic content cluster plan for:

Niche / Industry: [NICHE]
Pillar Topic: [PILLAR_TOPIC]
Primary Search Intent: [SEARCH_INTENT] (e.g., Commercial investigation, Informational problem solving)
Competitor URL or Focus Area: [COMPETITOR_OR_FOCUS]

Deliverables:
1. Pillar Page Blueprint: Title tag, H1, Meta Description, and comprehensive H2/H3 outline covering all semantic subtopics.
2. 8 Supporting Cluster Articles: Low-competition, high-intent long-tail keywords that support the pillar.
3. Internal Linking Architecture: Exact anchor text rules and directional link pathways between cluster articles and the pillar page.
4. Schema.org recommendations: Recommended structured data types (FAQPage, HowTo, Article) with JSON-LD snippets.
5. Featured Snippet Optimization: 4 target question queries with 45-word direct answers formatted for Position 0.`,
    variables: [
      { key: 'NICHE', label: 'Niche / Industry', placeholder: 'e.g. AI Tools for Remote Work & Productivity' },
      { key: 'PILLAR_TOPIC', label: 'Pillar Topic', placeholder: 'e.g. The Ultimate Guide to AI Automation for Small Business' },
      { key: 'SEARCH_INTENT', label: 'Search Intent', placeholder: 'e.g. Commercial investigation + Informational' },
      { key: 'COMPETITOR_OR_FOCUS', label: 'Competitor / Focus', placeholder: 'e.g. AI workflow tutorials and free tool reviews' }
    ],
    tags: ['SEO', 'Content Strategy', 'Topic Cluster', 'Google Ranking', 'Organic Traffic'],
    tips: [
      'Use the generated FAQ snippets directly in your article schema.',
      'Ensure every cluster article links back to the pillar with primary target anchor text.'
    ],
    order: 5,
    isPublished: true,
    isExclusiveAdmin: true,
    createdAt: '2026-10-27T00:00:00.000Z',
    updatedAt: '2026-10-27T00:00:00.000Z'
  },
  {
    id: 'prompt-6',
    title: 'High-Converting Sales Landing Page Copywriting (AIDA + PAS Framework)',
    description: 'Drafts high-converting landing page copy with sticky value propositions, objection elimination, social proof framing, and compelling CTAs.',
    category: 'Copywriting & Content',
    targetAi: 'ChatGPT 4o',
    promptText: `Act as a top direct-response conversion copywriter who has generated over $10M in digital product and SaaS sales. Write the full sales landing page copy for:

Product Name: [PRODUCT_NAME]
Target Audience: [TARGET_AUDIENCE]
Price Point: [PRICE_POINT]
Core Problem Solved: [CORE_PROBLEM]
Key Features & Benefits: [KEY_BENEFITS]

Structure the copy into these sections:
1. Above the Fold:
   - Eyebrow tag
   - Irresistible H1 Headline (Under 10 words, focusing on end-result outcome)
   - Compelling Subheadline (Clarifying who it is for and how it works)
   - Primary Call to Action Button Text + Micro-copy reassurance
   - 3 Social Proof badges / trust bullet points
2. Problem Agitation (PAS Framework): Paint the costly status quo before our solution.
3. The Solution & Unique Mechanism: Explain why standard methods fail and why [PRODUCT_NAME] works.
4. Feature-to-Benefit Matrix: 4 core modules/features translated into emotional & financial benefits.
5. Risk Reversal: 30-day money-back guarantee terms written to eliminate hesitation.
6. FAQ: 5 common customer objections answered directly with clarity and confidence.`,
    variables: [
      { key: 'PRODUCT_NAME', label: 'Product Name', placeholder: 'e.g. NextGen AI Prompt Mastery Course & Toolkit' },
      { key: 'TARGET_AUDIENCE', label: 'Target Audience', placeholder: 'e.g. Freelancers, Marketers, Content Creators' },
      { key: 'PRICE_POINT', label: 'Price Point', placeholder: 'e.g. $49 one-time or $19/month' },
      { key: 'CORE_PROBLEM', label: 'Core Problem', placeholder: 'e.g. Wasting hours getting generic, low-quality AI outputs' },
      { key: 'KEY_BENEFITS', label: 'Key Benefits', placeholder: 'e.g. 500+ tested prompts, copy-paste workflows, client pitch scripts' }
    ],
    tags: ['Landing Page', 'Copywriting', 'Conversion Rate', 'AIDA', 'Digital Marketing'],
    tips: [
      'Fill in the specific objections your real prospects voice most frequently.',
      'Split-test the H1 headline generated across multiple variations.'
    ],
    order: 6,
    isPublished: true,
    isExclusiveAdmin: true,
    createdAt: '2026-10-27T00:00:00.000Z',
    updatedAt: '2026-10-27T00:00:00.000Z'
  }
];

