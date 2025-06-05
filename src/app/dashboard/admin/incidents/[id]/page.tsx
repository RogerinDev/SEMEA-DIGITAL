import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, UserCircle, CalendarDays, MapPin, Edit3, MessageSquare, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import type { IncidentReport } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';

// Mock data
const mockIncident: IncidentReport = { 
  id: '1', 
  protocol: 'DEN2024001', 
  type: 'descarte_irregular_residuo', 
  reportedBy: 'Cidadão Anônimo', 
  description: 'Grande quantidade de entulho e lixo doméstico descartado em um terreno baldio na esquina da Rua das Palmeiras com a Av. das Flores. O descarte ocorreu durante a noite e está atraindo vetores.', 
  status: 'em_verificacao', 
  dateCreated: new Date(2024, 6, 15, 10,0).toISOString(), 
  location: 'Esquina da Rua das Palmeiras com Av. das Flores, Bairro Jardim Primavera'
};

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
  const incident = mockIncident; 
  if (!incident) return <p>Incidente não encontrado.</p>;

  const currentStatusOption = statusOptions.find(s => s.value === incident.status);

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/incidents">
            <span><ArrowLeft className="h-4 w-4" /></span>
          </Link>
        </Button>
        <PageTitle title={`Incidente #${incident.protocol}`} icon={AlertTriangle} className="mb-0 flex-grow" />
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
              <CardTitle>Detalhes do Incidente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tipo de Incidente</p>
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
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {/* Example images - replace with actual data if available */}
                    <Image src="https://placehold.co/300x200.png" data-ai-hint="garbage waste" alt="Evidência 1" width={300} height={200} className="rounded-md object-cover aspect-[3/2]" />
                    <Image src="https://placehold.co/300x200.png" data-ai-hint="pollution environment" alt="Evidência 2" width={300} height={200} className="rounded-md object-cover aspect-[3/2]" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Nenhuma evidência anexada (placeholder).</p>
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
                    <Select defaultValue={incident.status}>
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
                    <Textarea id="fiscal-notes" placeholder="Descreva a visita ao local, contatos feitos, autos de infração, etc..." className="min-h-[100px]" />
                </div>
                <div>
                    <Label htmlFor="assigned-inspector">Fiscal Responsável (opcional)</Label>
                    <Input id="assigned-inspector" placeholder="Nome do fiscal" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button><Edit3 className="mr-2 h-4 w-4" /> Salvar Progresso</Button>
            </CardFooter>
           </Card>
        </div>
        <div className="md:col-span-1">
          {/* Placeholder for Mapa da Ocorrência */}
          <Card>
            <CardHeader>
                <CardTitle>Mapa da Ocorrência</CardTitle>
            </CardHeader>
            <CardContent>
                <Image src="https://placehold.co/400x300.png" data-ai-hint="city map" alt="Mapa da ocorrência" width={400} height={300} className="rounded-md w-full object-cover" />
                <p className="text-xs text-muted-foreground mt-2">Localização aproximada (placeholder).</p>
            </CardContent>
          </Card>

          {/* Placeholder for Histórico de Ações */}
          <Card className="mt-6">
            <CardHeader>
                <CardTitle>Histórico de Ações</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">O histórico de ações e mudanças de status apareceria aqui.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
