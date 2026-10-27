import React from 'react';

interface ToolIconProps {
  type: string;
  className?: string;
  size?: number;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ type, className = 'w-6 h-6', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  switch (type.toLowerCase()) {
    case 'chatgpt':
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={className} 
          style={style}
          aria-label="ChatGPT Icon"
        >
          {/* OpenAI Knot Icon */}
          <path d="M19.5 10c.3-1.1 0-2.3-.7-3.2-1.1-1.3-2.9-1.7-4.4-1.1C13.8 4.7 12.5 4 11 4c-1.8 0-3.3 1.1-3.9 2.7-1.4.3-2.5 1.3-2.9 2.7-.6 1.7-.1 3.5 1.1 4.7-.3 1.1 0 2.3.7 3.2 1.1 1.3 2.9 1.7 4.4 1.1.6 1 1.9 1.7 3.4 1.7 1.8 0 3.3-1.1 3.9-2.7 1.4-.3 2.5-1.3 2.9-2.7.6-1.7.1-3.5-1.1-4.7z" className="text-[#10A37F]" fill="currentColor" fillOpacity="0.15" />
          <path d="M12 8.5v7M8.5 10.25l7 3.5M8.5 13.75l7-3.5" stroke="#10A37F" strokeWidth="1.8" />
        </svg>
      );

    case 'gemini':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className={className} 
          style={style}
          aria-label="Google Gemini Icon"
        >
          {/* Gemini Four-Point Star Burst */}
          <defs>
            <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4E82EE" />
              <stop offset="50%" stopColor="#9B72CB" />
              <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
          </defs>
          <path 
            d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z" 
            fill="url(#geminiGrad)"
          />
        </svg>
      );

    case 'claude':
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={className} 
          style={style}
          aria-label="Claude Icon"
        >
          {/* Anthropic Claude Sunburst / Asterisk */}
          <path 
            d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M5.636 18.364L18.364 5.636" 
            stroke="#D97706" 
            strokeWidth="3.2" 
            strokeLinecap="round"
          />
        </svg>
      );

    case 'copilot':
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={className} 
          style={style}
          aria-label="Microsoft Copilot Icon"
        >
          <defs>
            <linearGradient id="copilotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0078D4" />
              <stop offset="50%" stopColor="#5C2D91" />
              <stop offset="100%" stopColor="#00B294" />
            </linearGradient>
          </defs>
          <path 
            d="M5 9a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" 
            stroke="url(#copilotGrad)" 
            strokeWidth="2" 
            fill="url(#copilotGrad)" 
            fillOpacity="0.2"
          />
          <path 
            d="M9 15a4 4 0 0 1 4 4v1H8a4 4 0 0 1-4-4v-1h5z" 
            fill="url(#copilotGrad)"
          />
        </svg>
      );

    case 'perplexity':
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={className} 
          style={style}
          aria-label="Perplexity AI Icon"
        >
          {/* Perplexity Asterisk Grid */}
          <path 
            d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" 
            stroke="#20B2AA" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <circle cx="12" cy="12" r="3" fill="#20B2AA" />
        </svg>
      );

    case 'duck-ai':
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={className} 
          style={style}
          aria-label="Duck.ai Icon"
        >
          {/* Clean Duck.ai silhouette mark with shield/privacy motif */}
          <path 
            d="M12 2C8 2 4 4.5 4 8.5c0 3 1.5 5 3.5 6.5C8 18 10 22 12 22s4-4 4.5-7c2-1.5 3.5-3.5 3.5-6.5C20 4.5 16 2 12 2z" 
            fill="#E86E25" 
            fillOpacity="0.18"
            stroke="#E86E25" 
            strokeWidth="1.8"
          />
          <circle cx="9.5" cy="8" r="1.5" fill="#E86E25" />
          <path d="M12 11c1.5 0 3 .5 4 1.5" stroke="#E86E25" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'meta-ai':
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={className} 
          style={style}
          aria-label="Meta AI Icon"
        >
          {/* Meta Infinity Ring */}
          <defs>
            <linearGradient id="metaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0081FB" />
              <stop offset="100%" stopColor="#0064E0" />
            </linearGradient>
          </defs>
          <path 
            d="M16.5 6c-1.8 0-3.3 1-4.5 2.6C10.8 7 9.3 6 7.5 6 4.5 6 2 8.5 2 12s2.5 6 5.5 6c1.8 0 3.3-1 4.5-2.6 1.2 1.6 2.7 2.6 4.5 2.6 3 0 5.5-2.5 5.5-6s-2.5-6-5.5-6zm-9 9.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5c1.4 0 2.6.9 3.2 2.2-.6 1.4-1.8 2.3-3.2 2.3zm9 0c-1.4 0-2.6-.9-3.2-2.3.6-1.3 1.8-2.2 3.2-2.2 1.9 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5z" 
            fill="url(#metaGrad)" 
          />
        </svg>
      );

    default:
      return (
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className={className} 
          style={style}
        >
          <circle cx="12" cy="12" r="9" className="text-[#6366F1]" stroke="currentColor" fill="#6366F1" fillOpacity="0.2" />
          <path d="M12 8v8M8 12h8" stroke="currentColor" className="text-white" strokeLinecap="round" />
        </svg>
      );
  }
};
