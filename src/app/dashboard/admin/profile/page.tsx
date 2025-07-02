
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  displayName: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
});

export default function EditAdminProfilePage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [isConfirming, setIsConfirming] = useState(false);
  const [passwordToConfirm, setPasswordToConfirm] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
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
          if (!currentUser) throw new Error("Usuário não autenticado.");
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(currentUser, { photoURL: downloadURL });
          await currentUser.reload();
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
  
  const handleSaveChangesClick = async () => {
    const { displayName } = form.getValues();
    if (displayName === currentUser?.displayName) {
      toast({ title: "Nenhuma Alteração", description: "Você não alterou seu nome." });
      return;
    }

    const isValid = await form.trigger("displayName");
    if (isValid) {
      setIsConfirming(true);
    }
  };

  async function handleConfirmAndUpdate() {
    if (!currentUser || !currentUser.email || !passwordToConfirm) return;

    const { displayName } = form.getValues();
    setIsSubmitting(true);
    
    try {
        const credential = EmailAuthProvider.credential(currentUser.email, passwordToConfirm);
        await reauthenticateWithCredential(currentUser, credential);
        
        await updateProfile(currentUser, { displayName });
        await currentUser.reload();

        toast({ title: "Sucesso!", description: "Seu nome foi atualizado." });
        setPasswordToConfirm("");
        setIsConfirming(false);

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
          <Link href="/dashboard/admin">
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
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
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
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/admin">Cancelar</Link>
                </Button>
                <Button type="button" onClick={handleSaveChangesClick} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirme sua identidade</AlertDialogTitle>
            <AlertDialogDescription>
              Para salvar as alterações, por favor, insira sua senha atual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label htmlFor="password-confirm" className="sr-only">Senha Atual</Label>
            <Input
                id="password-confirm"
                type="password"
                placeholder="Sua senha atual"
                value={passwordToConfirm}
                onChange={(e) => setPasswordToConfirm(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPasswordToConfirm('')} disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAndUpdate} disabled={isSubmitting || !passwordToConfirm}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirmar e Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
