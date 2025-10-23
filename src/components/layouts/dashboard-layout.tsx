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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from '@/components/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, Loader2, Edit, Lock, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';

// Interface para definir a estrutura de um item de navegação.
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean; // Se true, o link só fica ativo se a URL for exata.
}

// Propriedades do componente DashboardLayout.
interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  sidebarActions?: React.ReactNode;
  userName?: string; 
  userRole?: string; 
}

/**
 * Componente de layout para painéis de controle.
 */
export default function DashboardLayout({ children, navItems, sidebarActions, userName = "Usuário", userRole = "Cidadão" }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, loading: authLoading } = useAuth();
  
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedState = localStorage.getItem('sidebar-collapsed');
    if (storedState) {
        setIsCollapsed(JSON.parse(storedState));
    }
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prevState => {
        const newState = !prevState;
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
        return newState;
    });
  }, []);

  // Efeito que verifica a autenticação.
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
      <div className="flex min-h-screen">
        <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse}>
          <SidebarHeader>
            <Logo className="[&_span]:text-sidebar-foreground" isCollapsed={isCollapsed} />
          </SidebarHeader>

          <SidebarContent>
            <ScrollArea className="h-full">
              {sidebarActions}
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = item.matchExact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.label} label={item.label} isCollapsed={isCollapsed}>
                        <Link href={item.href} className={cn(
                          "flex items-center gap-3 rounded-md p-3 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                           isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
                           isCollapsed ? "w-10 justify-center" : "w-full"
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

          <SidebarFooter>
             <Separator className="my-2 bg-sidebar-border" />
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

        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "pl-[5rem]" : "pl-[18rem]"
        )}>
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p>Ocorreu um erro ao verificar la autenticação.</p>
      </div>
    );
}
