import React, { useState } from 'react';
import { Heart, Sparkles, X, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeartsShopModalProps {
  hearts: number;
  maxHearts?: number;
  diamonds: number;
  onTradeDiamonds: (hearts: number) => { success: boolean; message: string };
  onClose: () => void;
}

export const HeartsShopModal: React.FC<HeartsShopModalProps> = ({
  hearts,
  maxHearts = 20,
  diamonds,
  onTradeDiamonds,
  onClose,
}) => {
  const [confirmingPack, setConfirmingPack] = useState<{ hearts: number; cost: number } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const packs = [
    { hearts: 5, cost: 1, label: 'Quick Boost', desc: 'Replenish 5 hearts', color: 'from-pink-500/20 to-rose-500/20' },
    { hearts: 10, cost: 2, label: 'Standard Pack', desc: 'Replenish 10 hearts', color: 'from-purple-500/20 to-pink-500/20' },
    { hearts: 15, cost: 3, label: 'Mega Bundle', desc: 'Replenish 15 hearts', color: 'from-cyan-500/20 to-blue-500/20' },
    { hearts: 20, cost: 4, label: 'Full Refill', desc: 'Max 20 hearts instantly', popular: true, color: 'from-amber-500/20 to-rose-500/20' },
  ];

  const handleBuyClick = (pack: { hearts: number; cost: number }) => {
    soundManager.playClick();
    setConfirmingPack(pack);
  };

  const handleConfirmPurchase = () => {
    if (!confirmingPack) return;
    const res = onTradeDiamonds(confirmingPack.hearts);
    if (res.success) {
      soundManager.playReward();
      setFeedback(res.message);
      setConfirmingPack(null);
    } else {
      soundManager.playIncorrect();
      setFeedback(res.message);
      setConfirmingPack(null);
    }
  };

  return (
    <div
      id="modal-hearts-shop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="glass-panel w-full max-w-lg rounded-3xl p-5 sm:p-6 border border-pink-500/30 shadow-2xl relative my-auto animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center space-y-1.5 mb-5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl heart-pulse">❤️</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Hearts & Diamond Exchange</h2>
            <span className="text-2xl">💎</span>
          </div>
          <p className="text-xs text-slate-300">
            Exchange diamonds to instantly refill your hearts and never stop practicing!
          </p>
        </div>

        {/* Balances Bar */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              <span className="text-xs text-rose-200 font-semibold">Hearts</span>
            </div>
            <span className="text-base font-extrabold text-white font-mono">
              {hearts} / {maxHearts}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💎</span>
              <span className="text-xs text-amber-200 font-semibold">Diamonds</span>
            </div>
            <span className="text-base font-extrabold text-amber-400 font-mono">
              {diamonds}
            </span>
          </div>
        </div>

        {/* Auto regen info banner */}
        <div className="mb-4 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-cyan-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Hearts automatically replenish at <strong>+1 heart every 1 minute</strong>.</span>
        </div>

        {feedback && (
          <div className="mb-4 p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-xs text-cyan-200 text-center font-medium">
            {feedback}
          </div>
        )}

        {/* Confirmation Modal overlay inside */}
        {confirmingPack ? (
          <div className="p-5 rounded-2xl bg-slate-900 border border-pink-500/40 text-center space-y-4 animate-fade-in">
            <div className="text-3xl">✨💎➡️❤️</div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Confirm Exchange</h3>
              <p className="text-xs text-slate-300 mt-1">
                Spend <strong className="text-amber-400">{confirmingPack.cost} 💎</strong> for{' '}
                <strong className="text-rose-400">+{confirmingPack.hearts} Hearts</strong>?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingPack(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs font-extrabold shadow-lg shadow-pink-500/25"
              >
                Confirm Exchange
              </button>
            </div>
          </div>
        ) : (
          /* Packs Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packs.map((pack) => {
              const canAfford = diamonds >= pack.cost;
              const isFull = hearts >= maxHearts;
              return (
                <div
                  key={pack.hearts}
                  className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    pack.popular
                      ? 'bg-gradient-to-br from-amber-500/10 to-rose-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                      Best Value
                    </span>
                  )}

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{pack.label}</span>
                      <span className="text-xs font-mono font-bold text-rose-400">
                        +{pack.hearts} ❤️
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{pack.desc}</p>
                  </div>

                  <button
                    disabled={!canAfford || isFull}
                    onClick={() => handleBuyClick(pack)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/15 active:scale-[0.98]'
                        : 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {isFull
                        ? 'Hearts Full'
                        : canAfford
                        ? `Buy for ${pack.cost} 💎`
                        : `Need ${pack.cost} 💎`}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tip footer */}
        <p className="text-[11px] text-slate-400 text-center mt-4">
          💡 <em>Tip: Answer questions correctly (+1 💎) and complete daily challenges (+10 💎) to earn free diamonds!</em>
        </p>
      </div>
    </div>
  );
};
