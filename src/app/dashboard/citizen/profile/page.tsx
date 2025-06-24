
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const formSchema = z.object({
  displayName: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  currentPassword: z.string().min(1, "Sua senha atual é obrigatória para salvar."),
});

export default function EditProfilePage() {
  const { currentUser, updateUserProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      currentPassword: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.setValue("displayName", currentUser.displayName || "");
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    if (!file.type.startsWith("image/")) {
        toast({ title: "Arquivo Inválido", description: "Por favor, selecione um arquivo de imagem.", variant: "destructive" });
        return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `profile_pictures/${currentUser.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error", error);
        toast({ title: "Erro no Upload", description: "Não foi possível enviar sua foto. Tente novamente.", variant: "destructive" });
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(currentUser, { photoURL: downloadURL });
          await updateUserProfile(currentUser.displayName || '', downloadURL); // Update context
          setPhotoURL(downloadURL);
          toast({ title: "Sucesso!", description: "Sua foto de perfil foi atualizada." });
        } catch (error) {
          console.error("Profile update error", error);
          toast({ title: "Erro", description: "Não foi possível atualizar sua foto de perfil.", variant: "destructive" });
        } finally {
          setIsUploading(false);
        }
      }
    );
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentUser || !currentUser.email) return;

    const nameHasChanged = values.displayName !== currentUser.displayName;

    if (!nameHasChanged) {
        toast({ title: "Nenhuma Alteração", description: "Você não alterou seu nome."});
        return;
    }

    setIsSubmitting(true);
    
    try {
        const credential = EmailAuthProvider.credential(currentUser.email, values.currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        
        // Re-auth successful, now update profile
        await updateProfile(currentUser, { displayName: values.displayName });
        await updateUserProfile(values.displayName, currentUser.photoURL);

        toast({ title: "Sucesso!", description: "Seu nome foi atualizado." });
        form.reset({ displayName: values.displayName, currentPassword: "" });

    } catch (error: any) {
        console.error("Error updating profile:", error);
        if (error.code === 'auth/wrong-password') {
            toast({ title: "Senha Incorreta", description: "A senha atual que você digitou está incorreta.", variant: "destructive"});
        } else {
            toast({ title: "Erro ao Atualizar", description: "Não foi possível salvar as alterações. Tente novamente.", variant: "destructive" });
        }
    } finally {
        setIsSubmitting(false);
    }
  }

  const isLoading = authLoading || isSubmitting;

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/citizen">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <PageTitle title="Meu Perfil" icon={User} className="mb-0 flex-grow" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Informações</CardTitle>
          <CardDescription>Atualize suas informações pessoais. Para salvar, confirme sua senha.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-8 gap-4">
              <Avatar className="w-32 h-32 border-4 border-muted">
                <AvatarImage src={photoURL} alt={currentUser?.displayName || 'Usuário'} />
                <AvatarFallback className="text-4xl">{currentUser?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Trocar Foto
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
              />
              {isUploading && (
                <div className="w-full max-w-xs text-center">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">Enviando... {Math.round(uploadProgress)}%</p>
                </div>
              )}
          </div>
          <Separator className="my-6"/>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome de exibição" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input value={currentUser?.email || ''} disabled />
                <FormDescription>Seu e-mail de login não pode ser alterado.</FormDescription>
              </FormItem>

              <Separator className="my-6"/>
              
              <p className="text-sm text-muted-foreground">Para confirmar qualquer alteração, por favor, insira sua senha atual.</p>

              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isLoading} autoComplete="current-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/citizen">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
