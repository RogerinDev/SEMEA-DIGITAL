import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, PlusCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { IncidentReport } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockIncidents: IncidentReport[] = [
  { id: '1', protocol: 'DEN2024001', type: 'descarte_irregular_residuo', description: 'Descarte de lixo em terreno baldio na Rua das Palmeiras.', status: 'em_verificacao', dateCreated: new Date(2024, 6, 15).toISOString(), location: 'Rua das Palmeiras, próximo ao nº 100' },
  { id: '2', protocol: 'DEN2024002', type: 'maus_tratos_animal', description: 'Cachorro aparentemente abandonado e magro em lote vago.', status: 'fiscalizacao_agendada', dateCreated: new Date(2024, 6, 1).toISOString(), location: 'Av. Central, Lote 22' },
];

function getStatusVariant(status: IncidentReport['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'resolvida':
      return 'default';
    case 'em_verificacao':
    case 'fiscalizacao_agendada':
    case 'em_andamento_fiscalizacao':
      return 'secondary';
    case 'auto_infracao_emitido':
    case 'medida_corretiva_solicitada':
      return 'default'; // Consider this a progress state, so primary
    case 'arquivada_improcedente':
      return 'destructive';
    case 'recebida':
    default:
      return 'outline';
  }
}

const statusTranslations: Record<IncidentReport['status'], string> = {
  recebida: "Recebida",
  em_verificacao: "Em Verificação",
  fiscalizacao_agendada: "Fiscalização Agendada",
  em_andamento_fiscalizacao: "Em Fiscalização",
  auto_infracao_emitido: "Auto de Infração Emitido",
  medida_corretiva_solicitada: "Medida Corretiva Solicitada",
  resolvida: "Resolvida",
  arquivada_improcedente: "Arquivada (Improcedente)"
};

export default function CitizenIncidentsPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageTitle title="Meus Incidentes Reportados" icon={AlertTriangle} className="mb-0" />
        <Button asChild>
          <Link href="/dashboard/citizen/incidents/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Relato
          </Link>
        </Button>
      </div>

      {mockIncidents.length === 0 ? (
         <Card className="text-center py-12">
          <CardHeader>
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Nenhum incidente reportado</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Você ainda não reportou nenhum incidente. Ajude a cuidar da nossa cidade!</CardDescription>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/dashboard/citizen/incidents/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Reportar Incidente
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Incidentes</CardTitle>
            <CardDescription>Acompanhe o status dos seus relatos.</CardDescription>
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
                {mockIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.protocol}</TableCell>
                    <TableCell>{incident.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableCell>
                    <TableCell>{new Date(incident.dateCreated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(incident.status)}>{statusTranslations[incident.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" asChild>
                        {/* This link would go to a detailed view page e.g. /dashboard/citizen/incidents/${incident.id} */}
                        <Link href="#">
                          Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
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
