
"use client"; 

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'; // Added useEffect
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from '@/components/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, UserCircle, Loader2 } from 'lucide-react'; // Added Loader2
import { useAuth } from '@/contexts/auth-context';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userName?: string; 
  userRole?: string; 
}

export default function DashboardLayout({ children, navItems, userName: defaultUserName = "Usuário", userRole: defaultUserRole = "Cidadão" }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, loading: authLoading } = useAuth();

  const displayUserName = currentUser?.email || defaultUserName; 
  const displayUserRole = defaultUserRole; 

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (!authLoading && !currentUser && pathname.startsWith('/dashboard/')) {
      router.push('/login');
    }
  }, [authLoading, currentUser, router, pathname]);

  // Se o estado de autenticação está carregando, OU
  // se não há usuário logado E estamos tentando acessar uma rota de dashboard (redirecionamento está pendente)
  if (authLoading || (!currentUser && pathname.startsWith('/dashboard/'))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
         {/* Você pode adicionar uma mensagem como "Carregando..." ou "Redirecionando..." aqui se desejar */}
      </div>
    );
  }

  // Se chegou aqui e currentUser ainda é null, mas não estamos mais carregando e não é uma rota de dashboard,
  // é um estado inesperado para este layout ou o redirecionamento ainda não ocorreu.
  // No entanto, a lógica acima deve cobrir o redirecionamento.
  // Se currentUser existir, renderizamos o dashboard.
  if (currentUser) {
    return (
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <Logo className="[&_span]:text-sidebar-foreground" />
              <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent md:hidden" />
            </div>
          </SidebarHeader>
          <SidebarContent asChild>
            <ScrollArea className="h-full">
              <SidebarMenu className="p-4">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.matchExact ? pathname === item.href : pathname.startsWith(item.href)}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2 mb-2">
              <UserCircle className="h-8 w-8 text-sidebar-foreground" />
              <div>
                <p className="text-sm font-medium text-sidebar-foreground truncate" title={displayUserName}>{displayUserName}</p>
                <p className="text-xs text-sidebar-foreground/70">{displayUserRole}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
              onClick={handleLogout}
              disabled={authLoading} // Desabilita enquanto o logout está em processamento
            >
              {/* O authLoading aqui também indica que uma operação de auth (como logout) pode estar em andamento */}
              {authLoading && false ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOut className="mr-2 h-4 w-4" />}
               Sair
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 md:justify-end">
            <SidebarTrigger className="text-foreground hover:text-accent-foreground hover:bg-accent md:hidden" />
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fallback caso algo muito inesperado aconteça (não deveria ser alcançado)
   return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p>Ocorreu um erro ao verificar a autenticação.</p>
      </div>
    );
}
