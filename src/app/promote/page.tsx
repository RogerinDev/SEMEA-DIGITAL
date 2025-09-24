"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useState } from 'react';

import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { setAdminRoleAction } from "@/app/actions/admin-actions";
import { type Department, type UserRole } from "@/types";

const formSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  department: z.custom<Department>(val => typeof val === 'string' && val.length > 0, "Selecione um departamento."),
  role: z.custom<UserRole>(val => ['admin', 'superAdmin', 'Dev'].includes(val), "Selecione um papel válido."),
});

const departments: { value: Department; label: string }[] = [
    { value: "arborizacao", label: "Arborização" },
    { value: "residuos", label: "Resíduos" },
    { value: "bem_estar_animal", label: "Bem-Estar Animal" },
    { value: "educacao_ambiental", label: "Educação Ambiental" },
    { value: "gabinete", label: "Gabinete (Super Admin/Dev)" },
];

export default function PromotePage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: "superAdmin",
            department: "gabinete",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Esta é uma chamada "insegura" para contornar o problema de permissão.
            // A Cloud Function ainda terá sua própria segurança, mas esta página não verifica o autor da chamada.
            const result = await setAdminRoleAction(values);
            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: `O usuário ${values.email} foi promovido. Faça logout e login novamente para aplicar as permissões.`,
                });
                form.reset();
            } else {
                toast({
                    title: "Erro na Promoção",
                    description: result.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erro Inesperado",
                description: "Ocorreu um erro ao processar a solicitação.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <div className="container mx-auto py-12">
            <PageTitle title="Página de Promoção de Emergência" icon={AlertTriangle} description="Use esta página apenas para restaurar permissões de Super Admin ou Dev."/>
            
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>Promover Usuário (Bypass de Permissão do Cliente)</CardTitle>
                    <CardDescription>
                        Esta ação chama a Cloud Function `setAdminRole`. O usuário que está LOGADO no navegador no momento em que você clica no botão DEVE ter a permissão de `superAdmin` ou `Dev` no Firebase Auth para que a função seja executada com sucesso.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail do Usuário a ser Promovido</FormLabel>
                                        <FormControl>
                                            <Input placeholder="usuario@exemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Departamento</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o departamento" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {departments.map(dep => (
                                                    <SelectItem key={dep.value} value={dep.value}>{dep.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Papel (Role)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o papel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin de Setor</SelectItem>
                                                <SelectItem value="superAdmin">Super Admin</SelectItem>
                                                <SelectItem value="Dev">Dev</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <ShieldCheck className="mr-2"/>}
                                Forçar Promoção
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
