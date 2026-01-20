import Image from 'next/image';

export default function Logo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Mobile Logo - visible only on small screens */}
      <div className={`${sizeClasses[size]} w-auto sm:hidden`}>
        <Image
          src="/mobile-logo.png"
          alt="FOREKAST Mobile Logo"
          width={40}
          height={40}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
      
      {/* Window/Desktop Logo - hidden on small screens */}
      <div className={`${sizeClasses[size]} w-auto hidden sm:block`}>
        <Image
          src="/window-logo.png"
          alt="FOREKAST Logo"
          width={180}
          height={48}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}