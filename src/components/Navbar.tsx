import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
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
  Zap
} from 'lucide-react';
import { AppState } from '../types';
import { getNextHeartRegenSeconds } from '../utils/storage';
import { soundManager } from '../utils/sound';

interface NavbarProps {
  state: AppState;
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  currentRoute,
  onNavigate,
  onOpenShop,
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'practice_hub', label: 'Drills', icon: Zap, badge: 'Voice & Narration' },
    { id: 'topics', label: 'All Topics', icon: BookOpen },
    { id: 'changing_sentences', label: 'Transformations', icon: Layers, badge: '⭐ 10M' },
    { id: 'review_wrong', label: 'Errors', icon: RotateCcw, count: state.wrongQuestionReviewPool.length },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, count: state.bookmarkedQuestionIds.length },
    { id: 'achievements', label: 'Badges', icon: Award, count: state.unclaimedBadges?.length || 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Fix #3: Fixed Mobile Header (max 64px height, z-index 20) */}
      <header
        id="main-navbar"
        className="fixed top-0 left-0 right-0 z-20 h-16 w-full border-b border-slate-800/80 bg-[#0a0e1a]/90 backdrop-blur-xl transition-all"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between">
          {/* Brand Logo & Student Profile preview */}
          <div className="flex items-center gap-3">
            <div
              id="brand-logo-container"
              onClick={() => {
                soundManager.playClick();
                onNavigate('home');
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0a0e1a] rounded-[10px] flex items-center justify-center">
                  <span className="text-lg">🎓</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                    HSC Grammar Quest
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    v2
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                  {state.user.name || 'HSC Aspirant'} • Lvl {state.level}
                </p>
              </div>
            </div>

            {/* Student Avatar quick profile launcher on mobile */}
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('profile');
              }}
              className="sm:hidden flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs"
            >
              <span>{state.user.avatar || '🧑‍🎓'}</span>
              <span className="font-bold text-white max-w-[70px] truncate text-[11px]">
                {state.user.name?.split(' ')[0] || 'Profile'}
              </span>
            </button>
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
            {/* Hearts / Lives */}
            <div
              id="stat-hearts-badge"
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-extrabold text-xs"
              title={
                state.hearts < state.maxHearts
                  ? `Next heart in ${formatRegenTime(regenSecs)}`
                  : 'Full Hearts'
              }
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{state.hearts}</span>
              {state.hearts < state.maxHearts && (
                <span className="text-[9px] text-rose-300/80 font-mono hidden md:inline ml-0.5">
                  ({formatRegenTime(regenSecs)})
                </span>
              )}
            </div>

            {/* Streak */}
            <div
              id="stat-streak-badge"
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-xs"
              title="Current Daily Study Streak"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{state.streak}</span>
            </div>

            {/* Coins */}
            <div
              id="stat-coins-badge"
              onClick={() => {
                soundManager.playCoin();
                onOpenShop();
              }}
              className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-extrabold text-xs hover:bg-cyan-500/20 transition-colors"
              title="Grammar Shop"
            >
              <span>💎</span>
              <span>{state.coins}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleSound();
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title={state.settings.sound ? 'Mute Sound' : 'Enable Sound'}
            >
              {state.settings.sound ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Settings & Backup"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Hamburger Button on Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700"
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
                  <span className="text-xs font-bold text-white block">{state.user.name || 'HSC Aspirant'}</span>
                  <span className="text-[10px] text-slate-400">Roll: {state.user.roll || 'N/A'} • Lvl {state.level}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('profile');
                }}
                className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg"
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
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Bottom Fixed Nav Bar (z-index 40) */}
      <div
        id="mobile-bottom-bar"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0e1a]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around"
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
          id="mobile-tab-review"
          onClick={() => {
            soundManager.playClick();
            onNavigate('review_wrong');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            currentRoute === 'review_wrong' ? 'text-rose-400 font-bold' : 'text-slate-400'
          }`}
        >
          {state.wrongQuestionReviewPool.length > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
          <RotateCcw className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Errors</span>
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
