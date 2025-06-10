
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

export default function NewRequestFormLogic() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get('type') as ServiceRequestType | null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestType: preselectedType && SERVICE_REQUEST_TYPES.some(rt => rt.value === preselectedType) ? preselectedType : undefined,
      description: "",
      address: "",
      contactPhone: "",
    },
  });

  useEffect(() => {
    const currentFormType = form.getValues('requestType');
    if (preselectedType && SERVICE_REQUEST_TYPES.some(rt => rt.value === preselectedType)) {
      if (currentFormType !== preselectedType) {
        form.setValue('requestType', preselectedType);
      }
    } else if (!preselectedType && currentFormType !== undefined) {
      form.setValue('requestType', undefined);
    }
  }, [preselectedType, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Solicitação Enviada!",
      description: `Sua solicitação de ${SERVICE_REQUEST_TYPES.find(s => s.value === values.requestType)?.label} foi registrada com sucesso. Protocolo: ${Date.now().toString().slice(-6)}`,
      variant: "default",
    });
    
    const resetValues: Partial<z.infer<typeof formSchema>> = {
        requestType: undefined,
        description: "",
        address: "",
        contactPhone: "",
    };
    // Re-apply preselectedType if it was originally in the URL, for a "new" form experience
    if (preselectedType && SERVICE_REQUEST_TYPES.some(rt => rt.value === preselectedType)) {
        resetValues.requestType = preselectedType;
    }
    form.reset(resetValues);
  }

  return (
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
                  value={field.value || ""}
                  defaultValue={field.value || ""}
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
  );
}


    