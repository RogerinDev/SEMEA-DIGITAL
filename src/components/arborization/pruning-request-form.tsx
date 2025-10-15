
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { addRequestAction } from "@/app/actions/requests-actions";
import { Loader2, Send } from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  serviceType: z.enum(["requerimento_corte_poda"]),
  fullName: z.string().min(3, "Nome completo é obrigatório."),
  cpf: z.string().length(14, "CPF inválido. Use o formato 000.000.000-00."),
  address: z.string().min(5, "Endereço da ocorrência é obrigatório."),
  contactPhone: z.string().min(10, "Telefone inválido."),
  treeLocation: z.enum(["calcada", "area_interna"], { required_error: "Selecione o local da árvore."}),
  reason: z.string().min(10, "A justificativa deve ter no mínimo 10 caracteres."),
  fileAuthorization: z.string().optional(), // Em um cenário real, seria um upload
});

export default function PruningRequestForm() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "requerimento_corte_poda",
      fullName: "",
      cpf: "",
      address: "",
      contactPhone: "",
      reason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser) {
        toast({ title: "Login Necessário", description: "Você deve estar logado para fazer uma solicitação."});
        router.push('/login');
        return;
    }

    setIsSubmitting(true);

    const description = `
Requerimento de Poda/Corte de Árvore
Nome: ${values.fullName}
CPF: ${values.cpf}
Endereço da Ocorrência: ${values.address}
Local da Árvore: ${values.treeLocation === 'calcada' ? 'Calçada/Área Pública' : 'Área Interna do Imóvel'}
Justificativa: ${values.reason}
    `.trim();

    const result = await addRequestAction({
        requestType: 'requerimento_corte_poda',
        description,
        address: values.address,
        contactPhone: values.contactPhone,
        citizenId: currentUser.uid,
        citizenName: values.fullName,
    });

     if (result.success) {
      toast({
        title: "Solicitação Enviada!",
        description: `Seu requerimento (Protocolo: ${result.protocol}) foi registrado com sucesso.`,
      });
      form.reset();
      router.push('/dashboard/citizen/requests');
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-4 shadow-sm">
        <div className="grid sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nome Completo do Solicitante</FormLabel>
                <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
                <FormItem>
                <FormLabel>CPF do Solicitante</FormLabel>
                <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço da Ocorrência</FormLabel>
              <FormControl>
                <Input placeholder="Rua, número, bairro onde a árvore está" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Telefone para Contato</FormLabel>
                <FormControl>
                    <Input type="tel" placeholder="(35) 9XXXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="treeLocation"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Localização da Árvore</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o local" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="calcada">Calçada (área pública)</SelectItem>
                        <SelectItem value="area_interna">Área interna do imóvel (particular)</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justificativa para a Solicitação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o motivo da solicitação. Ex: Risco de queda, galhos na fiação, danos à calçada, doença aparente..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Seja o mais detalhado possível.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Placeholder para upload de arquivo no futuro */}
        <FormItem>
            <FormLabel>Anexar Autorização (se aplicável)</FormLabel>
            <FormControl>
                <Input type="file" disabled />
            </FormControl>
            <FormDescription>
                Para árvores em área particular, pode ser necessária autorização. Funcionalidade de upload em breve.
            </FormDescription>
        </FormItem>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
             {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
             Enviar Requerimento
          </Button>
        </div>
      </form>
    </Form>
  );
}

