import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Filter, Eye } from 'lucide-react';
import Link from 'next/link';
import type { IncidentReport } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const mockAdminIncidents: IncidentReport[] = [
  { id: '1', protocol: 'DEN2024001', type: 'descarte_irregular_residuo', reportedBy: 'Cidadão Anônimo', description: 'Descarte de lixo em terreno baldio.', status: 'em_verificacao', dateCreated: new Date(2024, 6, 15).toISOString(), location: 'Rua das Palmeiras' },
  { id: '2', protocol: 'DEN2024002', type: 'maus_tratos_animal', reportedBy: 'Ana B.', description: 'Cachorro abandonado e magro.', status: 'fiscalizacao_agendada', dateCreated: new Date(2024, 6, 1).toISOString(), location: 'Av. Central' },
  { id: '3', protocol: 'DEN2024003', type: 'poluicao_sonora', reportedBy: 'Marcos L.', description: 'Som alto recorrente em bar vizinho após 22h.', status: 'recebida', dateCreated: new Date(2024, 6, 19).toISOString(), location: 'Rua do Sossego, 50' },
  { id: '4', protocol: 'DEN2024004', type: 'desmatamento_ilegal', reportedBy: 'Cidadão Anônimo', description: 'Corte de árvores em área de preservação nos fundos do bairro X.', status: 'auto_infracao_emitido', dateCreated: new Date(2024, 5, 10).toISOString(), location: 'Bairro X, fundos' },
];

const incidentStatusTabs: { value: IncidentReport['status'] | 'todos', label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'recebida', label: 'Recebidos' },
    { value: 'em_verificacao', label: 'Em Verificação' },
    { value: 'fiscalizacao_agendada', label: 'Ag. Fiscalização' },
    { value: 'resolvida', label: 'Resolvidos' },
    { value: 'arquivada_improcedente', label: 'Arquivados' },
];

function getStatusVariant(status: IncidentReport['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'resolvida': return 'default';
    case 'em_verificacao': case 'fiscalizacao_agendada': case 'em_andamento_fiscalizacao': return 'secondary';
    case 'auto_infracao_emitido': case 'medida_corretiva_solicitada': return 'default';
    case 'arquivada_improcedente': return 'destructive';
    default: return 'outline';
  }
}

const statusTranslations: Record<IncidentReport['status'], string> = {
  recebida: "Recebida", em_verificacao: "Em Verificação", fiscalizacao_agendada: "Fiscalização Agendada",
  em_andamento_fiscalizacao: "Em Fiscalização", auto_infracao_emitido: "Auto de Infração Emitido",
  medida_corretiva_solicitada: "Medida Corretiva Solicitada", resolvida: "Resolvida", arquivada_improcedente: "Arquivada"
};

function IncidentTable({ incidents }: { incidents: IncidentReport[] }) {
  if (incidents.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Nenhum incidente encontrado para este filtro.</p>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Protocolo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Reportado Por</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow key={incident.id}>
            <TableCell className="font-medium">{incident.protocol}</TableCell>
            <TableCell>{incident.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
            <TableCell>{incident.reportedBy || 'Anônimo'}</TableCell>
            <TableCell>{new Date(incident.dateCreated).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(incident.status)}>{statusTranslations[incident.status]}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="icon" asChild title="Ver Detalhes">
                <Link href={`/dashboard/admin/incidents/${incident.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


export default function AdminIncidentsPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="Gerenciar Incidentes" icon={AlertTriangle} className="mb-0" />
         <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filtrar
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Incidentes Reportados</CardTitle>
          <CardDescription>Acompanhe e gerencie os incidentes ambientais.</CardDescription>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
              {incidentStatusTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
            {incidentStatusTabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value}>
                 <IncidentTable incidents={tab.value === 'todos' ? mockAdminIncidents : mockAdminIncidents.filter(r => r.status === tab.value)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
