
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, CalendarDays, MapPin, History, CheckCircle, Clock, Edit3, XCircle, MessageSquare } from 'lucide-react';
import { SERVICE_REQUEST_TYPES, type ServiceRequest, type StatusHistoryEntry } from '@/types';
import { getRequestByIdAction } from '@/app/actions/requests-actions';

export const dynamic = 'force-dynamic';

const statusConfig: { [key in ServiceRequest['status']]: { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType } } = {
  pendente: { label: "Pendente", variant: "outline", icon: Clock },
  em_analise: { label: "Em Análise", variant: "secondary", icon: Edit3 },
  vistoria_agendada: { label: "Vistoria Agendada", variant: "secondary", icon: CalendarDays },
  aguardando_documentacao: { label: "Aguardando Documentação", variant: "outline", icon: FileText },
  aprovado: { label: "Aprovado", variant: "default", icon: CheckCircle },
  rejeitado: { label: "Rejeitado", variant: "destructive", icon: XCircle },
  concluido: { label: "Concluído", variant: "default", icon: CheckCircle },
  cancelado_pelo_usuario: { label: "Cancelado pelo Usuário", variant: "destructive", icon: XCircle },
};


function HistoryEntry({ entry }: { entry: StatusHistoryEntry }) {
  const config = statusConfig[entry.status as ServiceRequest['status']] || statusConfig.pendente;
  const Icon = config.icon;

  return (
    <li className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="bg-primary rounded-full p-2">
                <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            {/* Linha vertical conectora - não mostra no último item */}
            <div className="w-px flex-grow bg-border my-1 last-of-type:hidden"></div>
        </div>
        <div className="pb-6 flex-1">
            <p className="font-semibold text-base capitalize">{config.label}</p>
            <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleString('pt-BR')} por <strong>{entry.updatedBy}</strong></p>
            {entry.notes && (
                <div className="mt-2 text-sm bg-muted/50 p-3 rounded-md border">
                    <p className="font-semibold text-foreground mb-1 flex items-center"><MessageSquare className="h-4 w-4 mr-2"/> Parecer / Observação:</p>
                    <p className="text-muted-foreground whitespace-pre-wrap">{entry.notes}</p>
                </div>
            )}
        </div>
    </li>
  )
}

export default async function CitizenRequestDetailPage({ params }: { params: { id: string } }) {
  const request = await getRequestByIdAction(params.id);

  if (!request) {
    notFound();
  }

  const typeLabel = SERVICE_REQUEST_TYPES.find(t => t.value === request.type)?.label || request.type;
  const currentStatusConfig = statusConfig[request.status];
  const departmentLabel = request.department.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen/requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageTitle title={`Solicitação #${request.protocol}`} icon={FileText} className="mb-0 flex-grow" />
        <Badge variant={currentStatusConfig.variant} className="text-sm px-3 py-1">
          <currentStatusConfig.icon className="h-4 w-4 mr-2" />
          {currentStatusConfig.label}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Detalhes da Sua Solicitação</CardTitle>
              <CardDescription>Aqui estão as informações que você registrou.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departamento Responsável</p>
                <p className="text-md font-semibold">{departmentLabel}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Serviço</p>
                <p className="text-md font-semibold">{typeLabel}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data da Solicitação</p>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <p className="text-md">{new Date(request.dateCreated).toLocaleString()}</p>
                </div>
              </div>
              <Separator />
              {request.address && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Endereço da Solicitação</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <p className="text-md">{request.address}</p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição Registrada</p>
                <p className="text-md whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{request.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
           <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <History className="mr-2 h-5 w-5 text-primary"/>
                    Histórico de Status
                </CardTitle>
                 <CardDescription>Acompanhe o progresso da sua solicitação.</CardDescription>
            </CardHeader>
            <CardContent>
                {request.history && request.history.length > 0 ? (
                    <ul className="space-y-0 -ml-4">
                        {request.history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry, index) => (
                           <HistoryEntry key={index} entry={entry} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground p-4 text-center">Nenhum histórico de status para exibir.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
