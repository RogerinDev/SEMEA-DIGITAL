
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Added
import React, { useState } from 'react'; // Added
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PublicHeader } from '@/components/navigation/public-header';
import { Footer } from '@/components/navigation/footer';
import { LogIn, Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/contexts/auth-context'; // Added
import { useToast } from '@/hooks/use-toast'; // Added

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading: authLoading } = useAuth(); // Use loading from context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password);
    if (typeof result !== 'string') { // Assuming UserCredential object on success
      // Redirect based on role or default (e.g. citizen dashboard)
      // For now, just redirect to a generic citizen dashboard
      // A more robust solution would check user roles (custom claims)
      // and redirect accordingly. This is a placeholder.
      const userEmail = result.user.email;
      if (userEmail && userEmail.includes('admin')) { // Simple check for demo
         router.push('/dashboard/admin');
      } else {
         router.push('/dashboard/citizen');
      }
    } else {
      // Error is handled by toast in AuthContext, but you can add specific logic here if needed
    }
    setIsSubmitting(false);
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
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
              <Button variant="link" onClick={() => router.push('/dashboard/admin')} className="text-primary" disabled={isLoading}>
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
