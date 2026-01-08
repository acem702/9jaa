import Link from 'next/link';

interface EmptyStateProps {
  message: string;
  actionText?: string;
  actionLink?: string;
}

export default function EmptyState({ message, actionText, actionLink }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-2xl border-2 border-dashed border-slate-200">
      {/* Animated icon */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          {/* Pulsing circles */}
          <div className="absolute inset-0 bg-violet-100 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-2 bg-violet-200 rounded-full animate-pulse" />
          
          {/* Icon */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-200">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        </div>
      </div>
      
      <p className="text-lg text-slate-600 font-bold mb-2">Nothing here yet</p>
      <p className="text-sm text-slate-500 font-medium mb-6 max-w-sm mx-auto">{message}</p>
      
      {actionText && actionLink && (
        <Link href={actionLink}>
          <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:scale-105 uppercase text-xs tracking-widest">
            {actionText}
          </button>
        </Link>
      )}
    </div>
  );
}
