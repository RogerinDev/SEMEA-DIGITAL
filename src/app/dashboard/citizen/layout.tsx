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

const citizenNavItems: NavItem[] = [
  { href: '/dashboard/citizen', label: 'Painel', icon: LayoutDashboard, matchExact: true },
  { href: '/dashboard/citizen/requests', label: 'Solicitações', icon: FileText },
  { href: '/dashboard/citizen/incidents', label: 'Denúncias', icon: AlertTriangle },
  { href: '/dashboard/citizen/profile', label: 'Meu Perfil', icon: User },
];

const SidebarActions = () => (
    <div className="p-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="w-full justify-center h-11">
                    <PlusCircle className="mr-2 h-5 w-5"/>
                    Registrar
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="center">
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
    <DashboardLayout navItems={citizenNavItems} sidebarActions={<SidebarActions />} userName={userName} userRole={userRole}>
      {children}
    </DashboardLayout>
  );
}
