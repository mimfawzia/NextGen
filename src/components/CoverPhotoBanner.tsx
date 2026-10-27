import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Sliders, 
  X, 
  Check, 
  RotateCcw, 
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  TrendingUp,
  Compass
} from 'lucide-react';
import { CoverPhotoSettings, CoverStyle, SiteSettings } from '../types';
import { ToolStorageService } from '../services/toolStorage';

interface CoverPhotoBannerProps {
  settings: SiteSettings;
  onUpdateSettings?: (newSettings: SiteSettings) => void;
  isAdmin?: boolean;
}

const PRESET_STYLES: { id: CoverStyle; name: string; banglaName: string; gradient: string; preview: string }[] = [
  {
    id: 'gradient-vibrant',
    name: 'Vibrant Electric',
    banglaName: 'ভাইব্রেন্ট ইলেকট্রিক (বেগুনি ও নীল)',
    gradient: 'linear-gradient(135deg, #6C5CE7 0%, #4834D4 35%, #4285F4 70%, #00CEC9 100%)',
    preview: 'from-[#6C5CE7] via-[#4285F4] to-[#00CEC9]'
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset Magenta',
    banglaName: 'সানসেট কোরাল ও পার্পল',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FD79A8 30%, #6C5CE7 70%, #4285F4 100%)',
    preview: 'from-[#FF6B6B] via-[#6C5CE7] to-[#4285F4]'
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora Borealis',
    banglaName: 'অরোরা নিয়ন ও এমারেল্ড',
    gradient: 'linear-gradient(135deg, #00B894 0%, #0984E3 45%, #6C5CE7 85%, #55EFC4 100%)',
    preview: 'from-[#00B894] via-[#0984E3] to-[#6C5CE7]'
  },
  {
    id: 'gradient-cyber',
    name: 'Cyberpunk Mesh',
    banglaName: 'সাইবারপাঙ্ক মেশ',
    gradient: 'linear-gradient(135deg, #E056FD 0%, #686DE0 40%, #30336B 80%, #22A6B3 100%)',
    preview: 'from-[#E056FD] via-[#686DE0] to-[#22A6B3]'
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Breeze Azure',
    banglaName: 'সাগর নীল এজ্যুর',
    gradient: 'linear-gradient(135deg, #0984E3 0%, #74B9FF 50%, #6C5CE7 100%)',
    preview: 'from-[#0984E3] via-[#74B9FF] to-[#6C5CE7]'
  },
  {
    id: 'mesh-glow',
    name: 'Deep Nebula Glow',
    banglaName: 'ডিপ নেবুলা গ্লো',
    gradient: 'radial-gradient(circle at 20% 30%, #6C5CE7 0%, #4285F4 40%, #172033 100%)',
    preview: 'from-[#6C5CE7] via-[#4285F4] to-[#172033]'
  },
  {
    id: 'custom-image',
    name: 'Custom Cover Photo',
    banglaName: 'কাস্টম কভার ফটো',
    gradient: 'linear-gradient(135deg, #6C5CE7 0%, #4285F4 100%)',
    preview: 'from-[#6C5CE7] to-[#4285F4]'
  }
];

export const CoverPhotoBanner: React.FC<CoverPhotoBannerProps> = ({
  settings,
  onUpdateSettings
}) => {
  const currentCover = settings.coverPhoto || {
    enabled: true,
    style: 'gradient-vibrant',
    customImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    height: 'medium',
    opacity: 90,
    blur: 0,
    title: 'Explore Next-Generation AI Intelligence',
    subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
    showBadges: true
  };

  const [isOpenCustomizer, setIsOpenCustomizer] = useState(false);
  const [tempCover, setTempCover] = useState<CoverPhotoSettings>(currentCover);
  const [saveToast, setSaveToast] = useState(false);

  // Sync state if settings change from outside
  React.useEffect(() => {
    if (settings.coverPhoto) {
      setTempCover(settings.coverPhoto);
    }
  }, [settings.coverPhoto]);

  const activePreset = PRESET_STYLES.find(p => p.id === tempCover.style) || PRESET_STYLES[0];

  const heightClasses = {
    compact: 'h-40 sm:h-48',
    medium: 'h-56 sm:h-64',
    tall: 'h-72 sm:h-84'
  }[tempCover.height || 'medium'];

  const handleApplyAndSave = () => {
    const updated: SiteSettings = {
      ...settings,
      coverPhoto: tempCover
    };
    ToolStorageService.saveSettings(updated);
    if (onUpdateSettings) {
      onUpdateSettings(updated);
    }
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      setIsOpenCustomizer(false);
    }, 1200);
  };

  const handleReset = () => {
    const defaultCover: CoverPhotoSettings = {
      enabled: true,
      style: 'gradient-vibrant',
      customImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      height: 'medium',
      opacity: 90,
      blur: 0,
      title: 'Explore Next-Generation AI Intelligence',
      subtitle: 'Curated AI tools, guided workflows, and practical digital income strategies.',
      showBadges: true
    };
    setTempCover(defaultCover);
  };

  if (!tempCover.enabled) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Visual Cover Layer */}
      <div 
        className={`relative w-full ${heightClasses} transition-all duration-300 flex items-center justify-center`}
        style={{
          background: tempCover.style === 'custom-image' && tempCover.customImageUrl 
            ? `url("${tempCover.customImageUrl}") center/cover no-repeat` 
            : activePreset.gradient,
          opacity: (tempCover.opacity || 90) / 100,
          filter: tempCover.blur ? `blur(${tempCover.blur}px)` : 'none'
        }}
      >
        {/* Subtle geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-80 h-80 rounded-full bg-cyan-300/20 blur-3xl pointer-events-none" />
      </div>

      {/* Foreground Content on Banner (Crisp & Unblurred) */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto pointer-events-none">
        {/* Top Bar: Kicker and Customize Button */}
        <div className="flex items-center justify-between gap-3 pointer-events-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-md px-3.5 py-1 text-xs text-white font-medium border border-white/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>NextGen AI Guide</span>
            <span className="opacity-60">•</span>
            <span className="text-white/90">Curated & Verified</span>
          </div>

          {/* Quick Adjust Button */}
          <button
            onClick={() => setIsOpenCustomizer(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#172033] text-xs font-bold shadow-md hover:shadow-lg backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Adjust cover photo style, height, and colors (কালারফুল ও আডজাস্টেবল কভার)"
          >
            <Palette className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>Adjust Cover</span>
            <span className="hidden sm:inline text-[10px] text-[#64748B] font-semibold">(কভার পরিবর্তন)</span>
          </button>
        </div>

        {/* Center / Bottom: Title & Badges */}
        <div className="space-y-3 pointer-events-auto">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {tempCover.title || 'Explore Next-Generation AI Intelligence'}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium drop-shadow-sm">
              {tempCover.subtitle || 'Curated AI tools, guided workflows, and practical digital income strategies.'}
            </p>
          </div>

          {/* Interactive Badges */}
          {tempCover.showBadges !== false && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                7 Featured Tools
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Step-by-Step Tutorials
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
                Income Playbooks
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ADJUSTMENT MODAL / DRAWER */}
      {isOpenCustomizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E8ECF4] shadow-2xl p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8ECF4]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#4285F4] text-white shadow-md shadow-[#6C5CE7]/20">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#172033]">
                    Cover Photo Customizer
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    কালারফুল ও আডজাস্টেবল কভার ফটো কন্ট্রোল
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpenCustomizer(false)}
                className="p-1.5 rounded-full hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Selection */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider">
                Color Palette & Style (কালার প্রিসেট)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_STYLES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setTempCover(prev => ({ ...prev, style: preset.id }))}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      tempCover.style === preset.id
                        ? 'border-[#6C5CE7] bg-[#6C5CE7]/5 ring-2 ring-[#6C5CE7]/20'
                        : 'border-[#E8ECF4] hover:border-[#6C5CE7]/40 bg-white'
                    }`}
                  >
                    <div 
                      className="w-7 h-7 rounded-xl shrink-0 shadow-xs border border-white/30"
                      style={{ background: preset.gradient }}
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-[#172033] truncate">
                        {preset.name}
                      </span>
                      <span className="block text-[10px] text-[#64748B] truncate">
                        {preset.banglaName}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image URL (Shown if style === 'custom-image') */}
            {tempCover.style === 'custom-image' && (
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF4]">
                <label className="block text-xs font-bold text-[#172033]">
                  Custom Image URL (ছবির ওয়েব লিংক)
                </label>
                <input
                  type="url"
                  value={tempCover.customImageUrl || ''}
                  onChange={(e) => setTempCover(prev => ({ ...prev, customImageUrl: e.target.value }))}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl bg-white border border-[#E8ECF4] px-3.5 py-2 text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
                <p className="text-[11px] text-[#64748B]">
                  Unsplash বা অন্য যেকোনো পাবলিক হাই-রেজ্যুলেশন ছবির লিংক দিন।
                </p>
              </div>
            )}

            {/* Height Adjustment */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-[#172033] tracking-wider">
                Banner Height (উচ্চতা নির্বাচন)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['compact', 'medium', 'tall'] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => setTempCover(prev => ({ ...prev, height: h }))}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      tempCover.height === h
                        ? 'bg-[#6C5CE7] text-white shadow-xs'
                        : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] border border-[#E8ECF4]'
                    }`}
                  >
                    {h} ({h === 'compact' ? 'ছোট' : h === 'medium' ? 'মাঝারি' : 'বড়'})
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Opacity & Blur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#172033]">
                  <span>Intensity / Opacity</span>
                  <span className="text-[#6C5CE7]">{tempCover.opacity || 90}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={tempCover.opacity || 90}
                  onChange={(e) => setTempCover(prev => ({ ...prev, opacity: Number(e.target.value) }))}
                  className="w-full accent-[#6C5CE7] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-[#172033]">
                  <span>Softness / Blur</span>
                  <span className="text-[#6C5CE7]">{tempCover.blur || 0}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={tempCover.blur || 0}
                  onChange={(e) => setTempCover(prev => ({ ...prev, blur: Number(e.target.value) }))}
                  className="w-full accent-[#6C5CE7] cursor-pointer"
                />
              </div>
            </div>

            {/* Banner Titles Customization */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Banner Title (কভার শিরোনাম)
                </label>
                <input
                  type="text"
                  value={tempCover.title || ''}
                  onChange={(e) => setTempCover(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Banner headline"
                  className="w-full rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] px-3.5 py-2 text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Banner Subtitle (সাবটাইটেল)
                </label>
                <input
                  type="text"
                  value={tempCover.subtitle || ''}
                  onChange={(e) => setTempCover(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Banner short description"
                  className="w-full rounded-xl bg-[#F8FAFC] border border-[#E8ECF4] px-3.5 py-2 text-xs text-[#172033] focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>
            </div>

            {/* Actions: Save / Reset */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8ECF4]">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpenCustomizer(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#172033] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleApplyAndSave}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#4285F4] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#6C5CE7]/20 transition-all cursor-pointer"
                >
                  {saveToast ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes (সংরক্ষণ)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
