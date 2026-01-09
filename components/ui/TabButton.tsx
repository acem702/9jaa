'use client';

import { useState } from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function TabButton({ active, onClick, children }: TabButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
        active
          ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/20'
          : 'bg-white/70 backdrop-blur-sm text-slate-500 hover:text-violet-600 border-slate-200/80 hover:border-violet-300 hover:bg-violet-50/50'
      } ${isPressed ? 'scale-95' : 'scale-100'} active:scale-95`}
    >
      {children}
    </button>
  );
}
