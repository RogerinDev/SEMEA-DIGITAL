
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, UserCircle, CalendarDays, Edit3, MessageSquare, CheckCircle, XCircle, Clock, Loader2, History } from 'lucide-react';
import Link from 'next/link';
import type { ServiceRequest, ServiceRequestStatus, StatusHistoryEntry } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRequestByIdAction, updateRequestStatusAction } from '@/app/actions/requests-actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';

const statusOptions: { value: ServiceRequest['status'], label: string, icon?: React.ElementType }[] = [
  { value: 'pendente', label: 'Pendente', icon: Clock },
  { value: 'em_analise', label: 'Em Análise', icon: Edit3 },
  { value: 'vistoria_agendada', label: 'Vistoria Agendada', icon: CalendarDays },
  { value: 'aguardando_documentacao', label: 'Aguardando Documentação', icon: FileText },
  { value: 'aprovado', label: 'Aprovado', icon: CheckCircle },
  { value: 'rejeitado', label: 'Rejeitado', icon: XCircle },
  { value: 'concluido', label: 'Concluído', icon: CheckCircle },
  { value: 'cancelado_pelo_usuario', label: 'Cancelado pelo Usuário', icon: XCircle },
];

function getStatusVariant(status: ServiceRequest['status']): "default" | "secondary" | "destructive" | "outline" {
    switch (status) {
      case 'aprovado': case 'concluido': return 'default';
      case 'em_analise': case 'vistoria_agendada': return 'secondary';
      case 'rejeitado': case 'cancelado_pelo_usuario': return 'destructive';
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


export default function AdminRequestDetailPage({ params }: { params: { id: string } }) {
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ServiceRequestStatus>();
  const [notes, setNotes] = useState(''); // Parecer técnico/observações
  
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchRequestData() {
      setLoading(true);
      
      const fetchedRequest = await getRequestByIdAction(params.id);

      if (fetchedRequest) {
        setRequest(fetchedRequest);
        setSelectedStatus(fetchedRequest.status);
        setNotes('');
      } else {
         toast({ title: "Erro", description: "Solicitação não encontrada.", variant: "destructive" });
      }
      setLoading(false);
    }
    
    if (params.id) {
      fetchRequestData();
    }
  }, [params.id, toast]);
  
  const handleUpdate = async () => {
    if (!request || !selectedStatus || !currentUser) return;
    if (selectedStatus === request.status && !notes.trim()) {
        toast({ title: "Nenhuma alteração", description: "Altere o status ou adicione um parecer técnico para salvar.", variant: "destructive"});
        return;
    }
    
    setIsUpdating(true);
    const result = await updateRequestStatusAction({
        id: request.id,
        status: selectedStatus,
        notes: notes,
        updatedBy: currentUser.displayName || currentUser.email || 'Admin',
    });
    setIsUpdating(false);
    
    if (result.success) {
        toast({ title: "Sucesso!", description: "A solicitação foi atualizada." });
        const fetchedRequest = await getRequestByIdAction(params.id);
        if (fetchedRequest) {
            setRequest(fetchedRequest);
            setSelectedStatus(fetchedRequest.status);
            setNotes(''); // Limpa as notas após salvar no histórico
        }
    } else {
        toast({ title: "Erro", description: result.error, variant: "destructive" });
    }
  };

  const isActionDisabled = !currentUser || 
                           (currentUser.role !== 'superAdmin' && currentUser.department !== request?.department) ||
                           request?.status === 'concluido' ||
                           request?.status === 'cancelado_pelo_usuario';

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

  if (!request) {
    return <p>Solicitação não encontrada.</p>;
  }

  const currentStatusOption = statusOptions.find(s => s.value === request.status);

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/requests">
            <span>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar para lista</span>
            </span>
          </Link>
        </Button>
        <PageTitle title={`Solicitação #${request.protocol}`} icon={FileText} className="mb-0 flex-grow" />
        {currentStatusOption && (
          <Badge variant={getStatusVariant(request.status)} className="text-sm px-3 py-1">
            {currentStatusOption.icon && <currentStatusOption.icon className="h-4 w-4 mr-2"/>}
            {currentStatusOption.label}
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Solicitação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Serviço</p>
                <p className="text-md">{request.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
              <Separator/>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Solicitante</p>
                <div className="flex items-center gap-2 mt-1">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                  <p className="text-md">{request.citizenName}</p>
                </div>
              </div>
              <Separator/>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Datas</p>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <p className="text-md">Criada em: {new Date(request.dateCreated).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <p className="text-md">Atualizada em: {new Date(request.dateUpdated).toLocaleString()}</p>
                </div>
              </div>
              {request.address && (
                <>
                  <Separator/>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                    <p className="text-md">{request.address}</p>
                  </div>
                </>
              )}
              <Separator/>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição Completa</p>
                <p className="text-md whitespace-pre-wrap bg-muted/50 p-3 rounded-md break-words">{request.description}</p>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle>Processar Solicitação</CardTitle>
                 <CardDescription>
                  {isActionDisabled 
                    ? "As ações estão desabilitadas pois você não tem permissão ou a solicitação está em um status final."
                    : "Atualize o status e adicione um parecer técnico."}
                </CardDescription>
            </CardHeader>
            <fieldset disabled={isActionDisabled}>
              <CardContent className="space-y-4">
                  <div>
                      <Label htmlFor="status">Alterar Status</Label>
                      <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ServiceRequestStatus)}>
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
                      <Label htmlFor="notes">Parecer Técnico / Observações</Label>
                      <Textarea 
                          id="notes" 
                          placeholder="Adicione notas sobre a vistoria, decisão, próximos passos..." 
                          className="min-h-[100px]" 
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                      />
                  </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                  <Button onClick={handleUpdate} disabled={isUpdating}>
                      {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Edit3 className="mr-2 h-4 w-4" />}
                      Salvar Alterações
                  </Button>
              </CardFooter>
            </fieldset>
           </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <History className="mr-2 h-5 w-5 text-primary"/>
                    Histórico de Status
                </CardTitle>
            </CardHeader>
            <CardContent>
                 {request.history && request.history.length > 0 ? (
                    <ul className="space-y-0 -ml-3">
                        {request.history.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry, index) => (
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

    
