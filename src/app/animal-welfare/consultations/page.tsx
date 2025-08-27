
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, Clock, User, PawPrint, Phone, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/auth-context';
import { addRequestAction } from '@/app/actions/requests-actions';
import { SERVICE_REQUEST_TYPES } from '@/types';

const appointmentFormSchema = z.object({
  tutorName: z.string().min(3, "Nome do tutor é obrigatório."),
  animalName: z.string().min(1, "Nome do animal é obrigatório."),
  contactPhone: z.string().min(10, "Telefone para contato é obrigatório."),
  selectedDate: z.date({ required_error: "Selecione uma data." }),
  selectedTime: z.string({ required_error: "Selecione um horário." }),
});

// Mock available times - em uma aplicação real, viria de um banco de dados.
const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export default function AppointmentPage() {
    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { currentUser } = useAuth();

    const form = useForm<z.infer<typeof appointmentFormSchema>>({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues: {
            tutorName: currentUser?.displayName || "",
            animalName: "",
            contactPhone: "",
        },
    });

    async function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
        if (!currentUser) {
            toast({ title: "Acesso Negado", description: "Você precisa estar logado para agendar uma consulta.", variant: "destructive" });
            router.push('/login');
            return;
        }
        setIsSubmitting(true);
        
        const description = `
Solicitação de pré-agendamento de consulta veterinária.
Tutor: ${values.tutorName}
Animal: ${values.animalName}
Data Desejada: ${format(values.selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
Horário Desejado: ${values.selectedTime}
Contato: ${values.contactPhone}
Aguardando confirmação do setor de Bem-Estar Animal.
        `.trim();

        const requestTypeInfo = SERVICE_REQUEST_TYPES.find(t => t.value === "agendamento_consulta_veterinaria");

        const result = await addRequestAction({
            requestType: "agendamento_consulta_veterinaria",
            description,
            contactPhone: values.contactPhone,
            citizenId: currentUser.uid,
            citizenName: values.tutorName,
        });

        if (result.success) {
            toast({
                title: "Solicitação Enviada!",
                description: `Sua solicitação de agendamento (Protocolo: ${result.protocol}) foi enviada. Aguarde a confirmação da nossa equipe.`,
            });
            router.push('/dashboard/citizen/requests');
        } else {
            toast({
                title: "Erro ao Enviar",
                description: result.error || "Não foi possível enviar a solicitação.",
                variant: "destructive",
            });
        }
        setIsSubmitting(false);
    }
    
    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        form.setValue('selectedDate', selectedDate!, { shouldValidate: true });
        setTime(undefined); // Reset time when date changes
        form.resetField('selectedTime');
    }

    const handleTimeSelect = (selectedTime: string) => {
        setTime(selectedTime);
        form.setValue('selectedTime', selectedTime, { shouldValidate: true });
    }

    return (
        <>
            <PageTitle title="Solicitar Agendamento de Consulta" icon={Stethoscope} description="Solicite um horário para consulta veterinária básica. As solicitações estão sujeitas à disponibilidade e confirmação." />
            
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">1. Selecione a Data e Hora</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="rounded-md border"
                            disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                            locale={ptBR}
                        />
                        {date && (
                             <div className="mt-6 w-full">
                                <h3 className="text-lg font-medium text-center mb-4">Horários Sugeridos para {format(date, 'PPP', { locale: ptBR })}:</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {availableTimes.map((availableTime) => (
                                        <Button
                                            key={availableTime}
                                            variant={time === availableTime ? 'secondary' : 'outline'}
                                            onClick={() => handleTimeSelect(availableTime)}
                                        >
                                            <Clock className="mr-2 h-4 w-4" />
                                            {availableTime}
                                        </Button>
                                    ))}
                                </div>
                             </div>
                        )}
                    </CardContent>
                </Card>

                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">2. Preencha os Dados</CardTitle>
                        <CardDescription>Preencha os dados abaixo para enviar sua solicitação de agendamento.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField name="tutorName" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4"/>Nome do Tutor</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                 <FormField name="animalName" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center"><PawPrint className="mr-2 h-4 w-4"/>Nome do Animal</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField name="contactPhone" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4"/>Telefone para Contato</FormLabel>
                                        <FormControl><Input type="tel" {...field} placeholder="(XX) XXXXX-XXXX" /></FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>

                                <Button type="submit" className="w-full" disabled={!date || !time || isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Enviar Solicitação de Agendamento"}
                                </Button>
                                {(!date || !time) && <p className="text-center text-sm text-destructive font-medium mt-2">Por favor, selecione uma data e um horário para continuar.</p>}
                            </form>
                        </Form>
                    </CardContent>
                 </Card>
            </div>
        </>
    );
}
