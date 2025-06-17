
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
        <div className="container flex h-16 items-center justify-between px-3 md:px-4 md:relative md:justify-start">
          {/* Logo à esquerda */}
          <Logo iconSize={22} textSize="text-base md:text-lg" className="flex-shrink-0" />
          
          {/* Navegação centralizada: em linha para mobile, absoluta para desktop */}
          <nav className="flex flex-shrink-0 items-center space-x-1 text-sm font-medium sm:space-x-1.5 md:flex-shrink md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:space-x-2 lg:space-x-3">
            {navItems.map((item) => (
              <Tooltip key={item.label} delayDuration={100}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className="flex items-center justify-center rounded-md p-1 text-primary/90 transition-colors hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring sm:p-1.5 md:p-2"
                    aria-label={item.label}
                  >
                    <item.icon className="h-5 w-5 shrink-0 md:h-6 md:w-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>

          {/* Botões de autenticação à direita */}
          <div className="flex flex-shrink-0 items-center space-x-1 md:space-x-2 md:ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/login"
                  passHref
                  legacyBehavior 
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
                  legacyBehavior 
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
