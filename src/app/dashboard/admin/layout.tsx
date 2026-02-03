
"use client";

import DashboardLayout, { type NavItem } from '@/components/layouts/dashboard-layout';
import { LayoutDashboard, FileText, AlertTriangle, Users, PawPrint, BarChart, Search, Cog, GraduationCap, Recycle, Newspaper } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import type { Department } from '@/types';

// A lista base de itens de navegação, agora incluindo o departamento requerido.
const allAdminNavItems: (NavItem & { requiredDepartment?: Department; superAdminOnly?: boolean })[] = [
  { href: '/dashboard/admin', label: 'Painel Geral', icon: LayoutDashboard, matchExact: true },
  { href: '/dashboard/admin/performance', label: 'Desempenho', icon: BarChart, superAdminOnly: true },
  { href: '/dashboard/admin/requests', label: 'Gerenciar Solicitações', icon: FileText, requiredDepartment: undefined },
  { href: '/dashboard/admin/incidents', label: 'Gerenciar Denúncias', icon: AlertTriangle, requiredDepartment: undefined },
  { href: '/dashboard/admin/posts', label: 'Notícias e Comunicados', icon: Newspaper, requiredDepartment: undefined },
  { href: '/dashboard/admin/adoption', label: 'Gerenciar Adoções', icon: PawPrint, requiredDepartment: 'bem_estar_animal' },
  { href: '/dashboard/admin/lost-found', label: 'Moderar Perdidos/Achados', icon: Search, requiredDepartment: 'bem_estar_animal' },
  { href: '/dashboard/admin/animal-welfare/settings', label: 'Conteúdo Bem-Estar Animal', icon: Cog, requiredDepartment: 'bem_estar_animal'},
  { href: '/dashboard/admin/urban-afforestation/settings', label: 'Conteúdo Arborização', icon: Cog, requiredDepartment: 'arborizacao'},
  { href: '/dashboard/admin/education/settings', label: 'Conteúdo Educação Amb.', icon: GraduationCap, requiredDepartment: 'educacao_ambiental'},
  { href: '/dashboard/admin/waste-management/settings', label: 'Conteúdo Gestão Resíduos', icon: Cog, requiredDepartment: 'residuos'},
  { href: '/dashboard/admin/users', label: 'Gerenciar Usuários', icon: Users, superAdminOnly: true },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const isSuperUser = currentUser?.role === 'superAdmin';

  // Filtra os itens de navegação com base no papel e departamento do usuário.
  const filteredNavItems = allAdminNavItems.filter(item => {
    // Se o item é apenas para superAdmin, verifica se o usuário tem esse papel.
    if (item.superAdminOnly) {
      return isSuperUser;
    }
    // Se o usuário for superAdmin, ele vê todos os itens.
    if (isSuperUser) {
      return true;
    }
    // Se o usuário for um admin de setor:
    if (currentUser?.role === 'admin') {
        // Itens sem departamento específico (como Painel Geral, Solicitações e Denúncias) são visíveis.
        if (item.requiredDepartment === undefined) {
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
