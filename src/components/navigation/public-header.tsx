
"use client";

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Briefcase, Info, LogIn, UserPlus, TreePine, Droplets, CalendarDays, GraduationCap, PawPrint, Edit, Lock, LogOut, Menu, LayoutDashboard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import React from 'react';

const mainNavItems = [
    { href: '/info/urban-afforestation', label: 'Arborização', icon: TreePine },
    { href: '/info/waste-management', label: 'Resíduos', icon: Droplets },
    { href: '/info/education', label: 'Educação Ambiental', icon: GraduationCap },
    { href: '/animal-welfare', label: 'Bem Estar Animal', icon: PawPrint },
];
const servicesNavItem = { href: '/dashboard/citizen', label: 'Serviços', icon: Briefcase };


function MobileNav() {
    const { currentUser } = useAuth();
    const navItems = currentUser ? [...mainNavItems, servicesNavItem] : mainNavItems;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6"/>
                    <span className="sr-only">Abrir menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] flex flex-col p-0">
                <SheetHeader className="p-4 border-b">
                   <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                    <Logo iconSize={24} textSize="text-lg" />
                </SheetHeader>
                <div className="flex-grow overflow-y-auto">
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <SheetClose asChild>
                                        <Link href={item.href} className="flex items-center gap-3 rounded-md p-3 text-lg font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground">
                                            <item.icon className="h-5 w-5" />
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}

function DesktopNav() {
     return (
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium sm:space-x-1.5 md:space-x-2 lg:space-x-3">
            {mainNavItems.map((item) => (
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
     )
}

const ServicesIcon = () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={servicesNavItem.href}
          passHref
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        >
          <Briefcase className="h-5 w-5 text-primary" />
          <span className="sr-only">{servicesNavItem.label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{servicesNavItem.label}</p>
      </TooltipContent>
    </Tooltip>
);

const AdminDashboardIcon = () => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Link
                href="/dashboard/admin"
                passHref
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span className="sr-only">Painel Administrativo</span>
            </Link>
        </TooltipTrigger>
        <TooltipContent>
            <p>Painel Administrativo</p>
        </TooltipContent>
    </Tooltip>
);


export function PublicHeader() {
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superAdmin' || currentUser?.role === 'Dev';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <MobileNav />
            <Logo iconSize={22} textSize="text-base md:text-lg" />
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center">
             <DesktopNav />
          </div>

          <div className="flex items-center justify-end">
            {currentUser ? (
              <>
                <div className="hidden sm:flex items-center">
                  {isAdmin && <AdminDashboardIcon />}
                  <ServicesIcon />
                </div>
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
              </>
            ) : (
              <>
                 <div className="hidden sm:flex items-center space-x-2">
                    <Link
                        href="/login"
                        passHref
                        className={cn(buttonVariants({ variant: "secondary" }))}
                    >
                        Entrar
                    </Link>
                    <Link
                        href="/register"
                        passHref
                        className={cn(buttonVariants({ variant: "default" }))}
                    >
                        Registrar
                    </Link>
                 </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/login"
                      passHref
                      className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "sm:hidden")}
                    >
                      <LogIn className="h-4 w-4" />
                       <span className="sr-only">Entrar</span>
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
                      className={cn(buttonVariants({ variant: "default", size: "icon" }), "sm:hidden ml-1")}
                    >
                      <UserPlus className="h-4 w-4" />
                       <span className="sr-only">Registrar</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Registrar</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </div>
    </header>
  );
}
