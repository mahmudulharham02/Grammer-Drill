import React, { useState, useEffect } from 'react';

export const AuthTeaserCard: React.FC = () => {
  const [show, setShow] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hscGrammarQuest_v1.authCardDismissed') !== 'true';
    } catch {
      return false;
    }
  });
  const [seconds, setSeconds] = useState<number>(10);

  useEffect(() => {
    if (!show) return;
    if (seconds <= 0) {
      handleDismiss();
      return;
    }
    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [seconds, show]);

  const handleDismiss = () => {
    setShow(false);
    try {
      localStorage.setItem('hscGrammarQuest_v1.authCardDismissed', 'true');
    } catch {
      // Ignore localStorage errors
    }
  };

  if (!show) return null;

  return (
    <div
      id="auth-teaser-card"
      className="
        fixed left-3 right-3 z-30
        bottom-[80px]
        md:bottom-auto md:left-auto md:top-20 md:right-4 md:max-w-sm
        p-4 rounded-2xl
        bg-slate-900/85 backdrop-blur-xl
        border border-white/10
        shadow-2xl
        transition-all
      "
      style={{
        animation: 'authCardPulse 2s ease-in-out infinite',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-cyan-300">
          COMING SOON
        </span>
        <button
          id="btn-close-auth-teaser"
          type="button"
          onClick={handleDismiss}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-sm font-bold"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-slate-200 leading-relaxed">
        The application will soon incorporate authentication functionality and store user data.
      </p>

      <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
        <span>Auto-closing in</span>
        <span className="text-cyan-300 font-bold text-sm">{seconds}s</span>
      </div>
    </div>
  );
};

export default AuthTeaserCard;
