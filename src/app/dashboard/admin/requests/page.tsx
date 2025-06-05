import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Filter, ArrowRight, Edit3, Eye } from 'lucide-react';
import Link from 'next/link';
import type { ServiceRequest } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockAdminRequests: ServiceRequest[] = [
  { id: '1', protocol: '2024001', type: 'poda_arvore', citizenName: 'Maria Silva', description: 'Árvore muito alta na frente de casa, galhos tocando fios.', status: 'em_analise', dateCreated: new Date(2024, 6, 10).toISOString(), dateUpdated: new Date(2024, 6, 11).toISOString() },
  { id: '2', protocol: '2024002', type: 'castracao_animal', citizenName: 'João Pereira', description: 'Solicitação de castração para gato SRD, fêmea.', status: 'aprovado', dateCreated: new Date(2024, 5, 20).toISOString(), dateUpdated: new Date(2024, 5, 25).toISOString() },
  { id: '3', protocol: '2024003', type: 'coleta_especial_residuos', citizenName: 'Ana Costa', description: 'Coleta de entulho de pequena reforma.', status: 'concluido', dateCreated: new Date(2024, 4, 1).toISOString(), dateUpdated: new Date(2024, 4, 5).toISOString() },
  { id: '4', protocol: '2024004', type: 'corte_arvore_risco', citizenName: 'Carlos Souza', description: 'Árvore com risco de queda na Rua Principal.', status: 'pendente', dateCreated: new Date(2024, 6, 18).toISOString(), dateUpdated: new Date(2024, 6, 18).toISOString() },
  { id: '5', protocol: '2024005', type: 'licenca_ambiental_simplificada', citizenName: 'Empresa XYZ', description: 'Solicitação de licença para pequena obra.', status: 'aguardando_documentacao', dateCreated: new Date(2024, 6, 1).toISOString(), dateUpdated: new Date(2024, 6, 15).toISOString() },
];

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
    <Table>
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
              {/* <Button variant="outline" size="icon" asChild title="Editar/Processar">
                <Link href={`/dashboard/admin/requests/${request.id}/process`}>
                  <Edit3 className="h-4 w-4" />
                </Link>
              </Button> */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function AdminRequestsPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="Gerenciar Solicitações" icon={FileText} className="mb-0" />
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filtrar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Solicitações de Serviço</CardTitle>
          <CardDescription>Visualize e gerencie todas as solicitações feitas pelos cidadãos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
              {requestStatusTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
            {requestStatusTabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                 <RequestTable requests={tab.value === 'todos' ? mockAdminRequests : mockAdminRequests.filter(r => r.status === tab.value)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
