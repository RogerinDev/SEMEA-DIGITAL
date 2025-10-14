"use client";

import React, { useState } from 'react';
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { type Department, type UserRole } from "@/types";
import { setAdminRoleAction } from "@/app/actions/admin-actions";

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
    
    // Usando useState para gerenciar os campos do formulário
    const [email, setEmail] = useState("rogerinhootavio@hotmail.com");
    const [department, setDepartment] = useState<Department>("gabinete");
    const [role, setRole] = useState<UserRole>("superAdmin");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await setAdminRoleAction({ email, department, role });

            if (result.success) {
                toast({
                    title: "Sucesso!",
                    description: result.message || `O usuário ${email} foi promovido. Faça logout e login novamente para aplicar as permissões.`,
                });
            } else {
                 toast({
                    title: "Erro na Promoção",
                    description: result.error || "Ocorreu um erro ao processar a solicitação.",
                    variant: "destructive",
                });
            }

        } catch (error: any) {
            console.error("Erro ao chamar a server action 'setAdminRoleAction':", error);
            toast({
                title: "Erro Inesperado",
                description: error.message || "Ocorreu um erro ao processar a solicitação.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="container mx-auto py-12">
            <PageTitle title="Página de Promoção de Emergência" icon={AlertTriangle} description="Use esta página apenas para restaurar permissões de Super Admin ou Dev."/>
            
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>Promover Usuário (via Server Action)</CardTitle>
                    <CardDescription>
                       Esta página chama uma Server Action no backend, que contém a lógica de emergência para promover o usuário especificado.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail do Usuário a ser Promovido</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="usuario@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                             <Label htmlFor="department">Departamento</Label>
                             <Select value={department} onValueChange={(value) => setDepartment(value as Department)} required>
                                <SelectTrigger id="department">
                                    <SelectValue placeholder="Selecione o departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(dep => (
                                        <SelectItem key={dep.value} value={dep.value}>{dep.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                             <Label htmlFor="role">Papel (Role)</Label>
                            <Select value={role} onValueChange={(value) => setRole(value as UserRole)} required>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Selecione o papel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin de Setor</SelectItem>
                                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                                    <SelectItem value="Dev">Dev</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <ShieldCheck className="mr-2"/>}
                            Forçar Promoção
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
