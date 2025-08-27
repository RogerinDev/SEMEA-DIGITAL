
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, UserCircle, CalendarDays, MapPin, Edit3, MessageSquare, CheckCircle, XCircle, Clock, FileText, Loader2, CameraOff } from 'lucide-react';
import Link from 'next/link';
import type { IncidentReport, IncidentStatus } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getIncidentByIdAction, updateIncidentStatusAction } from '@/app/actions/incidents-actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function AdminIncidentDetailPage({ params }: { params: { id: string } }) {
  const [incident, setIncident] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus>();
  const [notes, setNotes] = useState('');
  const [inspector, setInspector] = useState('');

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchIncident() {
      setLoading(true);
      const fetchedIncident = await getIncidentByIdAction(params.id);
      if (fetchedIncident) {
        setIncident(fetchedIncident);
        setSelectedStatus(fetchedIncident.status);
        setNotes(fetchedIncident.notes || '');
        setInspector(fetchedIncident.inspector || '');
      }
      setLoading(false);
    }
    fetchIncident();
  }, [params.id]);

  const handleUpdate = async () => {
    if (!incident || !selectedStatus) return;

    setIsUpdating(true);
    const result = await updateIncidentStatusAction({
      id: incident.id,
      status: selectedStatus,
      notes,
      inspector,
    });
    setIsUpdating(false);

    if (result.success) {
      toast({ title: "Sucesso!", description: "A denúncia foi atualizada." });
       const fetchedIncident = await getIncidentByIdAction(params.id);
        if (fetchedIncident) {
            setIncident(fetchedIncident);
        }
    } else {
      toast({ title: "Erro", description: result.error, variant: "destructive" });
    }
  };
  
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

  if (!incident) return <p>Denúncia não encontrada.</p>;

  const currentStatusOption = statusOptions.find(s => s.value === incident.status);

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/incidents">
            <span><ArrowLeft className="h-4 w-4" /></span>
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
              {/* Placeholder for photos/videos */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Evidências (Fotos/Vídeos)</p>
                <div className="mt-2 flex items-center justify-center text-center text-muted-foreground bg-muted/50 rounded-md p-6 min-h-[100px]">
                    <div className="space-y-1">
                        <CameraOff className="h-8 w-8 mx-auto" />
                        <p className="text-sm">Nenhuma evidência foi anexada a esta denúncia.</p>
                        <p className="text-xs">(Funcionalidade de upload em desenvolvimento)</p>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>Ações e Fiscalização</CardTitle>
                <CardDescription>Registre as ações tomadas e atualize o status.</CardDescription>
            </CardHeader>
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
                    <Label htmlFor="fiscal-notes">Relatório de Fiscalização / Ações Tomadas</Label>
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
           </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Histórico de Ações</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">O histórico de ações e mudanças de status aparecerá aqui.</p>
                 {/* Example:
                <ul className="space-y-2 text-sm">
                    <li className="text-sm"><strong>Em Verificação</strong> - 18/08/2024 por Admin - Denúncia encaminhada para o fiscal.</li>
                    <li className="text-sm"><strong>Recebida</strong> - 17/08/2024 - Sistema registrou a denúncia.</li>
                </ul>
                 */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
