import { Leaf } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 24, textSize = 'text-xl' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-headline font-bold ${className}`}>
      <Leaf color="hsl(var(--primary))" size={iconSize} />
      <span className={`${textSize} text-foreground`}>SEMEA Digital</span>
    </Link>
  );
}
