import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, UserCircle, CalendarDays, Edit3, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import type { ServiceRequest, ResolvedTicket } from '@/types';
import { SimilarTicketsSuggestions } from '@/components/ai/similar-tickets-suggestions';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data - in a real app, this would be fetched based on params.id
const mockRequest: ServiceRequest = { 
  id: '1', 
  protocol: '2024001', 
  type: 'poda_arvore', 
  citizenName: 'Maria Silva', 
  description: 'Árvore muito alta na frente de casa, com galhos secos e longos tocando os fios de eletricidade. Apresenta risco de queda em dias de vento forte. A árvore é um flamboyant antigo e grande. Localizada na Rua das Acácias, 123, Bairro Florido.', 
  status: 'em_analise', 
  dateCreated: new Date(2024, 6, 10, 9, 30).toISOString(), 
  dateUpdated: new Date(2024, 6, 11, 14, 0).toISOString(),
  address: "Rua das Acácias, 123, Bairro Florido"
};

// Mock resolved tickets that could be passed to the AI component
const mockAvailableResolvedTickets: ResolvedTicket[] = [
  { ticketId: "R001", description: "Árvore grande na calçada com galhos secos e risco de queda sobre pedestres. Espécie flamboyant.", resolution: "Realizada vistoria, constatado risco. Poda de segurança efetuada e galhos removidos." },
  { ticketId: "R002", description: "Solicito corte de árvore morta na praça central. Está completamente seca.", resolution: "Equipe verificou, árvore realmente morta. Remoção completa realizada e plantio de nova muda no local agendado." },
  { ticketId: "R003", description: "Poda de galhos baixos de uma mangueira na Rua das Acácias que estão atrapalhando a passagem de ônibus.", resolution: "Poda de levantamento de copa executada, liberando a via para tráfego de veículos altos." },
];

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

export default function AdminRequestDetailPage({ params }: { params: { id: string } }) {
  // In a real app, fetch request data using params.id
  const request = mockRequest; 
  if (!request) return <p>Solicitação não encontrada.</p>;

  const currentStatusOption = statusOptions.find(s => s.value === request.status);

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/requests">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para lista</span>
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
                <p className="text-md whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{request.description}</p>
              </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle>Processar Solicitação</CardTitle>
                <CardDescription>Atualize o status e adicione observações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="status">Alterar Status</Label>
                    <Select defaultValue={request.status}>
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
                    <Textarea id="notes" placeholder="Adicione notas sobre a vistoria, decisão, próximos passos..." className="min-h-[100px]" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button><Edit3 className="mr-2 h-4 w-4" /> Salvar Alterações</Button>
            </CardFooter>
           </Card>
        </div>

        <div className="md:col-span-1">
          <SimilarTicketsSuggestions 
            currentTicket={{ description: request.description, type: request.type }}
            availableResolvedTickets={mockAvailableResolvedTickets}
          />
          {/* Placeholder for Histórico de Status */}
          <Card className="mt-6">
            <CardHeader>
                <CardTitle>Histórico de Status</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">O histórico de alterações de status apareceria aqui.</p>
                {/* Example:
                <ul className="space-y-2">
                    <li className="text-sm"><strong>Concluído</strong> - 05/04/2024 por Admin - Serviço finalizado.</li>
                    <li className="text-sm"><strong>Aprovado</strong> - 25/05/2024 por Técnico Ambiental - Vistoria OK.</li>
                </ul>
                 */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
