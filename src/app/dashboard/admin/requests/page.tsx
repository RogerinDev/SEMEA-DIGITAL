
"use client";

import { useEffect, useState } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Filter, Eye, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import type { ServiceRequest } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth-context';
import { getRequestsForAdminAction } from '@/app/actions/requests-actions';

const requestStatusTabs: { value: ServiceRequest['status'] | 'todos', label: string }[] = [
    { value: 'todos', label: 'Todas' },
    { value: 'pendente', label: 'Pendentes' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'aprovado', label: 'Aprovadas' },
    { value: 'concluido', label: 'Concluídas' },
    { value: 'rejeitado', label: 'Rejeitadas' },
];

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
  pendente: "Pendente", em_analise: "Em Análise", vistoria_agendada: "Vistoria Agendada", 
  aguardando_documentacao: "Aguardando Documentação", aprovado: "Aprovado", rejeitado: "Rejeitado",
  concluido: "Concluído", cancelado_pelo_usuario: "Cancelado"
};


function RequestTable({ requests }: { requests: ServiceRequest[] }) {
  if (requests.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Nenhuma solicitação encontrada para este filtro.</p>;
  }
  return (
    <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
        <TableHeader>
            <TableRow>
            <TableHead>Protocolo</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {requests.map((request) => (
            <TableRow key={request.id}>
                <TableCell className="font-medium">{request.protocol}</TableCell>
                <TableCell>{request.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                <TableCell>{request.citizenName || 'N/A'}</TableCell>
                <TableCell>{new Date(request.dateCreated).toLocaleDateString()}</TableCell>
                <TableCell>
                <Badge variant={getStatusVariant(request.status)}>{statusTranslations[request.status]}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild title="Ver Detalhes">
                    <Link href={`/dashboard/admin/requests/${request.id}`}> 
                    <span><Eye className="h-4 w-4" /></span>
                    </Link>
                </Button>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
}


export default function AdminRequestsPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('todos');

  useEffect(() => {
    async function fetchRequests() {
      if (!currentUser || !currentUser.role) return;
      setLoading(true);
      
      const department = currentUser.role === 'admin' ? currentUser.department : undefined;
      const fetchedRequests = await getRequestsForAdminAction(department);
      
      setRequests(fetchedRequests);
      setLoading(false);
    }
    fetchRequests();
  }, [currentUser]);

  const filteredRequests = activeTab === 'todos' 
    ? requests 
    : requests.filter(r => r.status === activeTab);

  if (!currentUser?.role || currentUser.role === 'citizen') {
     return <div className="text-center py-10"><ShieldAlert className="mx-auto h-10 w-10 text-destructive mb-2"/> <h2 className="text-xl font-semibold">Acesso Negado</h2><p>Você não tem permissão para ver esta página.</p></div>;
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Gerenciar Solicitações" icon={FileText} className="mb-0" description={`Departamento: ${currentUser.role === 'superAdmin' ? 'Todos' : currentUser.department}`} />
        <Button variant="outline" className="self-start sm:self-auto">
          <Filter className="mr-2 h-4 w-4" /> Filtrar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Solicitações de Serviço</CardTitle>
          <CardDescription>Visualize e gerencie todas as solicitações feitas pelos cidadãos.</CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
             <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
           ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
                {requestStatusTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeTab}>
                  <RequestTable requests={filteredRequests} />
              </TabsContent>
            </Tabs>
           )}
        </CardContent>
      </Card>
    </>
  );
}

    