
"use client";

import { useEffect, useState } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Filter, Eye, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import type { IncidentReport } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth-context';
import { getIncidentsForAdminAction } from '@/app/actions/incidents-actions';

const incidentStatusTabs: { value: IncidentReport['status'] | 'todos', label: string }[] = [
    { value: 'todos', label: 'Todas' },
    { value: 'recebida', label: 'Recebidas' },
    { value: 'em_verificacao', label: 'Em Verificação' },
    { value: 'fiscalizacao_agendada', label: 'Ag. Fiscalização' },
    { value: 'resolvida', label: 'Resolvidas' },
    { value: 'arquivada_improcedente', label: 'Arquivadas' },
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
    return <p className="text-muted-foreground text-center py-8">Nenhuma denúncia encontrada para este filtro.</p>;
  }
  return (
    <div className="overflow-x-auto">
        <Table className="min-w-[700px]">
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


export default function AdminIncidentsPage() {
  const { currentUser } = useAuth();
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('todos');

  useEffect(() => {
    async function fetchIncidents() {
      if (!currentUser || !currentUser.role) return;
      setLoading(true);
      
      const department = currentUser.role === 'admin' ? currentUser.department : undefined;
      const fetchedIncidents = await getIncidentsForAdminAction(department);
      
      setIncidents(fetchedIncidents);
      setLoading(false);
    }
    fetchIncidents();
  }, [currentUser]);

  const filteredIncidents = activeTab === 'todos' 
    ? incidents 
    : incidents.filter(r => r.status === activeTab);

  if (!currentUser?.role || currentUser.role === 'citizen') {
     return <div className="text-center py-10"><ShieldAlert className="mx-auto h-10 w-10 text-destructive mb-2"/> <h2 className="text-xl font-semibold">Acesso Negado</h2><p>Você não tem permissão para ver esta página.</p></div>;
  }
  
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Gerenciar Denúncias" icon={AlertTriangle} className="mb-0" description={`Departamento: ${currentUser.role === 'superAdmin' ? 'Todos' : currentUser.department}`} />
         <Button variant="outline" className="self-start sm:self-auto">
          <Filter className="mr-2 h-4 w-4" /> Filtrar
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Denúncias Reportadas</CardTitle>
          <CardDescription>Acompanhe e gerencie as denúncias ambientais.</CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
             <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
           ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
                {incidentStatusTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeTab}>
                 <IncidentTable incidents={filteredIncidents} />
              </TabsContent>
            </Tabs>
           )}
        </CardContent>
      </Card>
    </>
  );
}

    