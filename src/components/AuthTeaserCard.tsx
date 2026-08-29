import React, { useState, useEffect } from 'react';

export const AuthTeaserCard: React.FC = () => {
  const [show, setShow] = useState<boolean>(true);
  const [seconds, setSeconds] = useState<number>(10);

  useEffect(() => {
    if (!show) return;
    if (seconds <= 0) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [seconds, show]);

  if (!show) return null;

  return (
    <div
      id="auth-teaser-card"
      className="
        fixed left-3 right-3 z-30
        bottom-[80px]
        md:bottom-auto md:left-auto md:top-20 md:right-4 md:max-w-sm
        p-4 rounded-2xl
        bg-black
        border border-white/20
        shadow-2xl shadow-black/50
        transition-all
      "
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest font-bold text-white">
          Coming Soon
        </span>
        <button
          id="btn-close-auth-teaser"
          type="button"
          onClick={() => setShow(false)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-white hover:bg-white/10 transition-colors text-sm font-bold"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <p className="text-sm text-white leading-relaxed">
        The application will soon incorporate{' '}
        <strong className="font-bold">authentication functionality</strong> and{' '}
        <strong className="font-bold">store user data</strong>.
      </p>

      <div className="flex items-center gap-2 mt-3 text-xs text-white">
        <span>Auto-closing in</span>
        <span className="font-bold text-sm">{seconds}s</span>
      </div>
    </div>
  );
};

export default AuthTeaserCard;
