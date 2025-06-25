
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { TreePine, Droplets, GraduationCap, PawPrint } from 'lucide-react';


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
import { SERVICE_REQUEST_TYPES, type ServiceRequestType, type ServiceCategory, type ServiceRequest } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

const formSchema = z.object({
  requestType: z.custom<ServiceRequestType>(val => SERVICE_REQUEST_TYPES.map(srt => srt.value).includes(val as ServiceRequestType), {
    message: "Por favor, selecione um serviço específico.",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }).max(1000, {
    message: "A descrição não pode exceder 1000 caracteres."
  }),
  address: z.string().optional(),
  contactPhone: z.string().optional(),
});

const categories: { [key in ServiceCategory]: { label: string; icon: React.ElementType } } = {
  arborizacao: { label: 'Arborização', icon: TreePine },
  residuos: { label: 'Resíduos', icon: Droplets },
  bem_estar_animal: { label: 'Bem-Estar Animal', icon: PawPrint },
  educacao_ambiental: { label: 'Educação Ambiental e Outros', icon: GraduationCap },
};

export default function NewRequestFormLogic() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useAuth();

  const preselectedType = searchParams.get('type') as ServiceRequestType | null;
  const initialTypeInfo = SERVICE_REQUEST_TYPES.find(rt => rt.value === preselectedType);
  
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(initialTypeInfo?.category || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requestType: initialTypeInfo?.value || undefined,
      description: "",
      address: "",
      contactPhone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newRequest: ServiceRequest = {
        id: `SOL${Date.now()}`,
        protocol: `SOL${Date.now().toString().slice(-6)}`,
        type: values.requestType,
        description: values.description,
        status: 'pendente',
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        citizenName: currentUser?.displayName || currentUser?.email || 'Cidadão',
        address: values.address,
        contactPhone: values.contactPhone,
    };

    // Save to localStorage
    const existingRequestsJSON = localStorage.getItem('citizen_requests');
    const existingRequests: ServiceRequest[] = existingRequestsJSON ? JSON.parse(existingRequestsJSON) : [];
    localStorage.setItem('citizen_requests', JSON.stringify([newRequest, ...existingRequests]));

    toast({
      title: "Solicitação Enviada!",
      description: `Sua solicitação de ${SERVICE_REQUEST_TYPES.find(s => s.value === values.requestType)?.label} foi registrada com sucesso. Protocolo: ${newRequest.protocol}`,
      variant: "default",
    });
    
    router.push('/dashboard/citizen/requests');
  }

  const handleCategorySelect = (category: ServiceCategory) => {
    setSelectedCategory(category);
    form.resetField('requestType');
  }
  
  const handleBackToCategories = () => {
      setSelectedCategory(null);
      form.resetField('requestType');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {!selectedCategory ? (
            <FormItem>
              <FormLabel className="text-base">Tipo de Solicitação</FormLabel>
              <FormDescription>Primeiro, selecione a categoria do serviço desejado.</FormDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {Object.entries(categories).map(([key, { label, icon: Icon }]) => (
                      <Button
                          key={key}
                          type="button"
                          variant="outline"
                          className="h-auto justify-start p-4 text-left group"
                          onClick={() => handleCategorySelect(key as ServiceCategory)}
                      >
                          <Icon className="mr-4 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                          <span className="font-semibold text-base">{label}</span>
                      </Button>
                  ))}
              </div>
            </FormItem>
        ) : (
            <div className="p-4 border rounded-md bg-card space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {React.createElement(categories[selectedCategory].icon, { className: "h-6 w-6 text-primary"})}
                        <h3 className="text-lg font-semibold text-foreground">Categoria: {categories[selectedCategory].label}</h3>
                    </div>
                    <Button type="button" variant="link" onClick={handleBackToCategories} className="text-sm">
                        Trocar Categoria
                    </Button>
                </div>
                 <FormField
                  control={form.control}
                  name="requestType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serviço Específico</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o serviço desejado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SERVICE_REQUEST_TYPES
                            .filter(type => type.category === selectedCategory)
                            .map(type => (
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
            </div>
        )}

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
