/**
 * @fileoverview Layout principal para os painéis de controle (dashboards).
 * Este componente cria a estrutura com uma barra lateral de navegação (Sidebar)
 * e uma área de conteúdo principal, gerenciando o estado de autenticação
 * e a navegação específica para cidadãos e administradores.
 */

"use client"; 

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from '@/components/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, Loader2, Edit, Lock, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';


export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  sidebarActions?: (isCollapsed: boolean) => React.ReactNode;
  userName?: string; 
  userRole?: string; 
}

function MobileSheetNav({ navItems, sidebarActions, onLogoutClick }: { navItems: NavItem[], sidebarActions?: (isCollapsed: boolean) => React.ReactNode, onLogoutClick: () => void }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <Logo iconSize={24} textSize="text-lg" />
                </SheetHeader>
                <ScrollArea className="flex-1">
                    {sidebarActions && <div className="p-2">{sidebarActions(false)}</div>}
                    <nav className="p-4">
                        <ul className="space-y-1">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <SheetClose asChild>
                                        <Link href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground">
                                            <item.icon className="h-5 w-5" />
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </ScrollArea>
                <div className="p-4 border-t">
                     <Button variant="outline" className="w-full" onClick={onLogoutClick}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default function DashboardLayout({ children, navItems, sidebarActions, userName = "Usuário", userRole = "Cidadão" }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isMobile) {
      const savedState = localStorage.getItem("sidebarCollapsed");
      if (savedState !== null) {
        setIsCollapsed(JSON.parse(savedState));
      }
    } else {
        setIsCollapsed(true);
    }
  }, [isMobile]);
  
  const handleToggleCollapse = useCallback((collapsedState: boolean) => {
    if(isMobile) return;
    setIsCollapsed(collapsedState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsedState));
  }, [isMobile]);

  useEffect(() => {
    if (!authLoading && !currentUser && pathname.startsWith('/dashboard/')) {
      router.push('/login');
    }
  }, [authLoading, currentUser, router, pathname]);

  if (!isMounted || authLoading || (!currentUser && pathname.startsWith('/dashboard/'))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (currentUser) {
    const userInitials = (currentUser?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase();
    const profileBaseUrl = userRole.toLowerCase().includes('admin') ? '/dashboard/admin/profile' : '/dashboard/citizen/profile';

    return (
      <div className="flex min-h-screen bg-muted/40">
        {!isMobile ? (
            <Sidebar 
                isCollapsed={isCollapsed}
                onMouseEnter={() => handleToggleCollapse(false)}
                onMouseLeave={() => handleToggleCollapse(true)}
                className="hidden md:flex"
            >
                <SidebarHeader isCollapsed={isCollapsed}>
                    <Logo iconSize={28} textSize="text-xl" isCollapsed={isCollapsed} />
                </SidebarHeader>
                
                <Separator className="bg-sidebar-border" />

                <SidebarContent>
                    <ScrollArea className="h-full">
                    {sidebarActions && sidebarActions(isCollapsed)}
                    <SidebarMenu>
                        {navItems.map((item) => {
                        const isActive = item.matchExact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <SidebarMenuItem key={item.label} label={item.label} isCollapsed={isCollapsed}>
                                <Link href={item.href} className={cn(
                                "flex items-center gap-3 rounded-md p-3 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
                                isCollapsed ? "w-11 justify-center" : "w-full"
                                )}>
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    <span className={cn("overflow-hidden transition-all", isCollapsed ? "w-0" : "w-full")}>
                                        {item.label}
                                    </span>
                                </Link>
                            </SidebarMenuItem>
                        );
                        })}
                    </SidebarMenu>
                    </ScrollArea>
                </SidebarContent>

                <Separator className="my-2 bg-sidebar-border" />

                <SidebarFooter isCollapsed={isCollapsed}>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn(
                        "w-full h-auto p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isCollapsed ? "justify-center" : "justify-start"
                        )}>
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarImage src={currentUser?.photoURL || undefined} alt={userName} />
                                <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground font-semibold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className={cn("flex flex-col items-start transition-all overflow-hidden", isCollapsed ? "w-0" : "w-full")}>
                                <span className="text-sm font-medium text-sidebar-foreground truncate" title={userName}>
                                    {userName}
                                </span>
                                <span className="text-xs text-sidebar-foreground/70">
                                    {userRole}
                                </span>
                            </div>
                        </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="mb-2 ml-2 bg-background border-border shadow-lg">
                        <DropdownMenuItem asChild>
                            <Link href={profileBaseUrl}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Editar Informações</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`${profileBaseUrl}/change-password`}>
                                <Lock className="mr-2 h-4 w-4" />
                                <span>Trocar Senha</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} disabled={authLoading} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
            </Sidebar>
        ) : null}

        <div className="flex-1 flex flex-col md:pl-[5.5rem]">
            {isMobile && (
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <MobileSheetNav navItems={navItems} sidebarActions={sidebarActions} onLogoutClick={logout} />
                    <div className="flex-1">
                      <Logo iconSize={24} textSize="text-lg" />
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Avatar className="h-9 w-9 border">
                                <AvatarImage src={currentUser.photoURL || undefined} alt={userName} />
                                <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                                <Link href={profileBaseUrl}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Editar Perfil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`${profileBaseUrl}/change-password`}>
                                    <Lock className="mr-2 h-4 w-4" />
                                    <span>Trocar Senha</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                </header>
            )}
            <main className="flex-1 p-4 sm:p-6 md:p-8">
              {children}
            </main>
        </div>
      </div>
    );
  }

  // Fallback for non-authenticated state, should be handled by the effect but here as a safeguard.
  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p>Ocorreu um erro ao verificar a autenticação.</p>
      </div>
    );
}
