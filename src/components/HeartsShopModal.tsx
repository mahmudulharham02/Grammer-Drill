import React, { useState } from 'react';
import { Heart, Lightbulb, Sparkles, X, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeartsShopModalProps {
  hearts: number;
  maxHearts?: number;
  hints?: number;
  maxHints?: number;
  diamonds: number;
  initialTab?: 'hearts' | 'hints';
  onTradeDiamonds: (hearts: number, cost?: number) => { success: boolean; message: string };
  onTradeHints: (hints: number, cost: number) => { success: boolean; message: string };
  onClose: () => void;
}

export const HeartsShopModal: React.FC<HeartsShopModalProps> = ({
  hearts,
  maxHearts = 20,
  hints = 3,
  maxHints = 8,
  diamonds,
  initialTab = 'hearts',
  onTradeDiamonds,
  onTradeHints,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'hearts' | 'hints'>(initialTab);
  const [confirmingPack, setConfirmingPack] = useState<{
    type: 'hearts' | 'hints';
    amount: number;
    cost: number;
    label: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Hearts exchange rate: 1 💎 = 3 hearts
  const heartPacks = [
    { hearts: 3, cost: 1, label: 'Small', desc: 'Replenish 3 hearts', color: 'from-pink-500/20 to-rose-500/20' },
    { hearts: 9, cost: 3, label: 'Medium', desc: 'Replenish 9 hearts', color: 'from-purple-500/20 to-pink-500/20' },
    { hearts: 15, cost: 5, label: 'Large', desc: 'Replenish 15 hearts', color: 'from-cyan-500/20 to-blue-500/20' },
    { hearts: 20, cost: 7, label: 'Full (20 cap)', desc: 'Max out 20 hearts instantly', popular: true, color: 'from-amber-500/20 to-rose-500/20' },
  ];

  // New Hints exchange rate: 1 💎 = 2 hints (max 8)
  const hintPacks = [
    { hints: 2, cost: 1, label: 'Small', desc: '+2 50/50 hint points', color: 'from-amber-500/20 to-yellow-500/20' },
    { hints: 4, cost: 2, label: 'Medium', desc: '+4 50/50 hint points', color: 'from-yellow-500/20 to-amber-500/20' },
    { hints: 6, cost: 3, label: 'Large', desc: '+6 50/50 hint points', color: 'from-violet-500/20 to-purple-500/20' },
    { hints: 8, cost: 4, label: 'Max Out (8)', desc: 'Top up to 8 max hints', popular: true, color: 'from-cyan-500/20 to-emerald-500/20' },
  ];

  const handleBuyHeartsClick = (pack: { hearts: number; cost: number; label: string }) => {
    soundManager.playClick();
    setConfirmingPack({
      type: 'hearts',
      amount: pack.hearts,
      cost: pack.cost,
      label: pack.label,
    });
  };

  const handleBuyHintsClick = (pack: { hints: number; cost: number; label: string }) => {
    soundManager.playClick();
    setConfirmingPack({
      type: 'hints',
      amount: pack.hints,
      cost: pack.cost,
      label: pack.label,
    });
  };

  const handleConfirmPurchase = () => {
    if (!confirmingPack) return;
    if (confirmingPack.type === 'hearts') {
      const res = onTradeDiamonds(confirmingPack.amount, confirmingPack.cost);
      if (res.success) {
        soundManager.playReward();
        setFeedback(res.message);
        setConfirmingPack(null);
      } else {
        soundManager.playIncorrect();
        setFeedback(res.message);
        setConfirmingPack(null);
      }
    } else {
      const res = onTradeHints(confirmingPack.amount, confirmingPack.cost);
      if (res.success) {
        soundManager.playReward();
        setFeedback(res.message);
        setConfirmingPack(null);
      } else {
        soundManager.playIncorrect();
        setFeedback(res.message);
        setConfirmingPack(null);
      }
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
        <div className="text-center space-y-1 mb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl heart-pulse">❤️</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Grammar Resource Shop</h2>
            <span className="text-2xl">💎</span>
          </div>
          <p className="text-xs text-slate-300">
            Exchange diamonds to refill hearts or boost your 50/50 quiz hints!
          </p>
        </div>

        {/* Unified 3-Item Balances Bar: Hearts · Hints · Diamonds */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-1">
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span className="text-[11px] text-rose-200 font-semibold">Hearts</span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
              {hearts}/{maxHearts}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-1">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-[11px] text-amber-200 font-semibold">Hints</span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-amber-300 font-mono">
              {hints}/{maxHints}
            </span>
          </div>

          <div className="p-2.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💎</span>
              <span className="text-[11px] text-cyan-200 font-semibold">Diamonds</span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-cyan-300 font-mono">
              {diamonds}
            </span>
          </div>
        </div>

        {/* 2-Tab Navigation (Hearts | Hints) */}
        <div className="flex p-1 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('hearts');
              setConfirmingPack(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'hearts'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>❤️</span>
            <span>Hearts Refill</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('hints');
              setConfirmingPack(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'hints'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💡</span>
            <span>Hint Points</span>
          </button>
        </div>

        {/* Auto regen info banner / hints banner */}
        {activeTab === 'hearts' ? (
          <div className="mb-4 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-cyan-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Hearts automatically replenish at <strong>+1 heart every 3 hours</strong>.
            </span>
          </div>
        ) : (
          <div className="mb-4 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-[11px] text-amber-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Hints eliminate 2 wrong options in MCQ drills. Max inventory is <strong>8 hints</strong>.
            </span>
          </div>
        )}

        {feedback && (
          <div className="mb-4 p-3 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-xs text-cyan-200 text-center font-medium">
            {feedback}
          </div>
        )}

        {/* Confirmation Modal overlay inside */}
        {confirmingPack ? (
          <div className="p-5 rounded-2xl bg-slate-900 border border-pink-500/40 text-center space-y-4 animate-fade-in">
            <div className="text-3xl">
              {confirmingPack.type === 'hearts' ? '✨💎➡️❤️' : '✨💎➡️💡'}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Confirm Exchange</h3>
              <p className="text-xs text-slate-300 mt-1">
                Spend <strong className="text-cyan-400">{confirmingPack.cost} 💎</strong> for{' '}
                <strong className={confirmingPack.type === 'hearts' ? 'text-rose-400' : 'text-amber-400'}>
                  +{confirmingPack.amount} {confirmingPack.type === 'hearts' ? 'Hearts' : 'Hints'}
                </strong>?
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
        ) : activeTab === 'hearts' ? (
          /* Hearts Packs Grid (1 💎 = 3 hearts) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {heartPacks.map((pack) => {
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
                    onClick={() => handleBuyHeartsClick(pack)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-extrabold shadow-md shadow-rose-500/20 active:scale-[0.98]'
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
        ) : (
          /* Hints Packs Grid (1 💎 = 2 hints, max 8) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hintPacks.map((pack) => {
              const canAfford = diamonds >= pack.cost;
              const isFull = hints >= maxHints;
              return (
                <div
                  key={pack.hints}
                  className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    pack.popular
                      ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {pack.popular && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                      Max Pack
                    </span>
                  )}

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white">{pack.label}</span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        +{pack.hints} 💡
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{pack.desc}</p>
                  </div>

                  <button
                    disabled={!canAfford || isFull}
                    onClick={() => handleBuyHintsClick(pack)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isFull
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold shadow-md shadow-amber-500/20 active:scale-[0.98]'
                        : 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {isFull
                        ? 'Hints Full (8/8)'
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
