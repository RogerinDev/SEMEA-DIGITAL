"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getFunctions, httpsCallable } from "firebase/functions";

import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Department, UserRole } from '@/types';
import { app } from '@/lib/firebase/client';
import { FIREBASE_REGION } from '@/config/firebase';

const departments: { value: Department, label: string }[] = [
    { value: 'arborizacao', label: 'Arborização Urbana' },
    { value: 'bem_estar_animal', label: 'Bem-Estar Animal' },
    { value: 'educacao_ambiental', label: 'Educação Ambiental' },
    { value: 'residuos', label: 'Gestão de Resíduos' },
    { value: 'gabinete', label: 'Gabinete' },
];

const roles: { value: UserRole, label: string }[] = [
    { value: 'admin', label: 'Admin de Setor' },
    { value: 'citizen', label: 'Cidadão (remover permissão)' },
    { value: 'superAdmin', label: 'Super Administrador' },
];

const promoteUserSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  role: z.custom<UserRole>(val => roles.some(r => r.value === val), "Selecione um papel válido."),
  department: z.custom<Department>(val => departments.some(d => d.value === val), "Selecione um departamento válido."),
});

// Referência à Cloud Function Callable
const functions = getFunctions(app, FIREBASE_REGION);
const setAdminRoleCallable = httpsCallable<{ email: string; department: Department; role: UserRole }, { message: string }>(functions, 'setAdminRole');

export default function ManageUsersPage() {
    const { currentUser } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof promoteUserSchema>>({
        resolver: zodResolver(promoteUserSchema),
        defaultValues: {
            email: "",
            role: "admin",
            department: "gabinete",
        },
    });

    async function onSubmit(values: z.infer<typeof promoteUserSchema>) {
        setIsSubmitting(true);
        try {
            const result = await setAdminRoleCallable(values);
            toast({
                title: "Sucesso!",
                description: result.data.message || "A permissão do usuário foi alterada com sucesso.",
            });
            form.reset();
        } catch (error: any) {
            console.error("Erro ao chamar a função setAdminRole:", error);
            toast({
                title: "Erro ao alterar permissão",
                description: error.message || "Não foi possível completar a operação. Verifique os logs.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (currentUser?.role !== 'superAdmin') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Acesso Negado</h1>
                <p className="text-muted-foreground max-w-md">Apenas Super Administradores podem acessar esta página para gerenciar as permissões de outros usuários.</p>
            </div>
        );
    }
    
    return (
        <>
            <PageTitle title="Gerenciar Usuários" icon={Users} description="Promova usuários a administradores de setores específicos ou reverta suas permissões."/>
            
            <Card>
                <CardHeader>
                    <CardTitle>Promover ou Rebaixar Usuário</CardTitle>
                    <CardDescription>
                       Insira o e-mail do usuário e defina seu novo papel e departamento. A alteração tem efeito imediato após o próximo login do usuário.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail do Usuário</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email.do.usuario@exemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Novo Papel</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione um papel..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {roles.map(role => (
                                                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione um departamento..." />
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
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar Alterações
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}
