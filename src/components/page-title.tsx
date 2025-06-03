import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
  description?: string;
}

export function PageTitle({ title, icon: Icon, iconClassName, className, description }: PageTitleProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className={cn("h-8 w-8 text-primary", iconClassName)} />}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  );
}
