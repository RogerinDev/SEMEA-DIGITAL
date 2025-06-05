
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle, AlertTriangle, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function CitizenDashboardPage() {
  const summaryCards = [
    { title: 'Solicitações Abertas', value: '3', icon: FileText, link: '/dashboard/citizen/requests' },
    { title: 'Incidentes Reportados', value: '1', icon: AlertTriangle, link: '/dashboard/citizen/incidents' },
  ];

  const quickActions = [
    { label: 'Nova Solicitação de Serviço', href: '/dashboard/citizen/requests/new', icon: PlusCircle },
    { label: 'Reportar um Incidente', href: '/dashboard/citizen/incidents/new', icon: AlertTriangle },
  ];

  return (
    <>
      <PageTitle title="Painel do Cidadão" icon={LayoutDashboard} description="Bem-vindo(a) à sua área na SEMEA Digital." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {summaryCards.map(card => (
          <Card key={card.title} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
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
