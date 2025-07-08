"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { addRequestAction } from "@/app/actions/requests-actions";

const formSchema = z.object({
  requestReason: z.enum(["poda", "corte"], { required_error: "Selecione o motivo da solicitação." }),
  propertyOwnerName: z.string().min(3, "Nome do proprietário é obrigatório."),
  propertyOwnerPhone: z.string().min(10, "Telefone para contato é obrigatório."),
  propertyAddress: z.string().min(5, "Endereço do imóvel é obrigatório."),
  treeLocation: z.string().min(5, "Localização da árvore é obrigatória."),
  justification: z.string().min(20, "A justificativa deve ter no mínimo 20 caracteres."),
  // Simple validation for file inputs
  docEscritura: z.any().optional(),
  docIptu: z.any().optional(),
  docRg: z.any().optional(),
  docOficio: z.any().optional(),
  docAutorizacao: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fileFields: { name: keyof FormValues; label: string; description: string }[] = [
  { name: 'docEscritura', label: 'Escritura ou Contrato de Compra', description: 'Documento que comprova a propriedade do imóvel.' },
  { name: 'docIptu', label: 'IPTU (Folha de Endereço/Metragem)', description: 'Página do carnê de IPTU com os dados do imóvel.' },
  { name: 'docRg', label: 'RG ou Documento com Foto', description: 'Documento de identificação do proprietário.' },
  { name: 'docOficio', label: 'Ofício (para Pessoa Jurídica)', description: 'Se a solicitação for para um CNPJ.' },
  { name: 'docAutorizacao', label: 'Autorização do Proprietário', description: 'Necessária se o imóvel for alugado.' },
];

export default function PruningRequestForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormValues) {
    if (!currentUser) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado para fazer esta solicitação.", variant: "destructive" });
      router.push('/login');
      return;
    }
    setIsSubmitting(true);
    
    // NOTE: File upload logic is not implemented in the backend action yet.
    // For now, we are just collecting the text data.
    const description = `
Requerimento de ${data.requestReason === 'corte' ? 'Corte' : 'Poda'} de Árvore:
- Proprietário: ${data.propertyOwnerName}
- Telefone: ${data.propertyOwnerPhone}
- Endereço do Imóvel: ${data.propertyAddress}
- Localização da Árvore: ${data.treeLocation}
- Justificativa: ${data.justification}

--- Documentos Anexados (placeholder) ---
- Escritura: ${data.docEscritura?.[0]?.name || 'Não anexado'}
- IPTU: ${data.docIptu?.[0]?.name || 'Não anexado'}
- RG: ${data.docRg?.[0]?.name || 'Não anexado'}
- Ofício (PJ): ${data.docOficio?.[0]?.name || 'Não anexado'}
- Autorização (Alugado): ${data.docAutorizacao?.[0]?.name || 'Não anexado'}
    `.trim();

    const result = await addRequestAction({
      requestType: "requerimento_corte_poda",
      description,
      address: data.propertyAddress,
      contactPhone: data.propertyOwnerPhone,
      citizenId: currentUser.uid,
      citizenName: currentUser.displayName || data.propertyOwnerName,
    });

    if (result.success) {
      toast({
        title: "Solicitação Enviada!",
        description: `Seu requerimento (Protocolo: ${result.protocol}) foi registrado e será analisado pela equipe técnica.`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="requestReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo da Solicitação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Selecione se deseja poda ou corte" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="poda">Poda de Árvore</SelectItem>
                  <SelectItem value="corte">Corte/Remoção de Árvore</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid sm:grid-cols-2 gap-6">
            <FormField control={form.control} name="propertyOwnerName" render={({ field }) => (
                <FormItem><FormLabel>Nome do Proprietário do Imóvel</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="propertyOwnerPhone" render={({ field }) => (
                <FormItem><FormLabel>Telefone de Contato</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
        </div>

        <FormField control={form.control} name="propertyAddress" render={({ field }) => (
            <FormItem><FormLabel>Endereço do Imóvel</FormLabel><FormControl><Input placeholder="Rua, número, bairro..." {...field} /></FormControl><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="treeLocation" render={({ field }) => (
            <FormItem><FormLabel>Localização da Árvore</FormLabel><FormControl><Input placeholder="Ex: Calçada, quintal, praça em frente..." {...field} /></FormControl><FormDescription>Seja específico sobre onde a árvore está localizada.</FormDescription><FormMessage /></FormItem>
        )}/>

        <FormField control={form.control} name="justification" render={({ field }) => (
            <FormItem><FormLabel>Justificativa do Pedido</FormLabel><FormControl><Textarea className="min-h-[100px]" placeholder="Descreva o motivo da solicitação: risco de queda, galhos secos, doença aparente, conflito com construção, etc." {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Documentos Necessários</h3>
          <p className="text-sm text-muted-foreground mb-6">Por favor, anexe os documentos digitalizados. A funcionalidade de upload está em desenvolvimento; por enquanto, isso serve como um checklist.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fileFields.map(({ name, label, description }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
            Enviar Requerimento
          </Button>
        </div>
      </form>
    </Form>
  );
}
