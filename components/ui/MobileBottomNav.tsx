"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
      iconActive: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      )
    },
    {
      href: '/portfolio',
      label: 'Portfolio',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      iconActive: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      href: '/leaderboard',
      label: 'Ranks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      iconActive: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      href: '/activity',
      label: 'Activity',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconActive: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 md:hidden z-50 safe-area-bottom shadow-lg shadow-slate-200/20">
      {/* Active indicator bar */}
      <div className="h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 ease-out" 
           style={{ 
             width: '25%',
             transform: `translateX(${navItems.findIndex(item => pathname === item.href) * 100}%)`
           }} 
      />
      <div className="flex justify-around py-3 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-90 relative group"
            >
              {/* Active background glow */}
              {isActive && (
                <div className="absolute inset-0 bg-violet-100/50 rounded-2xl -z-10 scale-125" />
              )}
              
              <div className={`transition-all duration-200 ${
                isActive 
                  ? 'text-violet-600 scale-110 drop-shadow-sm' 
                  : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-105 group-active:scale-95'
              }`}>
                {isActive ? item.iconActive : item.icon}
              </div>
              
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {item.label}
              </span>
              
              {/* Active dot indicator */}
              {isActive && (
                <div className="absolute -top-0.5 w-1 h-1 bg-violet-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}