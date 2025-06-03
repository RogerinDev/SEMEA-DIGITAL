"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PublicHeader } from '@/components/navigation/public-header';
import { Footer } from '@/components/navigation/footer';
import { LogIn } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Login form submitted');
    // For now, redirect to citizen dashboard
    window.location.href = '/dashboard/citizen';
  };

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
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="#" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Registre-se
              </Link>
            </div>
             <div className="mt-4 text-center text-sm">
              <Button variant="link" onClick={() => window.location.href = '/dashboard/admin'} className="text-primary">
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
