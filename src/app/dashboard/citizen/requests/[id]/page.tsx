
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, UserCircle, CalendarDays, MapPin } from 'lucide-react';
import { SERVICE_REQUEST_TYPES, type ServiceRequest } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function CitizenRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const storedRequestsJSON = localStorage.getItem('citizen_requests');
      const storedRequests: ServiceRequest[] = storedRequestsJSON ? JSON.parse(storedRequestsJSON) : [];
      const foundRequest = storedRequests.find(req => req.protocol === id);
      
      if (foundRequest) {
        setRequest(foundRequest);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center">
        <PageTitle title="Solicitação não encontrada" icon={FileText} />
        <p className="text-muted-foreground mb-4">A solicitação que você está procurando não foi encontrada.</p>
        <Button onClick={() => router.push('/dashboard/citizen/requests')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Minhas Solicitações
        </Button>
      </div>
    );
  }

  const typeLabel = SERVICE_REQUEST_TYPES.find(t => t.value === request.type)?.label || request.type;
  const statusLabel = statusTranslations[request.status] || request.status;

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
