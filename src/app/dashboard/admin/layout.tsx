
"use client";

import DashboardLayout, { type NavItem } from '@/components/layouts/dashboard-layout';
import { LayoutDashboard, FileText, AlertTriangle, Users, PawPrint, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { Department } from '@/types';

// A lista base de itens de navegação, agora incluindo o departamento requerido.
const allAdminNavItems: (NavItem & { requiredDepartment?: Department; superAdminOnly?: boolean })[] = [
  { href: '/dashboard/admin', label: 'Painel Geral', icon: LayoutDashboard, matchExact: true },
  { href: '/dashboard/admin/performance', label: 'Desempenho', icon: BarChart },
  { href: '/dashboard/admin/requests', label: 'Gerenciar Solicitações', icon: FileText, requiredDepartment: undefined }, // Visível a todos os admins de setor
  { href: '/dashboard/admin/incidents', label: 'Gerenciar Denúncias', icon: AlertTriangle, requiredDepartment: undefined }, // Visível a todos os admins de setor
  { href: '/dashboard/admin/adoption', label: 'Gerenciar Adoções', icon: PawPrint, requiredDepartment: 'bem_estar_animal' },
  { href: '/dashboard/admin/users', label: 'Gerenciar Usuários', icon: Users, superAdminOnly: true },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  
  // Filtra os itens de navegação com base no papel e departamento do usuário.
  const filteredNavItems = allAdminNavItems.filter(item => {
    // Se o item é apenas para superAdmin, verifica se o usuário tem esse papel.
    if (item.superAdminOnly) {
      return currentUser?.role === 'superAdmin';
    }
    // Se o usuário for superAdmin, ele vê todos os itens que não são exclusivos de superAdmin.
    if (currentUser?.role === 'superAdmin') {
      return true;
    }
    // Se o usuário for um admin de setor:
    if (currentUser?.role === 'admin') {
        // Itens sem departamento específico (como Painel Geral, Solicitações e Denúncias) são visíveis.
        if (!item.requiredDepartment) {
            return true;
        }
        // O item só é visível se o departamento do usuário for o mesmo que o departamento requerido pelo item.
        return item.requiredDepartment === currentUser.department;
    }
    // Se não for admin, não mostra nada (embora não deva chegar aqui).
    return false;
  });

  const getRoleName = (role?: string) => {
    if (role === 'superAdmin') return 'Super Administrador';
    if (role === 'admin') return 'Administrador';
    return 'Admin'; // Fallback
  }

  const userName = currentUser?.displayName || currentUser?.email || 'Admin';
  const userRole = getRoleName(currentUser?.role);

  return (
    <DashboardLayout navItems={filteredNavItems} userName={userName} userRole={userRole}>
      {children}
    </DashboardLayout>
  );
}
