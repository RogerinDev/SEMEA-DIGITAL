
import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building, Users, UserCircle, Mail, Phone, MapPin, Clock, InstagramIcon } from 'lucide-react';
import Link from 'next/link';

export default function SobreSemeadPage() {
  const atribuicoes = [
    "Planejamento, Gestão e Fiscalização Ambiental.",
    "Gerenciamento dos Resíduos Sólidos Urbanos.",
    "Gerenciamento dos Parques Municipais.",
    "Gerenciamento da Arborização Urbana.",
    "Serviços de Educação Ambiental.",
    "Serviços de Bem-Estar Animal."
  ];

  const equipeAdministrativa = [
    { nome: "Clarice Freitas", cargo: "Assessora de Gabinete", telefone: "(35) 3690-2029", email: "clarice.freitas@varginha.mg.gov.br" },
    { nome: "Ana Caroline Tavares", cargo: "Oficial Administrativo", telefone: "(35) 3690-2029", email: "ana.tavares@varginha.mg.gov.br" },
    { nome: "Rosimeire de Paula C. Ferreira", cargo: "Oficial Administrativo", email: "semea@varginha.mg.gov.br" },
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle title="Sobre a SEMEA - Secretaria Municipal de Meio Ambiente" icon={Building} />

        <Card className="mb-8 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-lg text-muted-foreground">
              A Secretaria Municipal de Meio Ambiente (SEMEA) é o órgão da Prefeitura de Varginha responsável pela Gestão Ambiental no município. Nosso compromisso é com a proteção do meio ambiente, a promoção do desenvolvimento sustentável e a garantia da qualidade de vida para todos os cidadãos.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Nossas Principais Atribuições</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {atribuicoes.map((atribuicao, index) => (
                  <li key={index}>{atribuicao}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Secretário Municipal de Meio Ambiente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center">
                <UserCircle className="h-6 w-6 mr-2 text-primary" />
                <p className="font-semibold">Cláudio Abreu</p>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:claudio.abreu@varginha.mg.gov.br" className="hover:underline">claudio.abreu@varginha.mg.gov.br</a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary" />Horário de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Segunda a sexta-feira</p>
            <p className="text-muted-foreground">Das 07:30 às 11:30 e das 13:00 às 17:00</p>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Entre em Contato Conosco</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-primary" />
              <span className="text-muted-foreground">(35) 3690-2311</span>
            </div>
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path><path d="M14.05 2a9 9 0 0 1 8 7.94"></path><path d="M14.05 6A5 5 0 0 1 18 10"></path></svg> {/* WhatsApp Icon (using generic phone and paths for now) */}
              <span className="text-muted-foreground">(35) 99192-0462 (WhatsApp)</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary" />
              <a href="mailto:recepcao.semea@varginha.mg.gov.br" className="text-muted-foreground hover:underline">recepcao.semea@varginha.mg.gov.br</a>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 text-primary mt-1" />
              <span className="text-muted-foreground">Rua Jaime Venturato, 50, São Geraldo, Varginha/MG. CEP: 37030-400</span>
            </div>
            <div className="flex items-center">
              <InstagramIcon className="h-5 w-5 mr-2 text-primary" />
              <Link href="https://instagram.com/semea.varginha" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline">
                @semea.varginha
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/>Equipe Administrativa Principal</CardTitle>
          </CardHeader>
          <CardContent>
            {equipeAdministrativa.map((membro, index) => (
              <React.Fragment key={index}>
                <div className="py-3">
                  <p className="font-semibold">{membro.nome}</p>
                  <p className="text-sm text-muted-foreground">{membro.cargo}</p>
                  {membro.telefone && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Phone className="h-4 w-4 mr-1.5" /> {membro.telefone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Mail className="h-4 w-4 mr-1.5" /> <a href={`mailto:${membro.email}`} className="hover:underline">{membro.email}</a>
                  </div>
                </div>
                {index < equipeAdministrativa.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

      </div>
    </PublicLayout>
  );
}

    