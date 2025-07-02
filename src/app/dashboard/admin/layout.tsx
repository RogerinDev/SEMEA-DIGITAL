"use client";

import DashboardLayout, { type NavItem } from '@/components/layouts/dashboard-layout';
import { LayoutDashboard, FileText, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const adminNavItems: NavItem[] = [
  { href: '/dashboard/admin', label: 'Painel Geral', icon: LayoutDashboard, matchExact: true },
  { href: '/dashboard/admin/requests', label: 'Gerenciar Solicitações', icon: FileText },
  { href: '/dashboard/admin/incidents', label: 'Gerenciar Denúncias', icon: AlertTriangle },
  { href: '/dashboard/admin/users', label: 'Gerenciar Usuários', icon: Users },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  
  const getRoleName = (role?: string) => {
    if (role === 'superAdmin') return 'Super Administrador';
    if (role === 'admin') return 'Administrador';
    return 'Admin'; // Fallback
  }

  const userRole = getRoleName(currentUser?.role);
  const userName = currentUser?.displayName || currentUser?.email || 'Admin';

  return (
    <DashboardLayout navItems={adminNavItems} userName={userName} userRole={userRole}>
      {children}
    </DashboardLayout>
  );
}
