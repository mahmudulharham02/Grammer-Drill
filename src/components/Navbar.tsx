import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Lightbulb,
  Flame,
  Volume2,
  VolumeX,
  ShoppingBag,
  Settings,
  BookOpen,
  Award,
  BarChart3,
  Home,
  Layers,
  RotateCcw,
  Bookmark,
  Menu,
  X,
  FileText,
  User,
  Zap,
} from 'lucide-react';
import { AppState } from '../types';
import { getNextHeartRegenSeconds, formatHMS } from '../utils/storage';
import { soundManager } from '../utils/sound';

interface NavbarProps {
  state: AppState;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenShop: () => void;
  onOpenHeartsShop: (tab?: 'hearts' | 'hints') => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  currentRoute,
  onNavigate,
  onOpenShop,
  onOpenHeartsShop,
  onOpenSettings,
  onOpenRules,
  onToggleSound,
}) => {
  const [regenSecs, setRegenSecs] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      setRegenSecs(getNextHeartRegenSeconds(state));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const formatRegenTime = (seconds: number) => {
    return formatHMS(seconds);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'topics', label: 'Topics', icon: BookOpen },
    { id: 'practice_hub', label: 'Drills', icon: Zap, badge: 'Voice & Narration' },
    { id: 'changing_sentences', label: 'Transformations', icon: Layers, badge: '⭐ 10M' },
    { id: 'review_wrong', label: 'Errors', icon: RotateCcw, count: state.wrongQuestionReviewPool.length },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, count: state.bookmarkedQuestionIds.length },
    { id: 'achievements', label: 'Badges', icon: Award, count: state.unclaimedBadges?.length || 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const isRefilling = state.hearts < state.maxHearts;

  return (
    <>
      {/* Fix #3: Fixed Mobile Header (max 64px height, z-index 20) */}
      <header
        id="main-navbar"
        className="fixed top-0 left-0 right-0 z-20 h-16 w-full border-b border-slate-800/80 bg-[#0a0e1a]/95 backdrop-blur-xl transition-all select-none"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              id="brand-logo-container"
              onClick={() => {
                soundManager.playClick();
                onNavigate('home');
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-violet-600 to-pink-500 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                <div className="w-full h-full bg-[#0a0e1a] rounded-[10px] flex items-center justify-center p-1">
                  <img
                    src="/logo1.png"
                    alt="Gramify"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-cyan-300 via-violet-200 to-pink-300 bg-clip-text text-transparent leading-tight">
                  Gramify
                </span>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px] hidden sm:block leading-none mt-0.5">
                  {state.user.name || 'HSC Aspirant'} • Lvl {state.level}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav-links" className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate(item.id);
                  }}
                  className={`relative px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[8px] bg-lime-500/20 text-lime-300 px-1 py-0.2 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Status Stats Bar */}
          <div id="stats-header-bar" className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Hearts (Lives) - Tap to open Hearts Shop */}
            <button
              id="stat-hearts-badge"
              onClick={() => {
                soundManager.playClick();
                onOpenHeartsShop('hearts');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-extrabold text-xs hover:bg-rose-500/25 transition-all cursor-pointer group"
              title={
                isRefilling
                  ? `Hearts refilling (+1 per 3 hours). Next in ${formatRegenTime(regenSecs)}. Tap to open Shop.`
                  : 'Hearts full (20/20). Tap to open Shop.'
              }
            >
              <Heart
                className={`w-3.5 h-3.5 fill-rose-500 text-rose-500 ${
                  isRefilling ? 'heart-pulse' : ''
                }`}
              />
              <span className="font-mono text-xs">{state.hearts}</span>
              {isRefilling && (
                <span className="text-[9px] text-rose-300/80 font-mono hidden md:inline ml-0.5">
                  ({formatRegenTime(regenSecs)})
                </span>
              )}
            </button>

            {/* Diamonds (💎) - Tap to open Shop */}
            <button
              id="stat-diamonds-badge"
              onClick={() => {
                soundManager.playCoin();
                onOpenHeartsShop('hearts');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-extrabold text-xs hover:bg-cyan-500/25 transition-all cursor-pointer"
              title="Diamonds Balance. Tap to open Shop."
            >
              <span className="text-xs">💎</span>
              <span className="font-mono text-xs">{state.diamonds ?? 20}</span>
            </button>

            {/* Hints (💡) - Tap to open Hint Shop */}
            <button
              id="stat-hints-badge"
              onClick={() => {
                soundManager.playClick();
                onOpenHeartsShop('hints');
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-extrabold text-xs hover:bg-amber-500/25 transition-all cursor-pointer"
              title="50/50 Hints Inventory (Max 8). Tap to open Hint Shop."
            >
              <Lightbulb className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-mono text-xs">{state.inventory?.hints ?? 3}</span>
            </button>

            {/* Streak */}
            <div
              id="stat-streak-badge"
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-xs"
              title="Daily Streak"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{state.streak}</span>
            </div>

            {/* Settings */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Settings & Backup"
              aria-label="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Navigation Drawer Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hamburger Menu Drawer (z-index 30) */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-md lg:hidden pt-20 px-4 pb-24 overflow-y-auto animate-fade-in"
        >
          <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2">
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{state.user.avatar || '🧑‍🎓'}</span>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {state.user.name || 'HSC Aspirant'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Roll: {state.user.roll || 'N/A'} • Lvl {state.level}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('profile');
                }}
                className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
              >
                Profile
              </button>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    setMobileMenuOpen(false);
                    onNavigate(item.id);
                  }}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-lime-500/20 text-lime-300 px-1.5 py-0.5 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-2 py-0.5 text-[9px] rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* ARHAM credit in hamburger menu drawer at bottom */}
            <div className="pt-4 mt-3 border-t border-slate-800/80 text-center space-y-1">
              <div className="text-xs font-medium text-slate-400">
                Made with <span className="text-rose-400 animate-pulse">❤️</span> by{' '}
                <strong className="text-pink-400 font-extrabold">ARHAM</strong>
              </div>
              <p className="text-[10px] text-slate-500">
                Gramify · HSC Board Edition
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Fixed Nav Bar (z-index 40) */}
      <div
        id="mobile-bottom-bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e1a]/95 backdrop-blur-lg border-t border-slate-800 px-2 pt-1.5 pb-[10px] flex items-center justify-around"
      >
        <button
          id="mobile-tab-home"
          onClick={() => {
            soundManager.playClick();
            onNavigate('home');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentRoute === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Home</span>
        </button>

        <button
          id="mobile-tab-topics"
          onClick={() => {
            soundManager.playClick();
            onNavigate('topics');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentRoute === 'topics' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Topics</span>
        </button>

        <button
          id="mobile-tab-drills"
          onClick={() => {
            soundManager.playClick();
            onNavigate('practice_hub');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            currentRoute === 'practice_hub' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Drills</span>
        </button>

        <button
          id="mobile-tab-changing"
          onClick={() => {
            soundManager.playClick();
            onNavigate('changing_sentences');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            currentRoute === 'changing_sentences' ? 'text-lime-400 font-bold' : 'text-slate-400'
          }`}
        >
          <div className="absolute -top-1 px-1 py-0.2 bg-lime-500 text-black text-[7px] font-extrabold rounded-full">
            10M
          </div>
          <Layers className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Transform</span>
        </button>

        <button
          id="mobile-tab-profile"
          onClick={() => {
            soundManager.playClick();
            onNavigate('profile');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentRoute === 'profile' ? 'text-violet-400 font-bold' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Profile</span>
        </button>
      </div>
    </>
  );
};
