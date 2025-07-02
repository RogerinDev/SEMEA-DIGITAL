
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, resetPassword, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

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

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({ title: "Email obrigatório", description: "Por favor, insira um email para redefinir a senha.", variant: "destructive" });
      return;
    }
    setIsResetting(true);
    const success = await resetPassword(resetEmail);
    if (success) {
      setResetEmail('');
    }
    setIsResetting(false);
  };
  
  const isLoading = authLoading || isSubmitting;

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
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="link" type="button" className="text-sm p-0 h-auto">Esqueceu a senha?</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Redefinir Senha</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Insira seu e-mail abaixo. Se houver uma conta associada, enviaremos um link para você redefinir sua senha.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-2">
                              <Label htmlFor="reset-email" className="sr-only">Email</Label>
                              <Input 
                                id="reset-email" 
                                type="email" 
                                placeholder="seu@email.com" 
                                value={resetEmail} 
                                onChange={(e) => setResetEmail(e.target.value)}
                                disabled={isResetting}
                              />
                          </div>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handlePasswordReset} disabled={isResetting}>
                                  {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                  Enviar Link
                              </AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
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
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
