import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HowToUsePageProps {
  onNavigate: (path: string) => void;
}

export const HowToUsePage: React.FC<HowToUsePageProps> = ({ onNavigate }) => {
  const coreRules = [
    {
      num: '01',
      title: 'Assign a Clear Role or Perspective',
      explanation: 'Tell the AI who it should emulate. For example, "Act as an experienced career coach" or "Act as an introductory biology tutor". This sets the vocabulary, depth, and tone instantly.'
    },
    {
      num: '02',
      title: 'Provide Relevant Context',
      explanation: 'Give background details before asking for the solution. Mention your target audience, existing knowledge level, time constraints, or specific style preferences.'
    },
    {
      num: '03',
      title: 'Define the Exact Desired Format',
      explanation: 'Be explicit about how the output should look. Specify: "Provide 3 bullet points under 50 words each", "Create a markdown comparison table", or "Draft a step-by-step numbered checklist".'
    },
    {
      num: '04',
      title: 'Iterate with Follow-Up Feedback',
      explanation: 'Never settle for the first response if it is not quite right. Reply with: "Make it more concise", "Explain step 2 with a simple analogy", or "Adopt a more professional tone".'
    }
  ];

  const toolPicker = [
    {
      task: 'Writing, drafting emails, and brainstorming ideas',
      recommendedTool: 'ChatGPT or Claude',
      why: 'Both have exceptional conversational pacing and handle natural back-and-forth iteration smoothly.'
    },
    {
      task: 'Checking live internet facts, finding sources, and academic queries',
      recommendedTool: 'Perplexity AI',
      why: 'Perplexity synthesizes live web pages and adds numbered citation links for every claim.'
    },
    {
      task: 'Editing long essays, reviewing code, or creating visual web prototypes',
      recommendedTool: 'Claude (with Artifacts)',
      why: 'Claude offers superior literary nuance and can render interactive components live in its side panel.'
    },
    {
      task: 'Summarizing YouTube videos, Google Docs, or Google Maps directions',
      recommendedTool: 'Google Gemini',
      why: 'Built directly into Google Workspace with extensions to summarize YouTube and Drive files.'
    },
    {
      task: 'Asking sensitive questions without an account or identity tracking',
      recommendedTool: 'Duck.ai',
      why: 'Zero account required, no IP logging, and chats are never used to train future AI models.'
    },
    {
      task: 'Casual mobile chatting, group conversations, and instant image generation',
      recommendedTool: 'Meta AI',
      why: 'Embedded for free right inside WhatsApp, Instagram, and Messenger apps.'
    }
  ];

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 px-3.5 py-1 text-xs text-[#6C5CE7] font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Beginner Practical Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#172033] tracking-tight">
            How to Use AI Effectively
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            You don’t need a technical background or complex programming skills to get incredible value from modern AI. Follow these core principles to get accurate, high-quality answers every time.
          </p>
        </div>

        {/* Section 1: The 4 Core Rules of Prompting */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
              The 4 Core Rules of Prompting
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreRules.map((rule) => (
              <div 
                key={rule.num}
                className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] space-y-2 hover:border-[#6C5CE7]/30 transition-colors"
              >
                <span className="font-mono text-xs font-bold text-[#6C5CE7]">Rule {rule.num}</span>
                <h3 className="text-base font-bold text-[#172033]">
                  {rule.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {rule.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Which Tool Should You Use? */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#4285F4]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
              Which AI Tool Should You Use for Your Task?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Different AI assistants have specialized strengths. Use this quick reference guide to pick the best assistant for what you want to accomplish:
          </p>

          <div className="space-y-3 pt-2">
            {toolPicker.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
              >
                <div className="space-y-1 max-w-md">
                  <span className="font-bold text-[#172033] block">{item.task}</span>
                  <span className="text-[#64748B] text-xs block">{item.why}</span>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white text-[#6C5CE7] border border-[#E8ECF4] font-bold text-xs shadow-2xs">
                    {item.recommendedTool}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Safe Fact-Checking Checklist */}
        <section className="rounded-3xl bg-white border border-[#E8ECF4] p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
              How to Avoid Mistakes & Fact-Check AI Output
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            AI models are statistical pattern engines, not infallible truth databases. They can occasionally invent convincing-sounding falsehoods called &ldquo;hallucinations&rdquo;. Keep these safety checks in mind:
          </p>

          <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#172033]">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#172033]">Check Numbers, Dates, and Citations:</strong>
                <span className="text-[#64748B]">Never publish a statistic, historical date, or legal statute without checking a reputable primary source.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#4285F4] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#172033]">Use Perplexity for Fact-Dense Queries:</strong>
                <span className="text-[#64748B]">Perplexity displays clickable citation links to the original web pages for instant verification.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#6C5CE7] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#172033]">Keep Sensitive Credentials Private:</strong>
                <span className="text-[#64748B]">Never paste passwords, credit card numbers, or proprietary client secrets into standard public AI chats. Use Duck.ai or enterprise plans for confidential work.</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-6">
          <button
            onClick={() => onNavigate('/ai-tools')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-[#6C5CE7]/20 transition-all cursor-pointer"
          >
            <span>Explore the 7 Featured AI Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
