
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Building2, Clock, Users, Mail, Phone, PawPrint, HeartHandshake, Stethoscope, UserCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const teamMembers = [
    { role: "Supervisora de Serviço de Bem Estar Animal", name: "Gabriela Pelegrini Batista", phone: "(35) 3690-2019 / (35) 3690-2276", email: "bemestaranimal@varginha.mg.gov.br" },
    { role: "Veterinário", name: "José Eduardo Mambeli Balieiro" },
    { role: "Assessor de Apoio Estratégico", name: "Rafaela Belo Aguiar" },
    { role: "Assessor de apoio e defesa de bem-estar animal", name: "Maria Tereza Dalia Foresti" },
    { role: "Encarregado da Seção de Controle e Cuidado aos Animais", name: "Gisleni Pereira dos Santos" },
    { role: "Oficial Administrativo", name: "Nabih Alves" },
    { role: "Oficial Administrativo", name: "Jaqueline Rosa" },
];

export default function AnimalWelfareInfoPage() {
  return (
    <>
      <PageTitle
        title="Bem-Estar Animal em Varginha"
        icon={PawPrint}
        description="Informações sobre o setor de Bem-Estar Animal da SEMEA, serviços oferecidos e como entrar em contato."
      />

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Building2 className="mr-2 h-5 w-5 text-primary" />Endereço e Funcionamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground"><strong>Endereço:</strong> Rua Sebastião Guimarães Caldas, s/n, Sagrado Coração II</p>
            <Separator />
            <p className="text-muted-foreground"><strong>Funcionamento do Setor:</strong></p>
            <p className="ml-4 text-muted-foreground">Segunda a Sexta: Das 07h30 às 11h30 e de 13h30 a 17h30.</p>
            <Separator />
            <p className="text-muted-foreground"><strong>Atendimento ao Público:</strong></p>
            <p className="ml-4 text-muted-foreground">Segunda a Sexta: Das 08h às 11h e de 13h30 às 16h.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><HeartHandshake className="mr-2 h-5 w-5 text-primary" />Serviços Oferecidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              O setor de Bem-Estar Animal da SEMEA oferece diversos serviços para a comunidade, visando a saúde e proteção dos animais em Varginha.
            </p>
            <div className="p-4 bg-secondary/20 rounded-md">
                <h4 className="font-semibold text-primary flex items-center mb-1"><Stethoscope className="mr-2 h-5 w-5"/>Serviços Veterinários e Castração</h4>
                <p className="text-sm text-foreground">
                Todos os cidadãos de Varginha têm direito a solicitar serviços de castração e atendimento veterinário básico para seus animais, conforme disponibilidade e critérios do programa municipal.
                </p>
                 <Button asChild size="sm" className="mt-3">
                    <Link href="/dashboard/citizen/requests/new?type=castracao_animal">
                        Solicitar Castração
                    </Link>
                </Button>
            </div>
            <p className="text-muted-foreground">
                Para mais informações sobre outros serviços veterinários ou agendamentos, entre em contato diretamente com o setor.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button variant="outline" asChild className="flex-1">
                    <Link href="/animal-welfare/adoption">Adoção Responsável</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                    <Link href="/animal-welfare/lost-found">Perdidos e Achados</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" />Nossa Equipe</CardTitle>
          <CardDescription>Conheça os responsáveis pelo setor de Bem-Estar Animal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-muted/40">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <UserCircle className="h-7 w-7 text-primary" />
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                    </div>
                  <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                </CardHeader>
                {(member.phone || member.email) && (
                <CardContent className="text-sm space-y-1">
                    {member.phone && (
                        <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{member.phone}</span>
                        </div>
                    )}
                    {member.email && (
                        <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary hover:underline truncate">
                                {member.email}
                            </a>
                        </div>
                    )}
                </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
