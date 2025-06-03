"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, PlusCircle, ArrowLeft } from 'lucide-react';
import { INCIDENT_TYPES, type IncidentType } from '@/types';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  incidentType: z.custom<IncidentType>(val => INCIDENT_TYPES.map(it => it.value).includes(val as IncidentType), {
    message: "Tipo de incidente inválido",
  }),
  description: z.string().min(20, {
    message: "A descrição deve ter pelo menos 20 caracteres.",
  }).max(1500, {
    message: "A descrição não pode exceder 1500 caracteres."
  }),
  location: z.string().min(5, {
    message: "A localização deve ter pelo menos 5 caracteres.",
  }),
  locationReference: z.string().optional(),
  anonymous: z.boolean().default(false).optional(),
  // attachments: z.instanceof(FileList).optional(), // File uploads
});

export default function NewIncidentReportPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      location: "",
      anonymous: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Backend submission logic
    toast({
      title: "Incidente Reportado!",
      description: `Seu relato de ${INCIDENT_TYPES.find(s => s.value === values.incidentType)?.label} foi registrado. Protocolo: DEN${Date.now().toString().slice(-6)}`,
      variant: "default",
    });
    form.reset();
    // router.push('/dashboard/citizen/incidents');
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen/incidents">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <PageTitle title="Reportar Novo Incidente" icon={AlertTriangle} className="mb-0 flex-grow" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Incidente</CardTitle>
          <CardDescription>Descreva o incidente ambiental que você presenciou. Sua colaboração é importante.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="incidentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Incidente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de incidente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INCIDENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Fato</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o que aconteceu, quando, e quem estava envolvido (se souber)..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização da Ocorrência</FormLabel>
                    <FormControl>
                      <Input placeholder="Endereço completo ou o mais próximo possível" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ponto de Referência (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Próximo à padaria, em frente ao poste X" {...field} />
                    </FormControl>
                    <FormDescription>Ajude-nos a localizar o incidente com mais precisão.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {/* Placeholder for file uploads
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fotos/Vídeos (opcional)</FormLabel>
                    <FormControl>
                      <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormDescription>
                      Anexe evidências visuais do incidente (limite 5MB por arquivo).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              */}
              <FormField
                control={form.control}
                name="anonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Reportar anonimamente
                      </FormLabel>
                      <FormDescription>
                        Se marcado, seus dados pessoais não serão vinculados a este relato.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/citizen/incidents">Cancelar</Link>
                </Button>
                <Button type="submit">Enviar Relato</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
