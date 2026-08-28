import React from 'react';

interface AppFooterProps {
  hidden?: boolean;
  onToast?: (message: string) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ hidden = false, onToast }) => {
  if (hidden) return null;

  const handleClick = () => {
    if (onToast) {
      onToast('ARHAM made this with love for HSC students 💖');
    }
  };

  return (
    <footer
      id="persistent-app-footer"
      onClick={handleClick}
      className="app-footer cursor-pointer hover:text-slate-200 transition-colors"
      title="Click for creator note"
    >
      <span>Made with</span>
      <span className="heart-pulse mx-1 text-rose-400">❤️</span>
      <span>by</span>
      <strong className="ml-1 text-pink-400 font-extrabold hover:underline">ARHAM</strong>
    </footer>
  );
};
