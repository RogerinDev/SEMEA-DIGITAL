
"use client";

import { useState } from 'react';
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
import { Stethoscope, Clock, User, PawPrint, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    const { toast } = useToast();

    const form = useForm<z.infer<typeof appointmentFormSchema>>({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues: {
            tutorName: "",
            animalName: "",
            contactPhone: "",
        },
    });

    function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
        console.log(values);
        toast({
            title: "Agendamento Enviado!",
            description: `Sua consulta para ${values.animalName} no dia ${format(values.selectedDate, 'dd/MM/yyyy')} às ${values.selectedTime} foi pré-agendada. Aguarde a confirmação por parte da nossa equipe.`,
        });
        form.reset();
        setDate(undefined);
        setTime(undefined);
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
            <PageTitle title="Agendamento de Consulta Veterinária" icon={Stethoscope} description="Agende uma consulta básica para seu animal. Os horários são limitados e sujeitos a confirmação." />
            
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
                                <h3 className="text-lg font-medium text-center mb-4">Horários para {format(date, 'PPP', { locale: ptBR })}:</h3>
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
                        <CardTitle className="text-xl">2. Preencha seus Dados</CardTitle>
                        <CardDescription>Preencha os dados abaixo para concluir o pré-agendamento.</CardDescription>
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

                                <Button type="submit" className="w-full" disabled={!date || !time || form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Enviando..." : "Confirmar Pré-Agendamento"}
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
