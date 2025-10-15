
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { addRequestAction } from "@/app/actions/requests-actions";
import { Loader2, Send } from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const bookingFormSchema = z.object({
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

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface EducationBookingFormProps {
  preselectedProject?: string | null;
}

export function EducationBookingForm({ preselectedProject }: EducationBookingFormProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      institutionName: "",
      responsibleName: "",
      contactPhone: "",
      contactEmail: "",
      interestDetails: preselectedProject || "",
      targetAudienceDescription: "",
      additionalObservations: "",
      interestType: preselectedProject ? "projeto" : undefined,
    },
  });
  
  useEffect(() => {
    if (preselectedProject) {
      form.setValue('interestDetails', preselectedProject);
      form.setValue('interestType', 'projeto');
    }
  }, [preselectedProject, form]);

  async function onSubmit(data: BookingFormValues) {
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

        <FormField
          control={form.control}
          name="interestType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Interesse</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
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
          <Button type="submit" disabled={isSubmitting || !currentUser}>
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
            {currentUser ? 'Enviar Solicitação' : 'Faça login para enviar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
