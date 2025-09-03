
"use client";

import { PageTitle } from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { PawPrint, PlusCircle, Loader2, Upload, X, Dog, Cat } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import type { AnimalForAdoption, AdoptionStatus, AnimalSpecies } from '@/types';
import { getAnimalsForAdoptionAction, addAnimalForAdoptionAction } from '@/app/actions/adoption-actions';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const animalFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres."),
  species: z.enum(["cao", "gato", "outro"], { required_error: "Selecione a espécie."}),
  breed: z.string().min(2, "Raça é obrigatória (pode ser 'SRD')."),
  age: z.string().min(1, "Idade é obrigatória."),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres."),
  status: z.enum(["disponivel", "processo_adocao_em_andamento", "adotado"], { required_error: "Selecione um status."}),
  photoFile: z.instanceof(File).optional().refine(file => !file || file.size <= 2 * 1024 * 1024, 'A imagem deve ter no máximo 2MB.'),
});

function AddAnimalDialog({ onAnimalAdded }: { onAnimalAdded: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof animalFormSchema>>({
        resolver: zodResolver(animalFormSchema),
        defaultValues: {
            name: "",
            species: undefined,
            breed: "",
            age: "",
            description: "",
            status: "disponivel",
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast({ title: "Imagem muito grande", description: "Por favor, selecione uma imagem com até 2MB.", variant: "destructive" });
                return;
            }
            form.setValue('photoFile', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
        form.setValue('photoFile', undefined);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    async function onSubmit(values: z.infer<typeof animalFormSchema>) {
        if (!currentUser) {
            toast({ title: "Erro de Autenticação", description: "Sessão expirada. Faça login novamente.", variant: "destructive"});
            return;
        }
        setIsSubmitting(true);
        let photoUrl = '';

        try {
            if (values.photoFile) {
                toast({ title: "Enviando Imagem...", description: "Aguarde enquanto a foto do pet é enviada." });
                const storageRef = ref(storage, `adoption_images/${currentUser.uid}-${Date.now()}-${values.photoFile.name}`);
                const uploadResult = await uploadBytes(storageRef, values.photoFile);
                photoUrl = await getDownloadURL(uploadResult.ref);
                toast({ title: "Imagem Enviada!", description: "A foto foi enviada com sucesso." });
            }

            const result = await addAnimalForAdoptionAction({
                name: values.name,
                species: values.species as AnimalSpecies,
                breed: values.breed,
                age: values.age,
                description: values.description,
                status: values.status as AdoptionStatus,
                photoUrl,
            });

            if (result.success) {
                toast({ title: "Sucesso!", description: `O animal ${values.name} foi cadastrado.` });
                form.reset();
                removeImage();
                onAnimalAdded();
                setIsOpen(false);
            } else {
                toast({ title: "Erro", description: result.error || "Não foi possível cadastrar o animal.", variant: "destructive"});
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast({ title: "Erro no Upload", description: "Não foi possível enviar a imagem. Tente novamente.", variant: "destructive"});
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Cadastrar Novo Animal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar Animal para Adoção</DialogTitle>
                    <DialogDescription>Preencha os dados do animal. Clique em salvar quando terminar.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField name="photoFile" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Foto do Animal</FormLabel>
                                <FormControl>
                                    <div className={cn("w-full border-2 border-dashed rounded-lg p-4 text-center", previewImage && 'border-solid')}>
                                        {previewImage ? (
                                            <div className="relative group w-32 h-32 mx-auto">
                                                <Image src={previewImage} alt="Pré-visualização" layout="fill" objectFit="cover" className="rounded-md"/>
                                                <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={removeImage}>
                                                    <X className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center space-y-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                <Upload className="h-8 w-8 text-muted-foreground"/>
                                                <p className="text-sm text-muted-foreground">Clique para enviar uma foto (Max 2MB)</p>
                                            </div>
                                        )}
                                        <Input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="name" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage/></FormItem>
                            )}/>
                            <FormField name="age" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Idade</FormLabel><FormControl><Input placeholder="Ex: 2 anos" {...field} /></FormControl><FormMessage/></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField name="species" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Espécie</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="cao">Cachorro</SelectItem>
                                            <SelectItem value="gato">Gato</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select><FormMessage/>
                                </FormItem>
                            )}/>
                             <FormField name="breed" control={form.control} render={({ field }) => (
                                <FormItem><FormLabel>Raça</FormLabel><FormControl><Input placeholder="Ex: SRD" {...field} /></FormControl><FormMessage/></FormItem>
                            )}/>
                        </div>
                        <FormField name="description" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea placeholder="Descreva o temperamento, história, etc." {...field} /></FormControl><FormMessage/></FormItem>
                        )}/>
                        <FormField name="status" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="disponivel">Disponível</SelectItem>
                                        <SelectItem value="processo_adocao_em_andamento">Em Processo de Adoção</SelectItem>
                                        <SelectItem value="adotado">Adotado</SelectItem>
                                    </SelectContent>
                                </Select><FormMessage/>
                            </FormItem>
                        )}/>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Salvar Animal
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

const getStatusBadgeVariant = (status: AdoptionStatus) => {
    switch(status) {
        case 'disponivel': return 'secondary';
        case 'processo_adocao_em_andamento': return 'outline';
        case 'adotado': return 'default';
        default: return 'outline';
    }
}

export default function AdminAdoptionPage() {
    const [animals, setAnimals] = useState<AnimalForAdoption[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchAnimals = async () => {
        setLoading(true);
        const fetchedAnimals = await getAnimalsForAdoptionAction();
        setAnimals(fetchedAnimals);
        setLoading(false);
    }

    useEffect(() => {
        fetchAnimals();
    }, [refreshKey]);

    const handleAnimalAdded = () => {
        setRefreshKey(prev => prev + 1);
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <PageTitle title="Gerenciar Animais para Adoção" icon={PawPrint} />
                <AddAnimalDialog onAnimalAdded={handleAnimalAdded} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Animais Cadastrados</CardTitle>
                    <CardDescription>Gerencie os animais disponíveis para adoção no portal.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Foto</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Espécie</TableHead>
                                    <TableHead>Idade</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Adicionado em</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {animals.length > 0 ? animals.map(animal => (
                                    <TableRow key={animal.id}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={animal.photoUrl} alt={animal.name}/>
                                                <AvatarFallback>
                                                    {animal.species === 'cao' ? <Dog /> : <Cat />}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-medium">{animal.name}</TableCell>
                                        <TableCell>{animal.species}</TableCell>
                                        <TableCell>{animal.age}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(animal.status)} className="capitalize">
                                                {animal.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(animal.dateAdded).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">
                                            Nenhum animal cadastrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
