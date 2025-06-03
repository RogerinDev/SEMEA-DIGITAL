"use client";

import DashboardLayout, { type NavItem } from '@/components/layouts/dashboard-layout';
import { LayoutDashboard, FileText, AlertTriangle, Users, BarChart3, Settings } from 'lucide-react';

const adminNavItems: NavItem[] = [
  { href: '/dashboard/admin', label: 'Painel Geral', icon: LayoutDashboard, matchExact: true },
  { href: '/dashboard/admin/requests', label: 'Gerenciar Solicitações', icon: FileText },
  { href: '/dashboard/admin/incidents', label: 'Gerenciar Incidentes', icon: AlertTriangle },
  // { href: '/dashboard/admin/users', label: 'Gerenciar Usuários', icon: Users },
  // { href: '/dashboard/admin/reports', label: 'Relatórios', icon: BarChart3 },
  // { href: '/dashboard/admin/settings', label: 'Configurações', icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navItems={adminNavItems} userName="Admin SEMEA" userRole="Administrador">
      {children}
    </DashboardLayout>
  );
}
