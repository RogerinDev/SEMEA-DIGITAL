
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, User, UserCheck } from 'lucide-react';
import React from 'react';

const team = [
  { name: "Évelin Cristiane de Castro Silva", role: "Engenheira Florestal", email: "evelin.silva@varginha.mg.gov.br" },
  { name: "Joana Junqueira Carneiro", role: "Engenheira Florestal", email: "joana.carneiro@varginha.mg.gov.br" },
  { name: "Fernando César Costa", role: "Engenheiro Agrônomo", email: "" },
  { name: "Gevanildo Ferreira", role: "Encarregado de Corte e Poda", email: "" },
];

export default function ArborizationContactPage() {
  return (
    <>
      <PageTitle
        title="Fale com o Setor de Arborização"
        icon={Phone}
        description="Para esclarecimento de dúvidas, verificação de processos e orientações gerais, entre em contato com a equipe responsável."
      />

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Equipe Técnica</CardTitle>
            <CardDescription>Conheça os responsáveis pelo setor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {team.map((member, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  {member.role.includes("Encarregado") ? <UserCheck className="h-6 w-6 text-primary" /> : <User className="h-6 w-6 text-primary" />}
                </div>
                <div>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" /> {member.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Agendamento de Atendimento Presencial</CardTitle>
            <CardDescription>Para garantir o melhor atendimento, solicitamos que o contato presencial seja agendado previamente por telefone.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-2">Telefone para agendamento:</p>
            <p className="text-3xl font-bold text-primary">(35) 3606-9969</p>
            <Button asChild className="mt-6">
              <a href="tel:3536069969">
                <Phone className="mr-2 h-4 w-4"/>
                Ligar Agora
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
