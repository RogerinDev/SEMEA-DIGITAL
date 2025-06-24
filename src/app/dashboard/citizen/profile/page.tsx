
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from "@/contexts/auth-context";

const formSchema = z.object({
  displayName: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email(),
});

export default function EditProfilePage() {
  const { currentUser, updateUserProfile, loading } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.setValue("displayName", currentUser.displayName || "");
      form.setValue("email", currentUser.email || "");
    }
  }, [currentUser, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (currentUser?.displayName === values.displayName) {
        // No changes, just go back
        router.push('/dashboard/citizen');
        return;
    }
    const success = await updateUserProfile(values.displayName);
    if (success) {
      router.push('/dashboard/citizen');
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <PageTitle title="Editar Informações Pessoais" icon={User} className="mb-0 flex-grow" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seus Dados</CardTitle>
          <CardDescription>Atualize seu nome de exibição. Seu e-mail não pode ser alterado.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome de exibição" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/citizen">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
