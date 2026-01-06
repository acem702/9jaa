// components/Navbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-[#0f172a]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Polymarket</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-400 hover:text-white'}`}>
                Trending
              </Link>
              <Link href="#" className="text-sm font-medium text-slate-400 hover:text-white">Breaking</Link>
              <Link href="#" className="text-sm font-medium text-slate-400 hover:text-white">New</Link>
              <Link href="#" className="text-sm font-medium text-slate-400 hover:text-white">Politics</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Credits</span>
                    <span className="text-sm font-bold text-blue-400">
                      {user.influence_credits.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-blue-400 font-semibold px-4 py-2 hover:bg-slate-800 rounded-lg text-sm">Log In</Link>
                <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg shadow-lg text-sm transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
