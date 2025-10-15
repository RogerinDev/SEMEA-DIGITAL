"use client";

import React from 'react';
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, AlertTriangle } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";

export default function ManageUsersPage() {
    const { currentUser } = useAuth();

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
                    <CardTitle>Gerenciamento de Usuários</CardTitle>
                    <CardDescription>
                       Esta seção está temporariamente desativada para manutenção.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A funcionalidade de gerenciamento de usuários será restaurada em breve.</p>
                </CardContent>
            </Card>
        </>
    );
}
