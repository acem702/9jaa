"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <span className="text-2xl font-black text-blue-600 cursor-pointer tracking-tight">
                Political<span className="text-gray-900">Sentiment</span>
              </span>
            </Link>
            
            {user && (
              <div className="hidden md:flex space-x-1">
                <Link href="/">
                  Markets
                </Link>
                <Link href="/portfolio">
                  Portfolio
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-blue-600 font-medium">Credits</span>
                    <span className="text-sm font-bold text-blue-700">
                      {user.influence_credits.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-sm">
                    Sign Up
                  </button>
                </Link>
              </>
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
      <span className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}>
        {children}
      </span>
    </Link>
  );
}