import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number; // Will be used for the image width, height will be auto
  textSize?: string; // No longer directly applicable if text is part of image
}

export function Logo({ className, iconSize = 150 }: LogoProps) {
  // Assuming the new logo image includes all necessary text.
  // User will need to place 'logo-semea-varginha.png' in the /public folder
  // or replace '/logo-semea-varginha.png' with the correct URL.
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo-semea-varginha.png" // IMPORTANT: Replace with your actual logo path/URL
        alt="SEMEA Varginha Logo"
        width={iconSize} // Adjust width as needed, height will be inferred by aspect ratio
        height={40} // Adjust height based on your logo's aspect ratio and desired display size
        priority // Add priority if the logo is critical for LCP
        data-ai-hint="SEMEA Varginha official logo"
      />
      {/* The text span is removed as the new logo image likely contains the text */}
    </Link>
  );
}
