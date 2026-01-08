interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all border ${
        active
          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
          : 'bg-white text-slate-500 hover:text-slate-700 border-slate-200'
      }`}
    >
      {children}
    </button>
  );
}
