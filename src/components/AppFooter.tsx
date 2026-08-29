import React from 'react';

interface AppFooterProps {
  hidden?: boolean;
  onToast?: (message: string) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ hidden = false, onToast }) => {
  if (hidden) return null;

  const handleClick = () => {
    if (onToast) {
      onToast('ARHAM made this with love for YOU 💖');
    }
  };

  return (
    <footer
      id="persistent-app-footer"
      className="w-full border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-6 px-4 mt-12 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Credential text */}
        <div
          onClick={handleClick}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 select-none cursor-pointer hover:text-slate-200 transition-colors"
          title="Click for creator note"
        >
          <span>Made with</span>
          <span className="heart-pulse text-rose-400">❤️</span>
          <span>by</span>
          <strong className="text-pink-400 font-extrabold hover:underline tracking-wide">
            ARHAM
          </strong>
        </div>

        {/* LaunchVault Badge */}
        <div className="flex items-center justify-center">
          <a
            href="https://www.launchvault.dev"
            target="_blank"
            rel="noopener noreferrer"
            title="Featured on LaunchVault"
            className="inline-block transition-transform hover:scale-105 active:scale-95 duration-200"
          >
            <img
              src="https://www.launchvault.dev/images/badges/launch-valut-badge.svg"
              alt="Featured on LaunchVault"
              style={{ width: '195px', height: 'auto' }}
              className="w-[180px] sm:w-[195px] h-auto drop-shadow-md"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
