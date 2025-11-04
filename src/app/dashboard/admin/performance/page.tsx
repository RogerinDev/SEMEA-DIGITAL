
// src/app/dashboard/admin/performance/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/page-title';
import { BarChart, CheckCircle, Clock, Star, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { DateRangeFilter } from '@/components/dashboard/admin/performance/date-range-filter';
import { KpiCard } from '@/components/dashboard/admin/performance/kpi-card';
import { PerformanceCharts } from '@/components/dashboard/admin/performance/performance-charts';
import type { PerformanceData } from '@/types';
import { getPerformanceDataAction } from '@/app/actions/performance-actions';
import { subDays, startOfDay } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';
import type { DateRange } from 'react-day-picker';


export default function PerformanceDashboardPage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfDay(subDays(new Date(), 29)),
    to: new Date(),
  });
  
  // Security Check
  useEffect(() => {
    if (currentUser && currentUser.role !== 'superAdmin') {
      router.replace('/dashboard/admin');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser?.role !== 'superAdmin') return;

    async function fetchData() {
      if (!dateRange.from || !dateRange.to) return;
      
      setLoading(true);
      setError(null);
      const result = await getPerformanceDataAction(dateRange);
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Falha ao buscar dados de desempenho.');
      }
      setLoading(false);
    }

    fetchData();
  }, [dateRange, currentUser]);
  
  if (!currentUser || currentUser.role !== 'superAdmin') {
      return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Acesso Negado</h1>
                <p className="text-muted-foreground max-w-md">Você não tem permissão para acessar esta página. Esta seção é restrita aos Super Administradores.</p>
            </div>
      )
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Desempenho e Relatórios" icon={BarChart} />
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-96 bg-destructive/10 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4"/>
            <h3 className="text-xl font-semibold text-destructive">Erro ao Carregar Dados</h3>
            <p className="text-destructive/80 text-center max-w-lg">{error}</p>
        </div>
      ) : data ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <KpiCard
              title="Total de Serviços Concluídos"
              value={data.totalCompleted.toString()}
              icon={CheckCircle}
              description="Soma de solicitações e denúncias resolvidas no período."
            />
            <KpiCard
              title="Tempo Médio de Resolução"
              value={`${data.avgResolutionTime.toFixed(1)} dias`}
              icon={Clock}
              description="Tempo médio da abertura à conclusão."
            />
            <KpiCard
              title="Categoria Mais Frequente"
              value={data.mostFrequentCategory}
              icon={Star}
              description="Tipo de serviço mais concluído no período."
            />
          </div>
          <PerformanceCharts data={data} />
        </div>
      ) : null}
    </>
  );
}
