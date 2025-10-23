
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, AlertTriangle, CalendarDays, MapPin, History, CheckCircle, Clock, Edit3, XCircle, MessageSquare, FileText, UserCircle } from 'lucide-react';
import { INCIDENT_TYPES, type IncidentReport, type StatusHistoryEntry } from '@/types';
import { getIncidentByIdAction } from '@/app/actions/incidents-actions';

export const dynamic = 'force-dynamic';

const statusConfig: { [key in IncidentReport['status']]: { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType } } = {
  recebida: { label: 'Recebida', variant: 'outline', icon: Clock },
  em_verificacao: { label: 'Em Verificação', variant: 'secondary', icon: Edit3 },
  fiscalizacao_agendada: { label: 'Fiscalização Agendada', variant: 'secondary', icon: CalendarDays },
  em_andamento_fiscalizacao: { label: 'Em Fiscalização', variant: 'secondary', icon: Edit3 },
  auto_infracao_emitido: { label: 'Auto de Infração Emitido', variant: 'default', icon: FileText },
  medida_corretiva_solicitada: { label: 'Medida Corretiva Solicitada', variant: 'default', icon: MessageSquare },
  resolvida: { label: 'Resolvida', variant: 'default', icon: CheckCircle },
  arquivada_improcedente: { label: 'Arquivada (Improcedente)', variant: 'destructive', icon: XCircle },
};

function HistoryEntryCard({ entry }: { entry: StatusHistoryEntry }) {
  const config = statusConfig[entry.status as IncidentReport['status']] || statusConfig.recebida;
  const Icon = config.icon;

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="bg-primary rounded-full p-2">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="w-px flex-grow bg-border my-1"></div>
      </div>
      <div className="pb-6 flex-1">
        <p className="font-semibold text-base capitalize">{config.label}</p>
        <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleString('pt-BR')} por <strong>{entry.updatedBy}</strong></p>
        {entry.notes && (
          <div className="mt-2 text-sm bg-muted/50 p-3 rounded-md border">
            <p className="font-semibold text-foreground mb-1 flex items-center"><MessageSquare className="h-4 w-4 mr-2" /> Observação / Parecer:</p>
            <p className="text-muted-foreground whitespace-pre-wrap">{entry.notes}</p>
          </div>
        )}
      </div>
    </li>
  );
}

export default async function CitizenIncidentDetailPage({ params }: { params: { id: string } }) {
  const incident = await getIncidentByIdAction(params.id);

  if (!incident) {
    notFound();
  }

  const typeLabel = INCIDENT_TYPES.find(t => t.value === incident.type)?.label || incident.type;
  const currentStatusConfig = statusConfig[incident.status];
  const departmentLabel = incident.department.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen/incidents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageTitle title={`Denúncia #${incident.protocol}`} icon={AlertTriangle} className="mb-0 flex-grow" />
        <Badge variant={currentStatusConfig.variant} className="text-sm px-3 py-1">
          <currentStatusConfig.icon className="h-4 w-4 mr-2" />
          {currentStatusConfig.label}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Sua Denúncia</CardTitle>
              <CardDescription>Aqui estão as informações que você registrou.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Departamento Responsável</p>
                <p className="text-md font-semibold">{departmentLabel}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Denúncia</p>
                <p className="text-md font-semibold">{typeLabel}</p>
              </div>
              <Separator />
               <div>
                <p className="text-sm font-medium text-muted-foreground">Relato Anônimo</p>
                <div className="flex items-center gap-2 mt-1">
                   <UserCircle className="h-5 w-5 text-muted-foreground" />
                   <p className="text-md">{incident.isAnonymous ? 'Sim' : 'Não'}</p>
                </div>
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
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5 text-primary" />
                Histórico de Status
              </CardTitle>
              <CardDescription>Acompanhe o progresso da sua denúncia.</CardDescription>
            </CardHeader>
            <CardContent>
              {incident.history && incident.history.length > 0 ? (
                <ul className="space-y-0 -ml-4">
                  {incident.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry, index) => (
                    <HistoryEntryCard key={index} entry={entry} />
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground p-4 text-center">Nenhum histórico de status para exibir.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
