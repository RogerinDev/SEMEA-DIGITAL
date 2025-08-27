
"use client";

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { IncidentReport } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INCIDENT_TYPES } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { getIncidentsByCitizenAction } from '@/app/actions/incidents-actions';

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
      return 'default';
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
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchIncidents() {
      if (currentUser?.uid) {
        setLoading(true);
        const fetchedIncidents = await getIncidentsByCitizenAction(currentUser.uid);
        setIncidents(fetchedIncidents);
        setLoading(false);
      } else {
        // If user is not logged in or logs out, clear incidents
        setIncidents([]);
        setLoading(false);
      }
    }
    fetchIncidents();
  }, [currentUser]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle title="Minhas Denúncias Registradas" icon={AlertTriangle} className="mb-0" />
        <Button asChild>
          <Link href="/dashboard/citizen/incidents/new">
            <span className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Nova Denúncia
            </span>
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : incidents.length === 0 ? (
         <Card className="text-center py-12">
          <CardHeader>
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Nenhuma denúncia registrada</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Você ainda não registrou nenhuma denúncia. Ajude a cuidar da nossa cidade!</CardDescription>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/dashboard/citizen/incidents/new">
                <span className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" /> Registrar Denúncia
                </span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Denúncias</CardTitle>
            <CardDescription>Acompanhe o status das suas denúncias.</CardDescription>
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
                {incidents.map((incident) => {
                   const typeLabel = INCIDENT_TYPES.find(t => t.value === incident.type)?.label || incident.type;
                   return (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.protocol}</TableCell>
                    <TableCell>{typeLabel}</TableCell>
                    <TableCell>{new Date(incident.dateCreated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(incident.status)}>{statusTranslations[incident.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/citizen/incidents/${incident.id}`}>
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

    