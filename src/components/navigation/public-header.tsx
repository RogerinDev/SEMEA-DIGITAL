
"use client";

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Briefcase, Info, LogIn, UserPlus, TreePine, Droplets, CalendarDays, GraduationCap, PawPrint } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function PublicHeader() {
  const navItems = [
    { href: '/info/urban-afforestation', label: 'Arborização', icon: TreePine },
    { href: '/info/waste-management', label: 'Resíduos', icon: Droplets },
    { href: '/info/education', label: 'Educação Ambiental', icon: GraduationCap },
    { href: '/animal-welfare', label: 'Bem Estar Animal', icon: PawPrint },
    { href: '/dashboard/citizen', label: 'Serviços', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Adicionado relative e removido justify-between. items-center é mantido. */}
        <div className="container relative flex h-16 items-center">
          {/* Logo à esquerda */}
          <Logo iconSize={28} className="ml-2 flex-shrink-0 md:ml-0" />
          
          {/* Navegação centralizada absolutamente */}
          <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center space-x-3 text-sm font-medium">
            {navItems.map((item) => (
              <Tooltip key={item.label} delayDuration={100}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className="flex items-center justify-center p-2 rounded-md text-primary/90 transition-colors hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={item.label}
                  >
                    <item.icon className="h-7 w-7 shrink-0" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>

          {/* Botões de autenticação à direita, empurrados com ml-auto */}
          <div className="ml-auto flex flex-shrink-0 items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/login"
                  passHref
                  legacyBehavior // Necessário se cn(buttonVariants(...)) retorna uma string e não um componente diretamente
                  className={cn(buttonVariants({ variant: "secondary", size: "icon" }))}
                >
                  <a aria-label="Entrar">
                    <LogIn className="h-4 w-4" />
                  </a>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Entrar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                 <Link
                  href="/register"
                  passHref
                  legacyBehavior // Necessário
                  className={cn(buttonVariants({ variant: "default", size: "icon" }))}
                >
                  <a aria-label="Registrar">
                     <UserPlus className="h-4 w-4" />
                  </a>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Registrar</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
    </header>
  );
}
