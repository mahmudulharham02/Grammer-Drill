import React from 'react';
import confetti from 'canvas-confetti';
import { X, ShoppingBag, Heart, Sparkles, Check, Lock } from 'lucide-react';
import { AppState, ShopItem } from '../types';
import { SHOP_ITEMS } from '../data/shopItems';
import { soundManager } from '../utils/sound';

interface ShopModalProps {
  state: AppState;
  onBuyItem: (item: ShopItem) => void;
  onEquipItem: (category: string, itemId: string) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  state,
  onBuyItem,
  onEquipItem,
  onClose,
}) => {
  const handlePurchase = (item: ShopItem) => {
    if (state.coins < item.cost) {
      soundManager.playWrong();
      return;
    }
    soundManager.playCoin();
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#22d3ee'],
      });
    } catch {
      // ignore
    }
    onBuyItem(item);
  };

  const isItemOwned = (item: ShopItem) => {
    if (item.category === 'frame') {
      return state.inventory.avatarFrames.includes(item.id);
    }
    if (item.category === 'theme') {
      return state.inventory.themes.includes(item.id);
    }
    return false;
  };

  const isItemEquipped = (item: ShopItem) => {
    if (item.category === 'frame') {
      return state.user.avatarFrame === item.id;
    }
    if (item.category === 'theme') {
      return state.activeTheme === item.id;
    }
    return false;
  };

  return (
    <div
      id="modal-shop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-amber-500/30 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl">
              💎
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Grammar Quest Shop</h2>
              <p className="text-xs text-slate-400">
                Spend coins earned through drills on power-ups, themes & frames!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold text-sm">
              <span>💎</span>
              <span>{state.coins} Coins</span>
            </div>

            <button
              id="btn-close-shop"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SHOP_ITEMS.map((item) => {
              const owned = isItemOwned(item);
              const equipped = isItemEquipped(item);
              const canAfford = state.coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/30 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-slate-700">
                        {item.icon}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {item.cost} 💎
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{item.name || item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    {item.category === 'hearts' || item.category === 'hints' || item.category === 'boost' ? (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-extrabold text-xs shadow-md transition-transform active:scale-95"
                      >
                        Buy for {item.cost} 💎
                      </button>
                    ) : owned ? (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onEquipItem(item.category, item.id);
                        }}
                        className={`w-full py-2 rounded-xl font-bold text-xs transition-all ${
                          equipped
                            ? 'bg-lime-950 text-lime-400 border border-lime-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {equipped ? '✓ Equipped' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford}
                        className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-extrabold text-xs shadow-md transition-transform active:scale-95"
                      >
                        Unlock for {item.cost} 💎
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
