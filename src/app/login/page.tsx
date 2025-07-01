"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PublicHeader } from '@/components/navigation/public-header';
import { Footer } from '@/components/navigation/footer';
import { LogIn, Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminDevLoggingIn, setIsAdminDevLoggingIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password);
    if (typeof result !== 'string') {
      // Redirect based on the role from custom claims
      if (result.role === 'admin' || result.role === 'superAdmin') {
         router.push('/dashboard/admin');
      } else {
         router.push('/dashboard/citizen');
      }
    }
    setIsSubmitting(false);
  };
  
  const handleAdminDevLogin = async () => {
    setIsAdminDevLoggingIn(true);
    // IMPORTANTE: Use credenciais de um usuário admin de teste REAL que exista no seu Firebase Auth.
    // Estas são apenas credenciais de EXEMPLO.
    const adminDevEmail = "admin.dev@semea.example.com";
    const adminDevPassword = "adminpassword"; // Lembre-se de criar esta conta!

    const result = await login(adminDevEmail, adminDevPassword);
    if (typeof result !== 'string') {
      router.push('/dashboard/admin');
    } else {
      // The generic toast is already shown by AuthContext for general errors.
      // Let's add a more specific one for this button's common failure case.
      if (result.includes('auth/invalid-credential')) {
        toast({
            title: "Conta de Admin Dev não encontrada",
            description: "Por favor, crie o usuário 'admin.dev@semea.example.com' no seu painel do Firebase Authentication.",
            variant: "destructive",
            duration: 9000,
        });
      }
    }
    setIsAdminDevLoggingIn(false);
  };

  const isLoading = authLoading || isSubmitting || isAdminDevLoggingIn;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo iconSize={32} textSize="text-2xl" />
            </div>
            <CardTitle className="text-2xl">Acesse sua Conta</CardTitle>
            <CardDescription>Bem-vindo de volta! Faça login para continuar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Entrar
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Registre-se
              </Link>
            </div>
             <div className="mt-4 text-center text-sm">
              <Button variant="link" onClick={handleAdminDevLogin} className="text-primary" disabled={isLoading || isAdminDevLoggingIn}>
                {isAdminDevLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Acesso Rápido Admin (Dev)
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
