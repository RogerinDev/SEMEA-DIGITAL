"use client";

import DashboardLayout, { type NavItem } from '@/components/layouts/dashboard-layout';
import { LayoutDashboard, FileText, AlertTriangle, User, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

const citizenNavItems: NavItem[] = [
  { href: '/dashboard/citizen', label: 'Painel', icon: LayoutDashboard, matchExact: true },
  { href: '/dashboard/citizen/requests', label: 'Solicitações', icon: FileText },
  { href: '/dashboard/citizen/incidents', label: 'Denúncias', icon: AlertTriangle },
];

const SidebarActions = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="p-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  className={cn(
                    "w-full h-11 transition-all", 
                    isCollapsed ? "justify-center" : "justify-center"
                  )}
                >
                    <PlusCircle className={cn("h-5 w-5", !isCollapsed && "mr-2")}/>
                    <span className={cn("transition-all", isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>Registrar</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="right" align="start">
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/citizen/requests/new">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Nova Solicitação</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                     <Link href="/dashboard/citizen/incidents/new">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>Nova Denúncia</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
         <Separator className="my-4 bg-sidebar-border" />
    </div>
);


export default function CitizenDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  
  const getRoleName = (role?: string) => {
    if (role === 'superAdmin') return 'Super Administrador';
    if (role === 'admin') return 'Administrador';
    return 'Cidadão';
  }

  const userName = currentUser?.displayName || currentUser?.email || 'Cidadão';
  const userRole = getRoleName(currentUser?.role);

  return (
    <DashboardLayout 
        navItems={citizenNavItems} 
        sidebarActions={(isCollapsed) => <SidebarActions isCollapsed={isCollapsed} />} 
        userName={userName} 
        userRole={userRole}
    >
      {children}
    </DashboardLayout>
  );
}
