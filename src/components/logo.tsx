
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number; 
  textSize?: string;
}

export function Logo({ className, iconSize = 24, textSize = "text-lg" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image 
        src="/semea-logo.png" 
        alt="SEMEA Digital Logo" 
        width={iconSize * 1.8} 
        height={iconSize * 1.8} 
        className="object-contain"
      />
      <span className={`font-bold ${textSize} text-foreground`}>
        SEMEA Digital
      </span>
    </Link>
  );
}
