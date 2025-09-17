
"use client";

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle, AlertTriangle, ArrowRight, LayoutDashboard, Loader2, Database } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { getRequestCountByCitizenAction } from '@/app/actions/requests-actions';
import { getIncidentCountByCitizenAction } from '@/app/actions/incidents-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { testWriteAction } from '@/app/actions/test-actions';
import { useToast } from '@/hooks/use-toast';

export default function CitizenDashboardPage() {
  const { currentUser } = useAuth();
  const [requestCount, setRequestCount] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCounts() {
      if (currentUser) {
        setLoading(true);
        const [reqCount, incCount] = await Promise.all([
          getRequestCountByCitizenAction(currentUser.uid),
          getIncidentCountByCitizenAction(currentUser.uid)
        ]);
        setRequestCount(reqCount);
        setIncidentCount(incCount);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    fetchCounts();
  }, [currentUser]);

  const handleTestWrite = async () => {
    setTestLoading(true);
    const result = await testWriteAction();
    if (result.success) {
      toast({
        title: "Teste de Escrita Concluído!",
        description: `Documento criado com sucesso no Firestore com o ID: ${result.id}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Falha no Teste de Escrita",
        description: result.error || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
    setTestLoading(false);
  };


  const summaryCards = [
    { title: 'Solicitações Abertas', value: requestCount.toString(), icon: FileText, link: '/dashboard/citizen/requests', loading },
    { title: 'Denúncias Registradas', value: incidentCount.toString(), icon: AlertTriangle, link: '/dashboard/citizen/incidents', loading },
  ];

  const quickActions = [
    { label: 'Nova Solicitação de Serviço', href: '/dashboard/citizen/requests/new', icon: PlusCircle },
    { label: 'Registrar uma Denúncia', href: '/dashboard/citizen/incidents/new', icon: AlertTriangle },
  ];

  return (
    <>
      <PageTitle title="Painel do Cidadão" icon={LayoutDashboard} description="Bem-vindo(a) à sua área na SEMEA Digital." />

      <Card className="mb-8 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300"><Database /> Teste de Conexão com Banco de Dados</CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-400">
            Clique no botão abaixo para realizar um teste de escrita simples e direto no Firestore. Isso nos ajudará a diagnosticar o problema final.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleTestWrite} disabled={testLoading} variant="secondary">
            {testLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : "Executar Teste de Escrita"}
          </Button>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {summaryCards.map(card => (
          <Card key={card.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {card.loading ? (
                <Skeleton className="h-8 w-1/4" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
              <Button variant="link" asChild className="px-0 text-sm">
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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente os principais serviços.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {quickActions.map(action => (
            <Button key={action.label} variant="outline" className="justify-start text-left h-auto py-3" asChild>
              <Link href={action.href}>
                <span className="flex items-center w-full">
                  <action.icon className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">Clique para iniciar</p>
                  </div>
                </span>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
