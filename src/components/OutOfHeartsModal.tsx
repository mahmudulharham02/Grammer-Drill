import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Clock, Tv, X, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface OutOfHeartsModalProps {
  diamonds: number;
  regenSecondsLeft: number;
  lastAdWatchedAt: string | null;
  onTradeDiamonds: (hearts: number) => { success: boolean; message: string };
  onWatchMockAd: () => { success: boolean; message: string };
  onClose?: () => void;
}

export const OutOfHeartsModal: React.FC<OutOfHeartsModalProps> = ({
  diamonds,
  regenSecondsLeft,
  lastAdWatchedAt,
  onTradeDiamonds,
  onWatchMockAd,
  onClose,
}) => {
  const [seconds, setSeconds] = useState(regenSecondsLeft || 60);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Countdown timer for next heart
  useEffect(() => {
    setSeconds(regenSecondsLeft > 0 ? regenSecondsLeft : 60);
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [regenSecondsLeft]);

  // Handle Mock Ad 30s timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWatchingAd) {
      const stepMs = 300;
      const totalSteps = 30000 / stepMs;
      timer = setInterval(() => {
        setAdProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            const res = onWatchMockAd();
            setIsWatchingAd(false);
            soundManager.playReward();
            setStatusMessage(res.message);
            return 100;
          }
          return prev + 100 / totalSteps;
        });
      }, stepMs);
    }
    return () => clearInterval(timer);
  }, [isWatchingAd, onWatchMockAd]);

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTrade = (hearts: number) => {
    soundManager.playClick();
    const res = onTradeDiamonds(hearts);
    if (res.success) {
      soundManager.playReward();
      setStatusMessage(res.message);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } else {
      soundManager.playIncorrect();
      setStatusMessage(res.message);
    }
  };

  // Check ad cooldown
  const canWatchAd = (() => {
    if (!lastAdWatchedAt) return true;
    const elapsed = Date.now() - new Date(lastAdWatchedAt).getTime();
    return elapsed >= 10 * 60 * 1000;
  })();

  const getAdCooldownMinutes = () => {
    if (!lastAdWatchedAt) return 0;
    const elapsed = Date.now() - new Date(lastAdWatchedAt).getTime();
    return Math.max(1, Math.ceil((10 * 60 * 1000 - elapsed) / 60000));
  };

  return (
    <div
      id="modal-out-of-hearts"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="glass-panel w-full max-w-md rounded-3xl p-5 sm:p-6 border border-rose-500/40 shadow-2xl relative animate-fade-in my-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl animate-bounce">
            💔
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Out of Hearts!</h2>
          <p className="text-xs text-slate-300">
            You need at least 1 ❤️ to continue your grammar drills. Choose how to replenish:
          </p>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-cyan-950/70 border border-cyan-500/50 text-xs text-cyan-200 text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3">
          {/* Option 1: Wait & Auto-Refill */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Wait for Auto-Refill</h4>
                <p className="text-[11px] text-cyan-300 font-mono">
                  Next heart in: <span className="font-bold">{formatTime(seconds)}</span>
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-[10px] font-semibold text-slate-400 border border-slate-700">
              +1/min
            </span>
          </div>

          {/* Option 2: Trade Diamonds */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">💎</span>
                <h4 className="text-xs font-bold text-white">Trade Diamonds (1 💎 = 5 ❤️)</h4>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                Balance: {diamonds} 💎
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={diamonds < 1}
                onClick={() => handleTrade(5)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  diamonds >= 1
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/40 text-white'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold text-rose-300">+5 ❤️</span>
                <span className="text-[10px] font-mono text-amber-400">1 💎</span>
              </button>

              <button
                type="button"
                disabled={diamonds < 2}
                onClick={() => handleTrade(10)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  diamonds >= 2
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/50 text-white'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold text-rose-300">+10 ❤️</span>
                <span className="text-[10px] font-mono text-amber-400">2 💎</span>
              </button>

              <button
                type="button"
                disabled={diamonds < 4}
                onClick={() => handleTrade(20)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  diamonds >= 4
                    ? 'bg-gradient-to-br from-amber-500/20 to-rose-500/20 hover:scale-[1.02] border-amber-400 text-white shadow-md shadow-amber-500/10'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold text-rose-300">+20 ❤️</span>
                <span className="text-[10px] font-mono text-amber-400">4 💎 (Full)</span>
              </button>
            </div>
          </div>

          {/* Option 3: Watch Mock Ad */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white">Sponsor Video (Mock)</h4>
              </div>
              <span className="text-[10px] text-purple-300 font-bold">+5 ❤️</span>
            </div>

            {isWatchingAd ? (
              <div className="space-y-2 py-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Watching sponsor clip...</span>
                  <span className="font-mono">{Math.round(adProgress)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${adProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={!canWatchAd}
                onClick={() => {
                  soundManager.playClick();
                  setIsWatchingAd(true);
                  setAdProgress(0);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  canWatchAd
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>
                  {canWatchAd
                    ? 'Watch Sponsor Clip (+5 Hearts)'
                    : `Available in ${getAdCooldownMinutes()}m`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
