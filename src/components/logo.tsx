import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number; // This will be used for width and height of the image
  textSize?: string;
}

export function Logo({ className, iconSize = 24, textSize = "text-lg" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {/* Substitua "minha-logo.png" pelo nome exato do seu arquivo de logo na pasta /public */}
      <Image 
        src="/minha-logo.png" 
        alt="SEMEA Digital Logo" 
        width={iconSize * 1.5} // Ajuste o multiplicador conforme necessário para o tamanho desejado
        height={iconSize * 1.5} // Ajuste o multiplicador conforme necessário para o tamanho desejado
        className="object-contain" // Garante que a imagem se ajuste sem cortar, mantendo a proporção
      />
      <span className={`font-bold ${textSize} text-foreground`}>SEMEA Digital</span>
    </Link>
  );
}
