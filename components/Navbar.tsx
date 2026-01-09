// components/Navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center group">
              <Logo size="md" />
            </Link>
            <Link href="/" className="hidden sm:block group">
              <span className="text-xl font-extrabold text-slate-950 group-hover:text-violet-600 transition-colors duration-200 tracking-tight">9ja Markets</span>
            </Link>
          </div>
            
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" active={pathname === '/'} icon="chart">
              Markets
            </NavLink>
            <NavLink href="/portfolio" active={pathname === '/portfolio'} icon="briefcase">
              Portfolio
            </NavLink>
            <NavLink href="/activity" active={pathname === '/activity'} icon="activity">
              Activity
            </NavLink>
            <NavLink href="/leaderboard" active={pathname === '/leaderboard'} icon="trophy">
              Leaderboard
            </NavLink>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-br from-violet-50/80 to-purple-50/80 backdrop-blur-sm border border-violet-200/60 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100 transition-all duration-200 active:scale-95"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Influence Credits */}
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-slate-950 leading-tight hidden sm:block">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-violet-600 leading-tight">
                      <span className="inline-flex items-center gap-0.5">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {user.influence_credits.toLocaleString()}
                      </span>
                    </span>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-950">{user.name}</p>
                        <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2 px-2 py-1.5 bg-violet-50 rounded-lg">
                          <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-bold text-violet-600">{user.influence_credits.toLocaleString()} credits</span>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link href="/portfolio" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          My Portfolio
                        </Link>
                        <Link href="/activity" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Activity
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors w-full text-left text-sm font-medium text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/login" className="px-3 sm:px-4 py-2 text-sm font-semibold text-slate-600 hover:text-violet-600 transition-colors duration-200">
                  Login
                </Link>
                <Link href="/register" className="px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all duration-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children, icon }: { href: string; active: boolean; children: React.ReactNode; icon?: string }) {
  const getIcon = () => {
    switch(icon) {
      case 'chart':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'briefcase':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'activity':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'trophy':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={href}>
      <span className={`px-3 py-2 rounded-xl font-bold transition-all duration-200 cursor-pointer text-sm flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
          : 'text-slate-500 hover:bg-slate-100/80 hover:text-violet-600'
      } active:scale-95`}>
        {icon && getIcon()}
        {children}
      </span>
    </Link>
  );
}
