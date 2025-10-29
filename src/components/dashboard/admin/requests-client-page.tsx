
"use client";

import { useEffect, useState, useCallback } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Filter, Eye, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import type { ServiceRequest, ServiceRequestType } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '@/contexts/auth-context';
import { getRequestsForAdminAction } from '@/app/actions/requests-actions';
import { Input } from '@/components/ui/input';
import { SERVICE_REQUEST_TYPES } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

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

const ITEMS_PER_PAGE = 10;

interface Filters {
    protocol?: string;
    citizenName?: string;
    type?: ServiceRequestType;
    status?: ServiceRequest['status'];
}

export default function RequestsClientPage() {
  const { currentUser } = useAuth();
  const searchParams = useSearchParams();
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: searchParams.get('status') as ServiceRequest['status'] | undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce(async (appliedFilters: Filters, page: number) => {
      if (!currentUser || !currentUser.role) return;
      setLoading(true);
      
      const department = currentUser.role === 'admin' ? currentUser.department : undefined;
      
      const fetchedRequests = await getRequestsForAdminAction({ 
        department,
        ...appliedFilters,
        page,
        limit: ITEMS_PER_PAGE,
      });
      
      setRequests(fetchedRequests);
      // This logic is a bit flawed for total count, but works for simple pagination display
      setTotalItems(fetchedRequests.length < ITEMS_PER_PAGE ? (page - 1) * ITEMS_PER_PAGE + fetchedRequests.length : page * ITEMS_PER_PAGE + 1);
      setLoading(false);
    }, 300),
    [currentUser]
  );

  useEffect(() => {
    debouncedFetch(filters, currentPage);
  }, [filters, currentPage, debouncedFetch]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (!currentUser?.role || currentUser.role === 'citizen') {
     return <div className="text-center py-10"><ShieldAlert className="mx-auto h-10 w-10 text-destructive mb-2"/> <h2 className="text-xl font-semibold">Acesso Negado</h2><p>Você não tem permissão para ver esta página.</p></div>;
  }

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Gerenciar Solicitações" icon={FileText} className="mb-0" description={currentUser.role === 'superAdmin' ? 'Visão de Super Admin (Todos os Departamentos)' : `Departamento: ${currentUser.department}`} />
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filtrar e Pesquisar
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filtros Avançados</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="protocol-filter">Protocolo</Label>
                        <Input id="protocol-filter" value={filters.protocol || ''} onChange={e => setFilters({...filters, protocol: e.target.value})} />
                    </div>
                     <div>
                        <Label htmlFor="citizen-filter">Nome do Solicitante</Label>
                        <Input id="citizen-filter" value={filters.citizenName || ''} onChange={e => setFilters({...filters, citizenName: e.target.value})} />
                    </div>
                    <div>
                        <Label htmlFor="type-filter">Tipo de Serviço</Label>
                        <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value as ServiceRequestType})}>
                            <SelectTrigger><SelectValue placeholder="Todos os tipos" /></SelectTrigger>
                            <SelectContent>
                                {SERVICE_REQUEST_TYPES.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="status-filter">Status</Label>
                        <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value as ServiceRequest['status']})}>
                            <SelectTrigger><SelectValue placeholder="Todos os status" /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(statusTranslations).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="button" variant="outline" onClick={clearFilters}>Limpar Filtros</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
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
            <>
                <div className="overflow-x-auto">
                    <Table className="min-w-[700px] whitespace-nowrap">
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
                        {requests.length > 0 ? requests.map((request) => (
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
                        )) : (
                             <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">Nenhuma solicitação encontrada com os filtros atuais.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                 <div className="flex items-center justify-between space-x-2 p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages > 0 ? totalPages : 1}
                    </div>
                    <div className="space-x-2">
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        >
                        Anterior
                        </Button>
                        <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={requests.length < ITEMS_PER_PAGE}
                        >
                        Próxima
                        </Button>
                    </div>
                </div>
            </>
           )}
        </CardContent>
      </Card>
    </>
  );
}
