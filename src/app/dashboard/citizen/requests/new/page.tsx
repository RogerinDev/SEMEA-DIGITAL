
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

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
});

export default function NewServiceRequestPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type') as ServiceRequestType | null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestType: undefined, // Initialize as undefined
      description: "",
      address: "",
      contactPhone: "",
    },
  });

  useEffect(() => {
    // Set the value if preselectedType is valid and available in SERVICE_REQUEST_TYPES
    if (preselectedType && SERVICE_REQUEST_TYPES.some(rt => rt.value === preselectedType)) {
      form.setValue('requestType', preselectedType);
    }
  }, [preselectedType, form, form.setValue]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Solicitação Enviada!",
      description: `Sua solicitação de ${SERVICE_REQUEST_TYPES.find(s => s.value === values.requestType)?.label} foi registrada com sucesso. Protocolo: ${Date.now().toString().slice(-6)}`,
      variant: "default",
    });
    
    // Reset form, re-applying preselectedType if it exists for a new form submission
    const resetValues = {
        requestType: undefined,
        description: "",
        address: "",
        contactPhone: "",
    };
    if (preselectedType && SERVICE_REQUEST_TYPES.some(rt => rt.value === preselectedType)) {
        resetValues.requestType = preselectedType;
    }
    form.reset(resetValues);
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
                    <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""} // Ensure value is controlled and not undefined
                    >
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
                      Selecione o tipo de serviço desejado.
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
                      Detalhe sua solicitação. Informações claras agilizam o atendimento.
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
                       Informe o endereço onde o serviço será realizado, se aplicável.
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
                       Informe um telefone para contato, caso necessário para esta solicitação.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

    
