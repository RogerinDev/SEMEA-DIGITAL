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
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { setAdminRoleAction } from "@/app/actions/admin-actions";
import { type Department, type UserRole } from "@/types";

const formSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  department: z.custom<Department>(val => typeof val === 'string' && val.length > 0, "Selecione um departamento."),
  role: z.custom<UserRole>(val => val === 'admin' || val === 'superAdmin', "Selecione um papel válido."),
});

const departments: { value: Department; label: string }[] = [
    { value: "arborizacao", label: "Arborização" },
    { value: "residuos", label: "Resíduos" },
    { value: "bem_estar_animal", label: "Bem-Estar Animal" },
    { value: "educacao_ambiental", label: "Educação Ambiental" },
    { value: "gabinete", label: "Gabinete (Super Admin)" },
];

export default function ManageUsersPage() {
    const { currentUser } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            role: "admin",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const result = await setAdminRoleAction(values);
            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: result.message,
                });
                form.reset();
            } else {
                toast({
                    title: "Erro",
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

    if (currentUser?.role !== 'superAdmin') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Acesso Negado</h1>
                <p className="text-muted-foreground">Apenas Super Administradores podem acessar esta página.</p>
            </div>
        );
    }
    
    return (
        <>
            <PageTitle title="Gerenciar Usuários" icon={Users} description="Promova usuários a administradores de setores específicos."/>
            
            <Card>
                <CardHeader>
                    <CardTitle>Promover Usuário</CardTitle>
                    <CardDescription>
                        Insira o e-mail do usuário e atribua um papel e um departamento. O usuário deve ter uma conta existente.
                        Esta ação chamará uma Cloud Function para definir as permissões (Custom Claims) no Firebase.
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
                                        <FormLabel>E-mail do Usuário</FormLabel>
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
                                                    <SelectValue placeholder="Selecione o departamento de atuação" />
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
                                                    <SelectValue placeholder="Selecione o papel do usuário" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin de Setor</SelectItem>
                                                <SelectItem value="superAdmin">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <ShieldCheck className="mr-2"/>}
                                Promover Usuário
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}