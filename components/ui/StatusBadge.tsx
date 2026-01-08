interface StatusBadgeProps {
  status: string;
  variant?: 'status' | 'position' | 'resolution';
}

export default function StatusBadge({ status, variant = 'status' }: StatusBadgeProps) {
  const getStyles = () => {
    const normalizedStatus = status.toLowerCase();

    if (variant === 'position') {
      return normalizedStatus === 'yes'
        ? 'bg-violet-50 text-violet-700 border-violet-200'
        : 'bg-rose-50 text-rose-700 border-rose-200';
    }

    if (variant === 'resolution') {
      return normalizedStatus.includes('yes')
        ? 'bg-violet-50 text-violet-700 border-violet-100'
        : 'bg-rose-50 text-rose-700 border-rose-100';
    }

    // status variant
    switch (normalizedStatus) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'locked':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'resolved':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStyles()}`}>
      {status}
    </span>
  );
}
