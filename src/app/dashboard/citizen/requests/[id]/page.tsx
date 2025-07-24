
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, CalendarDays, MapPin } from 'lucide-react';
import { SERVICE_REQUEST_TYPES, type ServiceRequest } from '@/types';
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
    </>
  );
}
