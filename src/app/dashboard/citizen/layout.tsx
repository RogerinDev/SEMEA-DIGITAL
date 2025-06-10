
"use client";

import DashboardLayout, { type NavItem } from '@/components/layouts/dashboard-layout';
import { LayoutDashboard, FileText, PlusCircle, AlertTriangle, User } from 'lucide-react';

const citizenNavItems: NavItem[] = [
  { href: '/dashboard/citizen', label: 'Painel', icon: LayoutDashboard, matchExact: true },
  { href: '/dashboard/citizen/requests', label: 'Minhas Solicitações', icon: FileText },
  { href: '/dashboard/citizen/requests/new', label: 'Nova Solicitação', icon: PlusCircle },
  { href: '/dashboard/citizen/incidents', label: 'Denúncias Solicitadas', icon: AlertTriangle },
  { href: '/dashboard/citizen/incidents/new', label: 'Nova Denúncia', icon: PlusCircle },
  // { href: '/dashboard/citizen/profile', label: 'Meu Perfil', icon: User },
];

export default function CitizenDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={citizenNavItems} userName="Cidadão Exemplo" userRole="Cidadão">
      {children}
    </DashboardLayout>
  );
}

