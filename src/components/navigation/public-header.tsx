
"use client";

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Briefcase, Info, LogIn, UserPlus, TreePine, Droplets, CalendarDays, GraduationCap, PawPrint, Sun, Moon, Edit, Lock, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/theme-context';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function PublicHeader() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

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
          <Logo iconSize={22} textSize="text-base md:text-lg" className="flex-shrink-0" />
          
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

          <div className="flex flex-shrink-0 items-center space-x-1 md:space-x-2 md:ml-auto">
            {currentUser ? (
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border-2 border-primary/50">
                          <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || 'User'} />
                          <AvatarFallback>{currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Meu Perfil</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/citizen/profile">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar Informações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/citizen/profile/change-password">
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Trocar Senha</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/login"
                      passHref
                      className={cn(buttonVariants({ variant: "secondary", size: "icon" }))}
                    >
                      <LogIn className="h-4 w-4" />
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
                      className={cn(buttonVariants({ variant: "default", size: "icon" }))}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Registrar</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
                  {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
    </header>
  );
}
