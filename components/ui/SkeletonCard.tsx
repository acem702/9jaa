export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <div className="w-16 h-5 bg-slate-200 rounded-lg" />
          <div className="w-12 h-5 bg-slate-200 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-4 bg-slate-200 rounded" />
          <div className="w-8 h-4 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2 mb-2">
        <div className="w-full h-4 bg-slate-200 rounded" />
        <div className="w-3/4 h-4 bg-slate-200 rounded" />
      </div>

      {/* Sparkline */}
      <div className="mb-3 h-8 bg-slate-100 rounded" />

      {/* Bottom section */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex-1 flex flex-col items-center">
          <div className="w-24 h-12 bg-slate-200 rounded-full mb-2" />
          <div className="w-20 h-6 bg-slate-200 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="w-16 h-16 bg-slate-200 rounded-lg" />
          <div className="w-16 h-16 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
