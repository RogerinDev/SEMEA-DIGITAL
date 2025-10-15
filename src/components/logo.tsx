/**
 * @fileoverview Componente reutilizável para exibir o logotipo da SEMEA Digital.
 * O componente é um link para a página inicial e pode ter seu tamanho e
 * estilo customizados através de props.
 */

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Propriedades do componente Logo.
interface LogoProps {
  className?: string; // Classes CSS adicionais para o container do link.
  iconSize?: number;  // Tamanho (altura e largura) do ícone do logo.
  textSize?: string;  // Classe de tamanho do texto (ex: "text-lg", "text-2xl").
}

/**
 * Renderiza o logotipo da aplicação como um link para a página inicial.
 * @param {LogoProps} props - As propriedades para customizar o logo.
 * @returns {React.ReactElement} O componente do logo.
 */
export function Logo({ className, iconSize = 24, textSize = "text-lg" }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      {/* Componente Image do Next.js para otimização da imagem do logo. */}
      <Image 
        src="/semea-logo.png" 
        alt="SEMEA Digital Logo" 
        width={iconSize}
        height={iconSize} 
        className="object-contain" // Garante que a imagem não seja cortada.
      />
      {/* Texto do logo. */}
      <span className={cn('font-bold', textSize)}>
        SEMEA Digital
      </span>
    </Link>
  );
}
