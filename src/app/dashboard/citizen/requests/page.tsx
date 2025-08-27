
"use client";

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { ServiceRequest } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SERVICE_REQUEST_TYPES } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { getRequestsByCitizenAction } from '@/app/actions/requests-actions';

function getStatusVariant(status: ServiceRequest['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'aprovado':
    case 'concluido':
      return 'default'; 
    case 'em_analise':
    case 'vistoria_agendada':
      return 'secondary';
    case 'rejeitado':
    case 'cancelado_pelo_usuario':
      return 'destructive';
    case 'pendente':
    case 'aguardando_documentacao':
    default:
      return 'outline';
  }
}

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

export default function CitizenRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchRequests() {
      if (currentUser?.uid) {
        setLoading(true);
        const fetchedRequests = await getRequestsByCitizenAction(currentUser.uid);
        setRequests(fetchedRequests);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [currentUser]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Minhas Solicitações de Serviço" icon={FileText} className="mb-0" />
        <Button asChild>
          <Link href="/dashboard/citizen/requests/new">
            <span className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Solicitação
            </span>
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Nenhuma solicitação encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Você ainda não fez nenhuma solicitação de serviço. Comece agora!</CardDescription>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/dashboard/citizen/requests/new">
                <span className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" /> Fazer Nova Solicitação
                </span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Solicitações</CardTitle>
            <CardDescription>Acompanhe o status de suas solicitações de serviço.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Protocolo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const typeLabel = SERVICE_REQUEST_TYPES.find(t => t.value === request.type)?.label || request.type;
                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.protocol}</TableCell>
                      <TableCell>{typeLabel}</TableCell>
                      <TableCell>{new Date(request.dateCreated).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(request.status)}>{statusTranslations[request.status]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/citizen/requests/${request.id}`}>
                            <span>Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" /></span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}

    