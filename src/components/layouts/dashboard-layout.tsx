"use client"; 

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
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

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  sidebarActions?: React.ReactNode;
  userName?: string; 
  userRole?: string; 
}

export default function DashboardLayout({ children, navItems, sidebarActions, userName = "Usuário", userRole = "Cidadão" }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, loading: authLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (!authLoading && !currentUser && pathname.startsWith('/dashboard/')) {
      router.push('/login');
    }
  }, [authLoading, currentUser, router, pathname]);

  if (authLoading || (!currentUser && pathname.startsWith('/dashboard/'))) {
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
              {sidebarActions}
              <SidebarMenu className="p-4 pt-0">
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
          <SidebarFooter className="p-2 border-t border-sidebar-border mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2 overflow-hidden">
                          <Avatar className="h-9 w-9">
                              <AvatarImage src={currentUser?.photoURL || undefined} alt={userName} />
                              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground font-semibold">
                                  {userInitials}
                              </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start overflow-hidden">
                              <span className="text-sm font-medium text-sidebar-foreground truncate" title={userName}>
                                  {userName}
                              </span>
                              <span className="text-xs text-sidebar-foreground/70">
                                  {userRole}
                              </span>
                          </div>
                      </div>
                      <ChevronUp className="h-4 w-4 text-sidebar-foreground/70 shrink-0" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[calc(var(--sidebar-width)_-_1rem)] mb-2 bg-background border-border shadow-lg">
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
                  <DropdownMenuItem onClick={handleLogout} disabled={authLoading} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p>Ocorreu um erro ao verificar la autenticação.</p>
      </div>
    );
}
