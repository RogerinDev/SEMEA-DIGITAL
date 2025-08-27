
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Send, Mail, Phone, Info, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { addRequestAction } from "@/app/actions/requests-actions";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const participationFormSchema = z.object({
  institutionName: z.string().min(3, "Nome da instituição é obrigatório."),
  responsibleName: z.string().min(3, "Nome do responsável é obrigatório."),
  contactPhone: z.string().min(10, "Telefone inválido. Inclua o DDD."),
  contactEmail: z.string().email("E-mail inválido."),
  interestType: z.enum(["projeto", "palestra", "ambos", "outro"], { required_error: "Selecione o tipo de interesse." }),
  interestDetails: z.string().min(10, "Descreva o interesse com no mínimo 10 caracteres."),
  targetAudienceDescription: z.string().min(10, "Descreva o público-alvo (mín. 10 caracteres)."),
  estimatedParticipants: z.coerce.number().min(1, "Número estimado é obrigatório."),
  additionalObservations: z.string().optional(),
});

type ParticipationFormValues = z.infer<typeof participationFormSchema>;

export default function HowToParticipatePage() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ParticipationFormValues>({
    resolver: zodResolver(participationFormSchema),
    defaultValues: {
      institutionName: "",
      responsibleName: "",
      contactPhone: "",
      contactEmail: "",
      interestDetails: "",
      targetAudienceDescription: "",
      additionalObservations: "",
    },
  });

  async function onSubmit(data: ParticipationFormValues) {
    if (!currentUser) {
      toast({
        title: "Login Necessário",
        description: "Você precisa estar logado para enviar uma solicitação. Redirecionando...",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    setIsSubmitting(true);

    const description = `
Solicitação de Ação de Educação Ambiental:
- Instituição: ${data.institutionName}
- Responsável: ${data.responsibleName}
- Contato: ${data.contactPhone} / ${data.contactEmail}
- Tipo de Interesse: ${data.interestType}
- Detalhes do Interesse: ${data.interestDetails}
- Público-Alvo: ${data.targetAudienceDescription}
- Nº Estimado de Participantes: ${data.estimatedParticipants}
- Observações: ${data.additionalObservations || 'Nenhuma'}
    `.trim();

    const result = await addRequestAction({
      requestType: 'solicitacao_projeto_educacao_ambiental',
      description,
      contactPhone: data.contactPhone,
      citizenId: currentUser.uid,
      citizenName: data.responsibleName,
    });

    if (result.success) {
      toast({
        title: "Solicitação Enviada com Sucesso!",
        description: `Sua manifestação de interesse (Protocolo: ${result.protocol}) foi registrada. Entraremos em contato em breve.`,
        variant: "default",
      });
      form.reset();
    } else {
      toast({
        title: "Erro ao Enviar",
        description: result.error || "Não foi possível enviar a solicitação.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <>
      <PageTitle
        title="Como Participar dos Programas de Educação Ambiental"
        icon={Users}
        description="Sua instituição pode solicitar projetos e palestras da SEMEA. Veja como."
      />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Formulário de Solicitação</CardTitle>
              <CardDescription>
                Preencha o formulário para solicitar uma ação de educação ambiental. Nossa equipe analisará a solicitação e entrará em contato para alinhar os detalhes. É necessário estar logado para enviar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="institutionName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Instituição</FormLabel>
                        <FormControl><Input {...field} placeholder="Ex: Escola Municipal ABC" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="responsibleName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Responsável</FormLabel>
                        <FormControl><Input {...field} placeholder="Nome completo do contato" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="contactPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone de Contato</FormLabel>
                        <FormControl><Input type="tel" {...field} placeholder="(35) 9XXXX-XXXX" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contactEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail de Contato</FormLabel>
                        <FormControl><Input type="email" {...field} placeholder="contato@instituicao.com" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="interestType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Interesse</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de ação desejada" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="projeto">Projeto Educacional</SelectItem>
                            <SelectItem value="palestra">Palestra Temática</SelectItem>
                            <SelectItem value="ambos">Projeto e Palestra</SelectItem>
                            <SelectItem value="outro">Outro tipo de ação</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField control={form.control} name="interestDetails" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detalhes do Interesse</FormLabel>
                      <FormControl><Textarea {...field} placeholder="Cite o nome do projeto ou palestra de interesse. Se for 'outro', descreva a ação desejada." /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Separator />

                  <FormField control={form.control} name="targetAudienceDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público-Alvo da Ação</FormLabel>
                      <FormControl><Textarea {...field} placeholder="Descreva o público que participará (ex: alunos do 5º ano, professores, comunidade local)" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="estimatedParticipants" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número Estimado de Participantes</FormLabel>
                      <FormControl><Input type="number" {...field} placeholder="Ex: 50" onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="additionalObservations" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Adicionais (opcional)</FormLabel>
                      <FormControl><Textarea {...field} placeholder="Espaço para informações adicionais, necessidades específicas, sugestão de datas, etc." /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                      Enviar Solicitação
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary"/>Informações de Contato</CardTitle>
              <CardDescription>Setor de Educação Ambiental da SEMEA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Responsável:</strong> Bióloga Jaara Alvarenga Cardoso Tavares</p>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <a href="mailto:jaara.cardoso@varginha.mg.gov.br" className="text-primary hover:underline">jaara.cardoso@varginha.mg.gov.br</a>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>(35) 3690-2529</span>
              </div>
               <p className="text-sm text-muted-foreground pt-2">
                Sinta-se à vontade para entrar em contato para tirar dúvidas antes de preencher o formulário.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
