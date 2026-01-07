// components/Navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/30">
                <span className="text-white font-black text-xl">9</span>
              </div>
            </Link>
          </div>
            
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/" active={pathname === '/'}>
              Markets
            </NavLink>
            <NavLink href="/portfolio" active={pathname === '/portfolio'}>
              Portfolio
            </NavLink>
            <NavLink href="/leaderboard" active={pathname === '/leaderboard'}>
              Leaderboard
            </NavLink>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors w-full text-left text-sm font-medium text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
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

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <span className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer text-sm ${
        active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}>
        {children}
      </span>
    </Link>
  );
}
