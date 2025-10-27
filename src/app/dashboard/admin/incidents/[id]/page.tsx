"use client";

import { useEffect, useState } from 'react';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, UserCircle, CalendarDays, MapPin, Edit3, MessageSquare, CheckCircle, XCircle, Clock, FileText, Loader2, Camera, Video, ExternalLink, History, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { IncidentReport, IncidentStatus, ResolvedTicket, StatusHistoryEntry } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getIncidentByIdAction, updateIncidentStatusAction, getIncidentsForAdminAction } from '@/app/actions/incidents-actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { SimilarTicketsSuggestions } from '@/components/ai/similar-tickets-suggestions';
import { useAuth } from '@/contexts/auth-context';

const statusOptions: { value: IncidentReport['status'], label: string, icon?: React.ElementType }[] = [
  { value: 'recebida', label: 'Recebida', icon: Clock },
  { value: 'em_verificacao', label: 'Em Verificação', icon: Edit3 },
  { value: 'fiscalizacao_agendada', label: 'Fiscalização Agendada', icon: CalendarDays },
  { value: 'em_andamento_fiscalizacao', label: 'Em Fiscalização', icon: Edit3 },
  { value: 'auto_infracao_emitido', label: 'Auto de Infração Emitido', icon: FileText },
  { value: 'medida_corretiva_solicitada', label: 'Medida Corretiva Solicitada', icon: MessageSquare },
  { value: 'resolvida', label: 'Resolvida', icon: CheckCircle },
  { value: 'arquivada_improcedente', label: 'Arquivada (Improcedente)', icon: XCircle },
];

function getStatusVariant(status: IncidentReport['status']): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
      case 'resolvida': case 'auto_infracao_emitido': case 'medida_corretiva_solicitada': return 'default';
      case 'em_verificacao': case 'fiscalizacao_agendada': case 'em_andamento_fiscalizacao': return 'secondary';
      case 'arquivada_improcedente': return 'destructive';
      default: return 'outline';
    }
}

function HistoryEntryCard({ entry }: { entry: StatusHistoryEntry }) {
  const statusConfig = statusOptions.find(s => s.value === entry.status);
  const Icon = statusConfig?.icon || Clock;

  return (
    <li className="flex gap-3">
        <div className="flex flex-col items-center">
            <div className="bg-primary rounded-full p-1.5">
                <Icon className="h-4 w-4 text-primary-foreground" />
            </div>
            {/* Linha vertical conectora */}
            <div className="w-px flex-grow bg-border my-1"></div>
        </div>
        <div className="pb-4 flex-1">
            <p className="font-semibold text-sm capitalize">{entry.status.replace(/_/g, " ")}</p>
            <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleString()} por <strong>{entry.updatedBy}</strong></p>
            {entry.notes && <p className="text-sm mt-1 bg-muted/50 p-2 rounded-md whitespace-pre-wrap">{entry.notes}</p>}
        </div>
    </li>
  )
}

function AdminIncidentDetailPageContent({ incident, onUpdateSuccess }: { incident: IncidentReport, onUpdateSuccess: () => void }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus>(incident.status);
  const [notes, setNotes] = useState('');
  const [inspector, setInspector] = useState(incident.inspector || '');

  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  const handleUpdate = async () => {
    if (!selectedStatus || !currentUser) return;
    if (selectedStatus === incident.status && !notes.trim()) {
        toast({ title: "Nenhuma alteração", description: "Altere o status ou adicione um parecer técnico para salvar.", variant: "destructive"});
        return;
    }

    setIsUpdating(true);
    const result = await updateIncidentStatusAction({
      id: incident.id,
      status: selectedStatus,
      notes: notes,
      inspector,
      updatedBy: currentUser.displayName || currentUser.email || 'Admin',
    });
    setIsUpdating(false);

    if (result.success) {
      toast({ title: "Sucesso!", description: "A denúncia foi atualizada." });
      setNotes('');
      onUpdateSuccess();
    } else {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    }
  };
  
  const currentStatusOption = statusOptions.find(s => s.value === incident.status);
  const isActionDisabled = !currentUser || 
                         (currentUser.role !== 'superAdmin' && currentUser.department !== incident?.department) ||
                         incident?.status === 'resolvida' ||
                         incident?.status === 'arquivada_improcedente';


  return (
      <>
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/admin/incidents">
                <ArrowLeft className="h-4 w-4" />
            </Link>
            </Button>
            <PageTitle title={`Denúncia #${incident.protocol}`} icon={AlertTriangle} className="mb-0 flex-grow" />
            {currentStatusOption && (
            <Badge variant={getStatusVariant(incident.status)} className="text-sm px-3 py-1">
                {currentStatusOption.icon && <currentStatusOption.icon className="h-4 w-4 mr-2"/>}
                {currentStatusOption.label}
            </Badge>
            )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Detalhes da Denúncia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Denúncia</p>
                    <p className="text-md">{incident.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
                <Separator/>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Reportado Por</p>
                    <div className="flex items-center gap-2 mt-1">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    <p className="text-md">{incident.reportedBy || 'Anônimo'}</p>
                    </div>
                </div>
                <Separator/>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Data do Relato</p>
                    <div className="flex items-center gap-2 mt-1">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <p className="text-md">{new Date(incident.dateCreated).toLocaleString()}</p>
                    </div>
                </div>
                <Separator/>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Localização</p>
                    <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <p className="text-md">{incident.location}</p>
                    </div>
                </div>
                <Separator/>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Descrição Completa</p>
                    <p className="text-md whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{incident.description}</p>
                </div>
                
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Evidências Anexadas</p>
                    {(incident.evidenceUrls && incident.evidenceUrls.length > 0) ? (
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {incident.evidenceUrls.map((url, index) => (
                        <Link key={index} href={url} target="_blank" rel="noopener noreferrer" className="relative group aspect-square border rounded-md overflow-hidden bg-muted">
                            {url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-2">
                                <Video className="h-10 w-10 text-muted-foreground" />
                                <p className="text-xs text-center text-muted-foreground mt-1">Vídeo</p>
                            </div>
                            ) : (
                            <Image src={url} alt={`Evidência ${index + 1}`} layout="fill" objectFit="cover" />
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="h-8 w-8 text-white" />
                            </div>
                        </Link>
                        ))}
                    </div>
                    ) : (
                    <div className="mt-2 flex items-center justify-center text-center text-muted-foreground bg-muted/50 rounded-md p-6 min-h-[100px]">
                        <div className="space-y-1">
                            <Camera className="h-8 w-8 mx-auto" />
                            <p className="text-sm">Nenhuma evidência foi anexada a esta denúncia.</p>
                        </div>
                    </div>
                    )}
                </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Ações e Fiscalização</CardTitle>
                    <CardDescription>
                    {isActionDisabled 
                        ? "As ações estão desabilitadas pois você não tem permissão ou a denúncia está em um status final."
                        : "Registre as ações tomadas e atualize o status."}
                    </CardDescription>
                </CardHeader>
                <fieldset disabled={isActionDisabled}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="status">Alterar Status</Label>
                        <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as IncidentStatus)}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Selecione um novo status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center">
                                            {option.icon && <option.icon className="h-4 w-4 mr-2 text-muted-foreground"/>}
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="fiscal-notes">Parecer Técnico / Ações Tomadas</Label>
                        <Textarea 
                            id="fiscal-notes" 
                            placeholder="Descreva a visita ao local, contatos feitos, autos de infração, etc..." 
                            className="min-h-[100px]"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="assigned-inspector">Fiscal Responsável (opcional)</Label>
                        <Input 
                            id="assigned-inspector" 
                            placeholder="Nome do fiscal"
                            value={inspector}
                            onChange={(e) => setInspector(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpdate} disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Edit3 className="mr-2 h-4 w-4" />}
                        Salvar Progresso
                    </Button>
                </CardFooter>
                </fieldset>
            </Card>
            </div>
            <div className="md:col-span-1 space-y-6">
                <SuspenseAISuggestions incident={incident} />
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <History className="mr-2 h-5 w-5 text-primary"/>
                        Histórico de Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {incident.history && incident.history.length > 0 ? (
                        <ul className="space-y-0 -ml-3">
                            {incident.history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry, index) => (
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

// Componente separado para carregar as sugestões da IA
function SuspenseAISuggestions({ incident }: { incident: IncidentReport }) {
  const [resolvedTickets, setResolvedTickets] = useState<ResolvedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarTickets() {
      setLoading(true);
      const similarResolvedIncidents = await getIncidentsForAdminAction({
          status: 'resolvida',
          type: incident.type,
          limit: 20
      });

      const similarResolved = similarResolvedIncidents
        .filter(inc => inc.id !== incident.id)
        .map(inc => ({
          ticketId: inc.protocol,
          description: inc.description,
          resolution: inc.notes || "Denúncia marcada como resolvida sem notas detalhadas.",
        }));
      setResolvedTickets(similarResolved);
      setLoading(false);
    }
    
    fetchSimilarTickets();
  }, [incident]);

  if (loading) {
      return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-primary"/> Sugestões da IA
                </CardTitle>
                 <CardDescription>Buscando tickets similares...</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <SimilarTicketsSuggestions
      currentTicket={{ description: incident.description, type: incident.type }}
      availableResolvedTickets={resolvedTickets}
    />
  )
}


export default function AdminIncidentDetailPage({ params }: { params: { id: string } }) {
  const [incident, setIncident] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchIncident = async () => {
      setLoading(true);
      const fetchedIncident = await getIncidentByIdAction(params.id);
      if (fetchedIncident) {
          setIncident(fetchedIncident);
      } else {
          toast({ title: "Erro", description: "Denúncia não encontrada.", variant: "destructive" });
      }
      setLoading(false);
  };
  
  useEffect(() => {
    if (params.id) {
        fetchIncident();
    }
  }, [params.id, refreshKey]);

  const handleUpdateSuccess = () => {
    setRefreshKey(prev => prev + 1); // Trigger a re-fetch
  }

  if (loading) {
    return (
        <div>
            <Skeleton className="h-8 w-1/2 mb-6" />
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                </div>
                <div className="md:col-span-1 space-y-6">
                     <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    );
  }

  if (!incident) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold">Denúncia não encontrada</h1>
            <p className="text-muted-foreground max-w-md">Não foi possível carregar os detalhes da denúncia. Ela pode ter sido removida ou o ID é inválido.</p>
            <Button asChild className="mt-4">
                <Link href="/dashboard/admin/incidents">Voltar para a lista</Link>
            </Button>
        </div>
    )
  }

  return <AdminIncidentDetailPageContent incident={incident} onUpdateSuccess={handleUpdateSuccess} />;
}
