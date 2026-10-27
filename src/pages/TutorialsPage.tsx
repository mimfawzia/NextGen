import React, { useState } from 'react';
import { Sparkles, Clock, Copy, Check, ChevronDown, ChevronUp, BookOpen, ArrowRight } from 'lucide-react';
import { TutorialItem } from '../types';

interface TutorialsPageProps {
  tutorials: TutorialItem[];
  onNavigate: (path: string) => void;
}

export const TutorialsPage: React.FC<TutorialsPageProps> = ({ tutorials, onNavigate }) => {
  const [expandedTutorialId, setExpandedTutorialId] = useState<string | null>(tutorials[0]?.id || null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#6C5CE7]/10 border border-[#6C5CE7]/20 px-3.5 py-1 text-xs text-[#6C5CE7] font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practical Learning Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#172033] tracking-tight">
            Step-by-Step AI Tutorials
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
            Follow clear, visual, beginner-friendly tutorials to master prompting, research fact-checking, and rapid digital prototyping.
          </p>
        </div>

        {/* Tutorials List */}
        <div className="space-y-6">
          {tutorials.map((tut) => {
            const isExpanded = expandedTutorialId === tut.id;
            return (
              <div
                key={tut.id}
                className="rounded-3xl bg-white border border-[#E8ECF4] shadow-xs hover:border-[#6C5CE7]/40 transition-all overflow-hidden"
              >
                {/* Tutorial Summary Bar */}
                <div 
                  onClick={() => setExpandedTutorialId(isExpanded ? null : tut.id)}
                  className="p-6 sm:p-8 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC]/60 transition-colors"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                      <span className="text-[#6C5CE7] bg-[#6C5CE7]/8 px-2.5 py-0.5 rounded-full font-bold">
                        {tut.category}
                      </span>
                      <span>·</span>
                      <span className="text-[#172033] font-bold">{tut.toolName}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-[#64748B]" />
                        {tut.readTime}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#172033] leading-snug">
                      {tut.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                      {tut.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-[#6C5CE7]">
                      {isExpanded ? 'Hide Steps' : 'View Tutorial'}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8FAFC] border border-[#E8ECF4] text-[#6C5CE7]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Steps */}
                {isExpanded && (
                  <div className="p-6 sm:p-8 pt-0 border-t border-[#E8ECF4] bg-[#F8FAFC] space-y-6">
                    <div className="space-y-4 pt-6">
                      {tut.steps.map((st) => (
                        <div 
                          key={st.stepNumber}
                          className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8ECF4] shadow-2xs space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6C5CE7] to-[#4285F4] text-xs font-bold text-white">
                              {st.stepNumber}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-[#172033]">
                              {st.title}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pl-10">
                            {st.description}
                          </p>

                          {st.codeOrPrompt && (
                            <div className="ml-10 mt-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] font-mono text-xs text-[#172033] relative">
                              <code>{st.codeOrPrompt}</code>
                              <button
                                onClick={() => handleCopyPrompt(st.codeOrPrompt!, `${tut.id}-${st.stepNumber}`)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white border border-[#E8ECF4] text-[#6C5CE7] hover:text-[#4285F4] text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                {copiedPromptId === `${tut.id}-${st.stepNumber}` ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-[#64748B]">
                        Ready to try with {tut.toolName}?
                      </span>
                      <button
                        onClick={() => onNavigate(`/ai-tools/${tut.toolSlug}`)}
                        className="text-xs font-bold text-[#6C5CE7] hover:text-[#4285F4] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View {tut.toolName} Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
