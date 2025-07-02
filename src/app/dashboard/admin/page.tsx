
"use client";

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle, CheckSquare, Clock, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { getRequestsCountAction } from '@/app/actions/requests-actions';
import { getIncidentsCountAction } from '@/app/actions/incidents-actions';
import { Skeleton } from '@/components/ui/skeleton';


export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const [counts, setCounts] = useState({
    pendingRequests: 0,
    newIncidents: 0,
    completedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      if (!currentUser) return;

      setLoading(true);
      
      const department = currentUser.role === 'admin' ? currentUser.department : undefined;
      
      const date = new Date();
      const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

      const [pendingRequestsCount, newIncidentsCount, completedThisMonthCount] = await Promise.all([
        getRequestsCountAction({ department, status: 'pendente' }),
        getIncidentsCountAction({ department, status: 'recebida' }),
        getRequestsCountAction({ department, status: 'concluido', fromDate: firstDayOfMonth }),
      ]);
      
      setCounts({
        pendingRequests: pendingRequestsCount,
        newIncidents: newIncidentsCount,
        completedThisMonth: completedThisMonthCount,
      });
      
      setLoading(false);
    }
    
    fetchCounts();
  }, [currentUser]);

  const overviewCards = [
    { title: 'Solicitações Pendentes', value: counts.pendingRequests, icon: Clock, color: 'text-yellow-500', link: '/dashboard/admin/requests?status=pendente', loading },
    { title: 'Denúncias Novas', value: counts.newIncidents, icon: AlertTriangle, color: 'text-red-500', link: '/dashboard/admin/incidents?status=recebida', loading },
    { title: 'Serviços Concluídos (Mês)', value: counts.completedThisMonth, icon: CheckSquare, color: 'text-green-500', link: '/dashboard/admin/requests?status=concluido', loading },
  ];

  return (
    <>
      <PageTitle title="Painel Administrativo" icon={LayoutDashboard} description="Visão geral e gerenciamento do sistema SEMEA Digital." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {overviewCards.map(card => (
          <Card key={card.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              {card.loading ? (
                <Skeleton className="h-8 w-1/4 mt-1" />
              ) : (
                <div className="text-3xl font-bold">{card.value}</div>
              )}
               <Button variant="link" asChild className="px-0 text-sm text-muted-foreground">
                <Link href={card.link}>
                  <span className="flex items-center">
                    Ver Detalhes <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Acesso Rápido às Seções</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/admin/requests">
                <span className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-primary"/> Gerenciar Solicitações de Serviço
                </span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/admin/incidents">
                <span className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-primary"/> Gerenciar Denúncias Ambientais
                </span>
              </Link>
            </Button>
            {/* More links can be added here as modules are developed */}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Um feed de atividades recentes apareceria aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente para exibir (placeholder).</p>
            {/* Example items:
            <ul className="space-y-2 text-sm">
              <li>Nova solicitação de poda de árvore recebida (Protocolo: 2024005).</li>
              <li>Incidente de descarte irregular atualizado para "Em Verificação" (Protocolo: DEN2024003).</li>
            </ul>
            */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
