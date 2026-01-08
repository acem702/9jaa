interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black text-slate-900 mb-2">{title}</h1>
      {subtitle && <p className="text-slate-600 font-bold text-sm">{subtitle}</p>}
    </div>
  );
}
