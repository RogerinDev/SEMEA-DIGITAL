
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Send, Mail, Phone, Info, Loader2, CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { addEducationRequestAction } from '@/app/actions/requests-actions';
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const projects = [
  { id: 'escola-verde', title: 'Escola Verde - Educação Climática' },
  { id: 'educacao-lixo-zero', title: 'Educação Lixo Zero' },
  { id: 'botanica-no-parque', title: 'Botânica no Parque' },
  { id: 'conexao-animal', title: 'Conexão Animal' },
];

const lectures = [
  { id: 'importancia-arvores', label: 'A Importância das Árvores' },
  { id: 'historia-lixo', label: 'História do Lixo' },
  { id: 'bichos-mato-mata', label: 'Bichos do Mato e da Mata' },
  { id: 'bichos-lixo', label: 'Os Bichos e o Lixo' },
  { id: 'cuidar-animais', label: 'Como cuidar dos animais de estimação' },
  { id: 'lixo-luxo', label: 'O Lixo que é Luxo' },
  { id: 'bicho-chama-bicho', label: 'Bicho que chama Bicho (Contação de Estória)' },
  { id: 'panorama-varginha', label: 'Panorama Ambiental de Varginha' },
  { id: 'ods', label: 'ODS (Temas Diversos)' },
];

const formSchema = z.object({
  responsibleName: z.string().min(3, "Nome do responsável é obrigatório."),
  contactPhone: z.string().min(10, "Telefone / WhatsApp é obrigatório."),
  institutionName: z.string().min(3, "Nome da instituição é obrigatório."),
  projects: z.array(z.string()),
  lectures: z.array(z.string()),
  eventDate: z.date({ required_error: "A data pretendida é obrigatória." }),
  eventTime: z.string().min(1, "Horário é obrigatório."),
  estimatedAudience: z.coerce.number().min(1, "Público estimado é obrigatório."),
  ageGroup: z.enum(['3-10', '11-15', '16-24', 'adults'], { required_error: "Selecione a faixa etária." }),
  observations: z.string().optional(),
});

export default function HowToParticipatePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsibleName: "",
      contactPhone: "",
      institutionName: "",
      projects: [],
      lectures: [],
      eventTime: "",
      observations: "",
    },
  });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const result = await addEducationRequestAction({
                ...data,
                eventDate: data.eventDate.toISOString(),
            });

            if (result.success) {
                toast({
                    title: "Solicitação Enviada!",
                    description: "Sua solicitação de agendamento foi registrada. Entraremos em contato em breve para confirmar.",
                });
                form.reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                throw new Error(result.error || "Não foi possível enviar a solicitação.");
            }
        } catch (error: any) {
            toast({
                title: "Erro ao Enviar",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
  

  return (
    <>
      <PageTitle
        title="Solicitar Ação de Educação Ambiental"
        icon={Users}
        description="Preencha o formulário para solicitar um projeto ou palestra. Nossa equipe analisará e entrará em contato para alinhar os detalhes."
      />

        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle>Formulário de Agendamento</CardTitle>
            <CardDescription>Este formulário é aberto ao público e pode ser preenchido por qualquer instituição interessada.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="responsibleName" render={({ field }) => (
                        <FormItem><FormLabel>Nome do Responsável</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="contactPhone" render={({ field }) => (
                        <FormItem><FormLabel>Telefone / WhatsApp</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="institutionName" render={({ field }) => (
                    <FormItem><FormLabel>Nome da Instituição</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="grid sm:grid-cols-2 gap-8">
                  <FormField control={form.control} name="projects" render={() => (
                    <FormItem>
                      <div className="mb-4"><FormLabel className="text-base">Ação ou Projeto de Interesse</FormLabel></div>
                      {projects.map((item) => (
                        <FormField key={item.id} control={form.control} name="projects" render={({ field }) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                return checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                            }} /></FormControl>
                            <FormLabel className="font-normal">{item.title}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lectures" render={() => (
                    <FormItem>
                      <div className="mb-4"><FormLabel className="text-base">Cardápio de Palestras</FormLabel></div>
                      {lectures.map((item) => (
                        <FormField key={item.id} control={form.control} name="lectures" render={({ field }) => (
                          <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => {
                                return checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((value) => value !== item.id))
                            }} /></FormControl>
                            <FormLabel className="font-normal">{item.label}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="eventDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Data Pretendida</FormLabel>
                      <Popover><PopoverTrigger asChild>
                          <FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button></FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} initialFocus />
                        </PopoverContent>
                      </Popover><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="eventTime" render={({ field }) => (
                    <FormItem><FormLabel>Horário Pretendido</FormLabel><FormControl><Input placeholder="Ex: 14:00" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="estimatedAudience" render={({ field }) => (
                    <FormItem><FormLabel>Público Estimado</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="ageGroup" render={({ field }) => (
                    <FormItem><FormLabel>Faixa Etária</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="3-10" /></FormControl><FormLabel className="font-normal">Crianças (3 a 10 anos)</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="11-15" /></FormControl><FormLabel className="font-normal">Adolescentes (11 a 15 anos)</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="16-24" /></FormControl><FormLabel className="font-normal">Jovens (16 a 24 anos)</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="adults" /></FormControl><FormLabel className="font-normal">Adultos/Misto</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="observations" render={({ field }) => (
                  <FormItem><FormLabel>Observações / Mais Informações</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                    Solicitar Agendamento
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
    </>
  );
}
