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
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { SERVICE_REQUEST_TYPES, type ServiceRequestType } from '@/types';
import { useToast } from "@/hooks/use-toast";


const formSchema = z.object({
  requestType: z.custom<ServiceRequestType>(val => SERVICE_REQUEST_TYPES.map(srt => srt.value).includes(val as ServiceRequestType), {
    message: "Tipo de solicitação inválido",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }).max(1000, {
    message: "A descrição não pode exceder 1000 caracteres."
  }),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
  // attachments: z.instanceof(FileList).optional(), // For file uploads, more complex handling needed
});

export default function NewServiceRequestPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send the data to your backend
    toast({
      title: "Solicitação Enviada!",
      description: `Sua solicitação de ${SERVICE_REQUEST_TYPES.find(s => s.value === values.requestType)?.label} foi registrada com sucesso. Protocolo: ${Date.now().toString().slice(-6)}`,
      variant: "default",
    });
    form.reset();
    // Potentially redirect or update UI
    // router.push('/dashboard/citizen/requests');
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen/requests">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <PageTitle title="Nova Solicitação de Serviço" icon={PlusCircle} className="mb-0 flex-grow" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Solicitação</CardTitle>
          <CardDescription>Preencha o formulário abaixo para abrir uma nova solicitação de serviço.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Solicitação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_REQUEST_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Escolha o serviço que você precisa.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Detalhada</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva sua solicitação com o máximo de detalhes possível..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Forneça informações claras para nos ajudar a entender sua necessidade.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço (se aplicável)</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua Exemplo, 123, Bairro" {...field} />
                    </FormControl>
                     <FormDescription>
                      Informe o endereço relacionado à solicitação, se houver.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone para Contato (opcional)</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} />
                    </FormControl>
                     <FormDescription>
                      Caso precisemos entrar em contato sobre esta solicitação.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Placeholder for file uploads - actual implementation is more complex
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anexos (fotos, documentos)</FormLabel>
                    <FormControl>
                      <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                    </FormControl>
                    <FormDescription>
                      Envie arquivos relevantes para sua solicitação (limite 5MB por arquivo).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/citizen/requests">Cancelar</Link>
                </Button>
                <Button type="submit">Enviar Solicitação</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
