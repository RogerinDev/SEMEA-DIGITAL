/**
 * @fileoverview Componente reutilizável para exibir títulos de página padronizados.
 * Inclui um ícone opcional, o título principal e uma descrição opcional.
 */

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils'; // Utilitário para mesclar classes CSS.

// Propriedades do componente PageTitle.
interface PageTitleProps {
  title: string;
  icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
  description?: string;
}

/**
 * Renderiza um título de página padronizado.
 * @param {PageTitleProps} props - As propriedades do componente.
 * @returns {React.ReactElement} O componente de título de página.
 */
export function PageTitle({ title, icon: Icon, iconClassName, className, description }: PageTitleProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3">
        {/* Renderiza o ícone se ele for fornecido. */}
        {Icon && <Icon className={cn("h-8 w-8 text-primary", iconClassName)} />}
        {/* Título principal. */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>
      {/* Renderiza a descrição se ela for fornecida. */}
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  );
}
