
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Send, Mail, Phone, Info, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { educationalProjects, thematicLectures } from "@/lib/education-data";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { addRequestAction } from "@/app/actions/requests-actions";
import { useRouter } from "next/navigation";

const participationFormSchema = z.object({
  institutionName: z.string().min(3, "Nome da instituição é obrigatório."),
  responsibleName: z.string().min(3, "Nome do responsável é obrigatório."),
  contactPhone: z.string().min(10, "Telefone inválido. Inclua o DDD."),
  contactEmail: z.string().email("E-mail inválido."),
  projectsOfInterest: z.array(z.string()).optional(),
  lecturesOfInterest: z.array(z.string()).optional(),
  otherInterests: z.string().optional(),
  targetAudienceDescription: z.string().min(10, "Descreva o público-alvo (mín. 10 caracteres)."),
  estimatedParticipants: z.string().min(1, "Número estimado é obrigatório."),
  suggestedDates: z.string().optional(),
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
      projectsOfInterest: [],
      lecturesOfInterest: [],
      otherInterests: "",
      targetAudienceDescription: "",
      estimatedParticipants: "",
      suggestedDates: "",
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
- Projetos de Interesse: ${data.projectsOfInterest?.join(', ') || 'Nenhum'}
- Palestras de Interesse: ${data.lecturesOfInterest?.join(', ') || 'Nenhuma'}
- Outros Interesses: ${data.otherInterests || 'Nenhum'}
- Público-Alvo: ${data.targetAudienceDescription}
- Nº Estimado de Participantes: ${data.estimatedParticipants}
- Datas Sugeridas: ${data.suggestedDates || 'Nenhuma'}
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

  const projectOptions = educationalProjects.map(p => ({ id: p.slug, label: p.title }));
  const lectureOptions = thematicLectures.map(l => ({ id: l.id, label: l.title }));


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
              <CardTitle>Manifeste seu Interesse</CardTitle>
              <CardDescription>
                Instituições interessadas em receber um projeto de educação ambiental ou palestra devem preencher o formulário abaixo. 
                Caso deseje mais informações sobre os projetos antes de agendar, pode solicitar uma reunião de apresentação através dos contatos ao lado. É necessário estar logado para enviar.
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

                  <FormItem>
                    <FormLabel className="text-base font-semibold">Projetos de Interesse (opcional)</FormLabel>
                    <FormDescription>Marque os projetos que sua instituição tem interesse.</FormDescription>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        {projectOptions.map((project) => (
                        <FormField
                            key={project.id}
                            control={form.control}
                            name="projectsOfInterest"
                            render={({ field }) => {
                            return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value?.includes(project.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...(field.value || []), project.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== project.id
                                            )
                                        );
                                    }}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                    {project.label}
                                </FormLabel>
                                </FormItem>
                            );
                            }}
                        />
                        ))}
                    </div>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel className="text-base font-semibold">Palestras de Interesse (opcional)</FormLabel>
                    <FormDescription>Selecione as palestras desejadas.</FormDescription>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        {lectureOptions.map((lecture) => (
                        <FormField
                            key={lecture.id}
                            control={form.control}
                            name="lecturesOfInterest"
                            render={({ field }) => {
                            return (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value?.includes(lecture.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...(field.value || []), lecture.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== lecture.id
                                            )
                                        );
                                    }}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                    {lecture.label}
                                </FormLabel>
                                </FormItem>
                            );
                            }}
                        />
                        ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                  
                  <FormField control={form.control} name="otherInterests" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outros Interesses/Temas</FormLabel>
                        <FormControl><Input {...field} placeholder="Caso tenha interesse em um tema não listado" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <Separator />

                  <FormField control={form.control} name="targetAudienceDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público-Alvo da Instituição</FormLabel>
                      <FormControl><Textarea {...field} placeholder="Descreva o público que participará (ex: alunos do 5º ano, professores, comunidade local)" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="estimatedParticipants" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número Estimado de Participantes</FormLabel>
                      <FormControl><Input type="number" {...field} placeholder="Ex: 50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="suggestedDates" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sugestão de Datas/Período (opcional)</FormLabel>
                      <FormControl><Input {...field} placeholder="Ex: Segunda quinzena de Maio, Terças pela manhã" /></FormControl>
                      <FormDescription>Informe algumas datas ou períodos de preferência para a realização da atividade.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="additionalObservations" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Adicionais (opcional)</FormLabel>
                      <FormControl><Textarea {...field} placeholder="Espaço para informações adicionais, necessidades específicas, etc." /></FormControl>
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
                Sinta-se à vontade para entrar em contato para tirar dúvidas ou solicitar uma reunião de apresentação dos nossos projetos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
