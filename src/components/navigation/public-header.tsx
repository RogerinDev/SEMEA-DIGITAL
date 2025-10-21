
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Menu, Sun, Moon, TreePine, Recycle, PawPrint, GraduationCap, Info, LayoutDashboard, LogOut } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navLinks = [
  {
    icon: TreePine,
    tooltip: 'Arborização Urbana',
    href: '/info/urban-afforestation',
  },
  {
    icon: Recycle,
    tooltip: 'Coleta e Resíduos',
    href: '/info/waste-management',
  },
  {
    icon: GraduationCap,
    tooltip: 'Educação Ambiental',
    href: '/info/education',
  },
  {
    icon: PawPrint,
    tooltip: 'Bem-Estar Animal',
    href: '/animal-welfare',
  },
];


const AuthButtons = () => {
    const { currentUser, loading, logout } = useAuth();
    const pathname = usePathname();

    if (loading) {
        return (
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
        )
    }
    
    if (currentUser) {
        const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superAdmin';
        const dashboardPath = isAdmin ? '/dashboard/admin' : '/dashboard/citizen';
        const dashboardLabel = isAdmin ? 'Painel de Controle' : 'Minhas Solicitações';

        return (
            <div className="flex items-center gap-2">
                 <Button asChild variant="ghost" size="sm">
                    <Link href={dashboardPath}>
                        <LayoutDashboard className="mr-2 h-4 w-4"/>
                        {dashboardLabel}
                    </Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || ''}/>
                                <AvatarFallback>{currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{currentUser.displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${dashboardPath}/profile`}>
                                Meu Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Button asChild variant="default" size="sm">
                <Link href="/login">
                    Entrar
                </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
                <Link href="/register">
                    Registrar
                </Link>
            </Button>
        </div>
    )
}

export function PublicHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Left Section */}
        <div className="flex-1 flex justify-start">
            <Logo className="ml-2"/>
        </div>
        
        {/* Center Section (Desktop) */}
        <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-4">
                <TooltipProvider>
                {navLinks.map((link) => (
                    <li key={link.href}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button asChild variant="ghost" size="icon" aria-label={link.tooltip}>
                                    <Link href={link.href}>
                                        <link.icon className="h-6 w-6 text-primary" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{link.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </li>
                ))}
                </TooltipProvider>
            </ul>
        </nav>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-end space-x-2">
           <div className="hidden lg:flex items-center gap-2">
             <AuthButtons />
           </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                    <div className="p-4 -ml-4 -mt-2">
                        <Logo />
                    </div>
                </SheetHeader>
                <div className="flex flex-col space-y-2 p-4">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                            <link.icon className="h-5 w-5"/>
                            <span>{link.tooltip}</span>
                        </Link>
                    ))}
                    <Link href="/info/sobre" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"><Info className="h-5 w-5"/> Sobre a SEMEA</Link>
                </div>
                <div className="p-4 border-t absolute bottom-0 w-full left-0">
                  <AuthButtons />
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
