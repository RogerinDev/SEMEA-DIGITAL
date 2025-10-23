
"use client";

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle, CheckSquare, Clock, ArrowRight, LayoutDashboard, History } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { getRequestsCountAction, getRequestsForAdminAction } from '@/app/actions/requests-actions';
import { getIncidentsCountAction, getIncidentsForAdminAction } from '@/app/actions/incidents-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { startOfMonth, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ServiceRequest, IncidentReport } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';


type RecentActivityItem = (ServiceRequest | IncidentReport) & { activityType: 'request' | 'incident' };

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const [counts, setCounts] = useState({
    pendingRequests: 0,
    newIncidents: 0,
    completedThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;

      setLoading(true);
      
      const department = currentUser.role === 'admin' ? currentUser.department : undefined;
      const firstDayOfMonth = startOfMonth(new Date());

      const [
          pendingRequestsCount, 
          newIncidentsCount, 
          completedRequestsCount, 
          resolvedIncidentsCount,
          latestRequests,
          latestIncidents
      ] = await Promise.all([
        getRequestsCountAction({ department, status: 'pendente' }),
        getIncidentsCountAction({ department, status: 'recebida' }),
        getRequestsCountAction({ department, status: 'concluido', fromDate: firstDayOfMonth }),
        getIncidentsCountAction({ department, status: 'resolvida', fromDate: firstDayOfMonth }),
        getRequestsForAdminAction({ department, limit: 5 }),
        getIncidentsForAdminAction(department), // Fetch all and slice later
      ]);
      
      setCounts({
        pendingRequests: pendingRequestsCount,
        newIncidents: newIncidentsCount,
        completedThisMonth: completedRequestsCount + resolvedIncidentsCount,
      });

      const mappedRequests: RecentActivityItem[] = latestRequests.map(r => ({ ...r, activityType: 'request' }));
      const mappedIncidents: RecentActivityItem[] = latestIncidents.slice(0, 5).map(i => ({ ...i, activityType: 'incident' }));
      
      const combinedActivity = [...mappedRequests, ...mappedIncidents]
        .sort((a, b) => new Date(b.dateUpdated!).getTime() - new Date(a.dateUpdated!).getTime())
        .slice(0, 7);

      setRecentActivity(combinedActivity);
      
      setLoading(false);
    }
    
    fetchData();
  }, [currentUser]);

  const overviewCards = [
    { title: 'Solicitações Pendentes', value: counts.pendingRequests, icon: Clock, color: 'text-yellow-500', link: '/dashboard/admin/requests?status=pendente', loading },
    { title: 'Denúncias Novas', value: counts.newIncidents, icon: AlertTriangle, color: 'text-red-500', link: '/dashboard/admin/incidents?status=recebida', loading },
    { title: 'Concluídos este Mês', value: counts.completedThisMonth, icon: CheckSquare, color: 'text-green-500', link: '/dashboard/admin/performance', loading },
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
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center"><History className="mr-2 h-5 w-5" /> Atividade Recente</CardTitle>
            <CardDescription>Últimas atualizações nas solicitações e denúncias.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {loading ? (
              <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
              </div>
            ) : recentActivity.length > 0 ? (
               <ScrollArea className="h-[250px]">
                <ul className="space-y-3">
                  {recentActivity.map(item => (
                    <li key={`${item.activityType}-${item.id}`}>
                      <Link href={`/dashboard/admin/${item.activityType === 'request' ? 'requests' : 'incidents'}/${item.id}`} className="block p-3 rounded-md hover:bg-muted/50 transition-colors border">
                        <div className="flex items-center justify-between text-sm">
                           <div className="flex items-center gap-2 font-medium">
                                {item.activityType === 'request' ? <FileText className="h-4 w-4 text-primary" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                                <span>{item.protocol}</span>
                            </div>
                           <span className="text-xs text-muted-foreground">
                             {formatDistanceToNow(new Date(item.dateUpdated!), { addSuffix: true, locale: ptBR })}
                           </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                           <span className="font-semibold capitalize">{item.status.replace(/_/g, " ")}</span> - {item.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Nenhuma atividade recente para exibir.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
