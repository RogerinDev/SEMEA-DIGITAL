
"use client"; 

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { LogOut, UserCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context'; // Added

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  matchExact?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userName?: string; // This will be overridden by currentUser if available
  userRole?: string; // This will be overridden by currentUser if available
}

export default function DashboardLayout({ children, navItems, userName: defaultUserName = "Usuário", userRole: defaultUserRole = "Cidadão" }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { currentUser, logout, loading: authLoading } = useAuth(); // Get user and logout function

  const displayUserName = currentUser?.email || defaultUserName; // Or currentUser.displayName if you set it
  // User role would typically come from custom claims or a database, not directly from FirebaseUser object for email/pass
  const displayUserRole = defaultUserRole; 

  const handleLogout = async () => {
    await logout();
    // Router will redirect via AuthContext's logout method
  };

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
            disabled={authLoading}
          >
            {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOut className="mr-2 h-4 w-4" />}
             Sair
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 md:justify-end">
          <SidebarTrigger className="text-foreground hover:text-accent-foreground hover:bg-accent md:hidden" />
          {/* Add user menu or notifications here if needed for top bar */}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {currentUser || authLoading ? children : <p>Você precisa estar logado para ver esta página. Redirecionando...</p>}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
