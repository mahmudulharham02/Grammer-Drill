import React from 'react';

export type MascotMood = 'neutral' | 'happy' | 'thinking' | 'shocked' | 'celebrating';

interface MascotProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg';
  showSpeech?: string | null;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'neutral',
  size = 'md',
  showSpeech = null,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-2xl',
    md: 'w-16 h-16 text-4xl',
    lg: 'w-24 h-24 text-6xl',
  };

  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy':
        return '🦉✨';
      case 'shocked':
        return '🦉💦';
      case 'thinking':
        return '🦉🧐';
      case 'celebrating':
        return '🦉👑';
      case 'neutral':
      default:
        return '🦉';
    }
  };

  const getAnimationClass = () => {
    switch (mood) {
      case 'happy':
        return 'animate-bounce';
      case 'shocked':
        return 'animate-shake';
      case 'celebrating':
        return 'animate-pulse scale-110';
      case 'thinking':
        return 'rotate-6 transition-transform duration-300';
      case 'neutral':
      default:
        return 'hover:scale-105 transition-transform duration-200';
    }
  };

  return (
    <div id="app-mascot-container" className="relative inline-flex flex-col items-center select-none">
      {showSpeech && (
        <div
          id="mascot-speech-bubble"
          className="absolute -top-12 bg-slate-800 text-cyan-200 text-xs px-3 py-1.5 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 whitespace-nowrap animate-fade-in z-20"
        >
          {showSpeech}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-r border-b border-cyan-500/30 rotate-45" />
        </div>
      )}

      <div
        id="mascot-avatar"
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-950/40 via-violet-950/40 to-slate-900 border border-cyan-500/20 shadow-inner cursor-pointer ${sizeClasses[size]} ${getAnimationClass()}`}
      >
        <span>{getMascotEmoji()}</span>
      </div>
    </div>
  );
};
