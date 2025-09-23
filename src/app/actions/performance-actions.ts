
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { PerformanceData, ServiceRequest, IncidentReport, Department } from '@/types';
import { differenceInDays, format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateRange {
  from: Date;
  to: Date;
}

// Helper to translate department keys to friendly names
const departmentNames: Record<Department, string> = {
    arborizacao: "Arborização",
    residuos: "Resíduos",
    bem_estar_animal: "Bem-Estar Animal",
    educacao_ambiental: "Educação Ambiental",
    gabinete: "Gabinete"
};

export async function getPerformanceDataAction(
  dateRange: DateRange
): Promise<{ success: boolean; data?: PerformanceData; error?: string }> {
  if (!dateRange || !dateRange.from || !dateRange.to) {
    return { success: false, error: 'Intervalo de datas inválido.' };
  }

  const { db } = getFirebaseAdmin();
  const fromDateISO = dateRange.from.toISOString();
  // Add 1 day to the 'to' date to include the whole day in the query
  const toDate = new Date(dateRange.to);
  toDate.setDate(toDate.getDate() + 1);
  const toDateISO = toDate.toISOString();

  try {
    // 1. Fetch completed service requests
    const requestsSnapshot = await db
      .collection('service_requests')
      .where('status', '==', 'concluido')
      .where('dateUpdated', '>=', fromDateISO)
      .where('dateUpdated', '<', toDateISO)
      .get();
    
    const completedRequests = requestsSnapshot.docs.map(doc => doc.data() as ServiceRequest);

    // 2. Fetch resolved incidents
    const incidentsSnapshot = await db
      .collection('incidents')
      .where('status', '==', 'resolvida')
      .where('dateUpdated', '>=', fromDateISO)
      .where('dateUpdated', '<', toDateISO)
      .get();
      
    const resolvedIncidents = incidentsSnapshot.docs.map(doc => doc.data() as IncidentReport);

    const allCompleted = [...completedRequests, ...resolvedIncidents];

    if (allCompleted.length === 0) {
        return { success: true, data: {
            totalCompleted: 0,
            avgResolutionTime: 0,
            mostFrequentCategory: "N/A",
            dailyTrend: [],
            categoryDistribution: [],
            departmentDistribution: [],
        }};
    }

    // 3. Calculate KPIs
    const totalCompleted = allCompleted.length;

    const totalResolutionTime = allCompleted.reduce((sum, item) => {
      const created = parseISO(item.dateCreated);
      const updated = item.dateUpdated ? parseISO(item.dateUpdated) : new Date();
      if (isValid(created) && isValid(updated)) {
        return sum + differenceInDays(updated, created);
      }
      return sum;
    }, 0);
    const avgResolutionTime = totalCompleted > 0 ? totalResolutionTime / totalCompleted : 0;

    const categoryCounts = allCompleted.reduce((acc, item) => {
      const typeName = item.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostFrequentCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    // 4. Prepare data for charts
    const dailyTrend = allCompleted.reduce((acc, item) => {
        if(!item.dateUpdated) return acc;
        const dateStr = format(parseISO(item.dateUpdated), 'dd/MM');
        const existing = acc.find(d => d.date === dateStr);
        if (existing) {
            existing.count++;
        } else {
            acc.push({ date: dateStr, count: 1 });
        }
        return acc;
    }, [] as { date: string; count: number }[]).sort((a,b) => a.date.localeCompare(b.date, 'pt-BR-u-kn-true'));


    const categoryDistribution = Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const departmentCounts = allCompleted.reduce((acc, item) => {
        const deptName = departmentNames[item.department] || item.department;
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const departmentDistribution = Object.entries(departmentCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.value - b.value);

    return {
      success: true,
      data: {
        totalCompleted,
        avgResolutionTime,
        mostFrequentCategory,
        dailyTrend,
        categoryDistribution,
        departmentDistribution,
      },
    };
  } catch (error: any) {
    console.error("Error fetching performance data:", error);
    return { success: false, error: "Falha ao buscar dados do banco de dados." };
  }
}
