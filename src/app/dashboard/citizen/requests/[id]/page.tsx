
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, CalendarDays, MapPin, History, CheckCircle, Clock } from 'lucide-react';
import { SERVICE_REQUEST_TYPES, type ServiceRequest, type StatusHistoryEntry } from '@/types';
import { getRequestByIdAction } from '@/app/actions/requests-actions';

export const dynamic = 'force-dynamic';

const statusTranslations: Record<ServiceRequest['status'], string> = {
  pendente: "Pendente",
  em_analise: "Em Análise",
  vistoria_agendada: "Vistoria Agendada",
  aguardando_documentacao: "Aguardando Documentação",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  concluido: "Concluído",
  cancelado_pelo_usuario: "Cancelado pelo Usuário"
};

function getStatusVariant(status: ServiceRequest['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'aprovado': case 'concluido': return 'default';
    case 'em_analise': case 'vistoria_agendada': return 'secondary';
    case 'rejeitado': case 'cancelado_pelo_usuario': return 'destructive';
    default: return 'outline';
  }
}

function HistoryEntry({ entry }: { entry: StatusHistoryEntry }) {
  return (
    <li className="flex gap-3">
        <div className="flex flex-col items-center">
            <div className="bg-primary rounded-full p-1.5">
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="w-px flex-grow bg-border my-1"></div>
        </div>
        <div>
            <p className="font-semibold text-sm capitalize">{entry.status.replace(/_/g, " ")}</p>
            <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()} por <strong>{entry.updatedBy}</strong></p>
            {entry.notes && <p className="text-sm mt-1">{entry.notes}</p>}
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
  const statusLabel = statusTranslations[request.status] || request.status;
  const departmentLabel = SERVICE_REQUEST_TYPES.find(t => t.value === request.type)?.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "N/A";

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen/requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageTitle title={`Solicitação #${request.protocol}`} icon={FileText} className="mb-0 flex-grow" />
        <Badge variant={getStatusVariant(request.status)} className="text-sm px-3 py-1">
          {statusLabel}
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
                    <ul className="space-y-2 -ml-3">
                        {request.history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry, index) => (
                           <HistoryEntry key={index} entry={entry} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum histórico de status para exibir.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
