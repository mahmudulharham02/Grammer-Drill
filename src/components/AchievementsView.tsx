import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, CheckCircle2, Lock, Flame } from 'lucide-react';
import { AppState, Badge } from '../types';
import { ALL_BADGES } from '../data/badges';
import { soundManager } from '../utils/sound';

interface AchievementsViewProps {
  state: AppState;
  onClaimBadge: (badgeId: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ state, onClaimBadge }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedSet = new Set(state.badges);
  const unclaimedSet = new Set(state.unclaimedBadges || []);

  const filteredBadges = ALL_BADGES.filter((b) => {
    const isUnlocked = unlockedSet.has(b.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const handleClaim = (badge: Badge) => {
    soundManager.playCoin();
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#a78bfa', '#22d3ee'],
      });
    } catch {
      // ignore
    }
    onClaimBadge(badge.id);
  };

  return (
    <div id="achievements-view" className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-violet-400" />
            <span>Badges & Achievements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Unlock trophies by maintaining study streaks, mastering topics, and leveling up.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: `All (${ALL_BADGES.length})` },
            { id: 'unlocked', label: `Unlocked (${unlockedSet.size})` },
            { id: 'locked', label: `Locked (${ALL_BADGES.length - unlockedSet.size})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setFilter(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-violet-500 text-black shadow-md shadow-violet-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = unlockedSet.has(badge.id);
          const isUnclaimed = unclaimedSet.has(badge.id);

          return (
            <div
              key={badge.id}
              className={`rounded-3xl p-5 border transition-all flex flex-col justify-between relative ${
                isUnlocked
                  ? 'bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-900 border-violet-500/40 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 opacity-60'
              }`}
            >
              {isUnclaimed && (
                <div className="absolute -top-2 -right-2 px-2.5 py-0.5 bg-amber-400 text-black font-extrabold text-[10px] rounded-full shadow-lg animate-pulse">
                  Claim Reward! 🎁
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700">
                    {badge.icon}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isUnlocked
                        ? 'bg-lime-950 text-lime-400 border-lime-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{badge.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">
                  +{badge.xpReward} XP • +{badge.coinReward} 💎
                </span>

                {isUnclaimed ? (
                  <button
                    onClick={() => handleClaim(badge)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-md transition-transform hover:scale-105"
                  >
                    Claim 🎁
                  </button>
                ) : isUnlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-lime-400" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
