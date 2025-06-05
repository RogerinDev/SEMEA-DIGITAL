import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, PlusCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ServiceRequest } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockRequests: ServiceRequest[] = [
  { id: '1', protocol: '2024001', type: 'poda_arvore', description: 'Árvore muito alta na frente de casa, galhos tocando fios.', status: 'em_analise', dateCreated: new Date(2024, 6, 10).toISOString(), dateUpdated: new Date(2024, 6, 11).toISOString() },
  { id: '2', protocol: '2024002', type: 'castracao_animal', description: 'Solicitação de castração para gato SRD, fêmea, aproximadamente 1 ano.', status: 'aprovado', dateCreated: new Date(2024, 5, 20).toISOString(), dateUpdated: new Date(2024, 5, 25).toISOString() },
  { id: '3', protocol: '2024003', type: 'coleta_especial_residuos', description: 'Coleta de entulho de pequena reforma.', status: 'concluido', dateCreated: new Date(2024, 4, 1).toISOString(), dateUpdated: new Date(2024, 4, 5).toISOString() },
];

function getStatusVariant(status: ServiceRequest['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'aprovado':
    case 'concluido':
      return 'default'; // Primary color (greenish in this theme)
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
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="Minhas Solicitações de Serviço" icon={FileText} className="mb-0" />
        <Button asChild>
          <Link href="/dashboard/citizen/requests/new">
            <span className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Solicitação
            </span>
          </Link>
        </Button>
      </div>

      {mockRequests.length === 0 ? (
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
          <CardContent>
            <Table>
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
                {mockRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.protocol}</TableCell>
                    <TableCell>{request.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                    <TableCell>{new Date(request.dateCreated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(request.status)}>{statusTranslations[request.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        {/* This link would go to a detailed view page e.g. /dashboard/citizen/requests/${request.id} */}
                        <Link href="#"> 
                          <span className="flex items-center">
                            Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
