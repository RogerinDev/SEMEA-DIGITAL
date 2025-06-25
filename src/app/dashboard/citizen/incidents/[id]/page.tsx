
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertTriangle, UserCircle, CalendarDays, MapPin, FileText } from 'lucide-react';
import { INCIDENT_TYPES, type IncidentReport } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

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

function getStatusVariant(status: IncidentReport['status']): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'resolvida': return 'default';
    case 'em_verificacao': case 'fiscalizacao_agendada': case 'em_andamento_fiscalizacao': return 'secondary';
    case 'auto_infracao_emitido': case 'medida_corretiva_solicitada': return 'default';
    case 'arquivada_improcedente': return 'destructive';
    default: return 'outline';
  }
}

export default function CitizenIncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [incident, setIncident] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(true);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const storedIncidentsJSON = localStorage.getItem('citizen_incidents');
      const storedIncidents: IncidentReport[] = storedIncidentsJSON ? JSON.parse(storedIncidentsJSON) : [];
      const foundIncident = storedIncidents.find(inc => inc.protocol === id);
      
      if (foundIncident) {
        setIncident(foundIncident);
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

  if (!incident) {
    return (
      <div className="text-center">
        <PageTitle title="Denúncia não encontrada" icon={AlertTriangle} />
        <p className="text-muted-foreground mb-4">A denúncia que você está procurando não foi encontrada.</p>
        <Button onClick={() => router.push('/dashboard/citizen/incidents')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Minhas Denúncias
        </Button>
      </div>
    );
  }

  const typeLabel = INCIDENT_TYPES.find(t => t.value === incident.type)?.label || incident.type;
  const statusLabel = statusTranslations[incident.status] || incident.status;

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen/incidents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageTitle title={`Denúncia #${incident.protocol}`} icon={AlertTriangle} className="mb-0 flex-grow" />
        <Badge variant={getStatusVariant(incident.status)} className="text-sm px-3 py-1">
          {statusLabel}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Sua Denúncia</CardTitle>
          <CardDescription>Aqui estão as informações que você registrou.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tipo de Denúncia</p>
            <p className="text-md font-semibold">{typeLabel}</p>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Data do Registro</p>
            <div className="flex items-center gap-2 mt-1">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <p className="text-md">{new Date(incident.dateCreated).toLocaleString()}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Localização</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <p className="text-md">{incident.location}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Descrição Registrada</p>
            <p className="text-md whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{incident.description}</p>
          </div>
           <Separator />
           <div>
            <p className="text-sm font-medium text-muted-foreground">Relato Anônimo</p>
            <p className="text-md">{incident.isAnonymous ? 'Sim' : 'Não'}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
