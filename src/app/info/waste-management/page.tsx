
"use client";

import React, { useState, useMemo } from 'react';
import PublicLayout from '@/components/layouts/public-layout';
import { PageTitle } from '@/components/page-title';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Recycle, 
    Search, 
    MapPin, 
    Clock, 
    Trash2, 
    Building, 
    PhoneIcon, 
    Info,
    Lightbulb,
    MonitorSmartphone,
    Battery,
    Droplets,
    Pill,
    Hammer,
    CircleDot,
    Construction,
    Leaf,
    Sofa,
    Container,
    Unplug,
    Sparkles,
    GlassWater,
    Book,
    Footprints
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Ecoponto {
  MATERIAL: string;
  ECOPONTO: string;
  ENDEREÇO: string;
  TELEFONE: string;
  OBSERVAÇÃO?: string;
}

interface ColetaBairro {
  bairro: string;
  dias: string;
  periodo: string;
  horario: string;
  obs?: string;
}

const ecopontosData: Ecoponto[] = [
    {"MATERIAL": "Lixo Eletrônico", "ECOPONTO": "Ecobrasil", "TELEFONE": "9 8856-1145", "ENDEREÇO": "Av. Raul Salgado Filho, 130"},
    {"MATERIAL": "Lixo Eletrônico", "ECOPONTO": "Minasul", "TELEFONE": "3219-6900", "ENDEREÇO": "Av. Dinamarca, 01 - Industrial JK"},
    {"MATERIAL": "Lixo Eletrônico", "ECOPONTO": "Clube da Casa", "TELEFONE": "3690-1700", "ENDEREÇO": "Av. Princesa do Sul, 500"},
    {"MATERIAL": "Lixo Eletrônico", "ECOPONTO": "Loja Vivo", "TELEFONE": "9 9911-5265", "ENDEREÇO": "Av. Rio Branco, 280 - Centro"},
    {"MATERIAL": "Vidro", "ECOPONTO": "Raneri", "TELEFONE": "9 9759-6398", "ENDEREÇO": "R. Coronel José Franscisco Coelho, 1015 Indl. JK"},
    {"MATERIAL": "Vidro", "ECOPONTO": "Mineirão Atacarejo", "TELEFONE": "3223-9353", "ENDEREÇO": "Av. Celina Ottoni, 888 - N. Sa. das Graças"},
    {"MATERIAL": "Lâmpadas", "ECOPONTO": "Supermercado BH", "TELEFONE": "31 9 9925-3851", "ENDEREÇO": "Rua Gabriel Penha de Paiva, 477 - Vila Paiva"},
    {"MATERIAL": "Lâmpadas", "ECOPONTO": "Supermercados Rex", "TELEFONE": "3222-6811", "ENDEREÇO": "Rua Santos Dumont, 127 - Barcelona"},
    {"MATERIAL": "Óleo de Cozinha Usado", "ECOPONTO": "Róleo Reciclagem (Estacionamento Super. Maiolini)", "TELEFONE": "9 8835-3900 / 2105-1800", "ENDEREÇO": "Rua Rio de Janeiro, 684"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Sec. Municipal de Saúde e UBS", "TELEFONE": "3690-2203", "ENDEREÇO": "Todas as unidades"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "CAPS", "TELEFONE": "3690-2182", "ENDEREÇO": "Rua Aristides Paiva, 18 - Vila Paiva"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Farmácia de Minas", "TELEFONE": "3690-2102", "ENDEREÇO": "Av. Celina Ottoni, 3389 Padre Vitor"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Farmácia Drogasil Centro", "TELEFONE": "9 9861-6259", "ENDEREÇO": "Praça José de Rezende Paiva, 40"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Farmácia Drogasil Bom Pastor", "TELEFONE": "3067-5990", "ENDEREÇO": "Praça João Pessoa, 51"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Farmácia Drogasil Sion", "TELEFONE": "9 1018-9015", "ENDEREÇO": "Praça Dr. Marcos frota, 230"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Drogaria São Paulo Centro", "TELEFONE": "3221-4770", "ENDEREÇO": "Av. Rui Barbosa, 184"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Drogaria São Paulo Shopping", "TELEFONE": "3221-4770", "ENDEREÇO": "Rua Humberto Pizo, 999 - lojas 224/225"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Vitacorpus Centro", "TELEFONE": "3212-9980", "ENDEREÇO": "Rua Santa Cruz, 887"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Vitacorpus Vila Pinto", "TELEFONE": "3212-9980", "ENDEREÇO": "Rua. Dr. José de Rezende Pinto, 150 loja 101"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Vitacorpus Sion", "TELEFONE": "3212-9980", "ENDEREÇO": "Praça Dr. Marcos Frota, 22-loja 01/02"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Drogaria Araújo", "TELEFONE": "3221-5186", "ENDEREÇO": "Av. Rui Barbosa, 398"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Unidade Centro UNIMED Varginha", "TELEFONE": "3690-7000", "ENDEREÇO": "Praça Getulio Vargas, 123"},
    {"MATERIAL": "Medicamentos Vencidos e Blister", "ECOPONTO": "Farmácia de Minas", "TELEFONE": "3223-2900", "ENDEREÇO": "Av. Celina Ferreira Ottoni, 3389 - Padre Vitor"},
    {"MATERIAL": "Pneus", "ECOPONTO": "Barracão da Prefeitura", "TELEFONE": "3690-2311", "ENDEREÇO": "Rua Dr. Osvaldo de Resende, 70 - Parque Rinaldo"},
    {"MATERIAL": "Resíduos de Construção Civil", "ECOPONTO": "VGA CAÇAMBAS", "TELEFONE": "9 9972-5752", "ENDEREÇO": "R. Tenente Joaquim Pinto, 223 Bom Pastor", "OBSERVAÇÃO": "SERVIÇO PAGO"},
    {"MATERIAL": "Resíduos de Construção Civil", "ECOPONTO": "LIMA CAÇAMBAS", "TELEFONE": "9 9947-7063", "ENDEREÇO": "Rodovia Varginha - Três Pontas km 4", "OBSERVAÇÃO": "SERVIÇO PAGO"},
    {"MATERIAL": "Resíduos de Construção Civil", "ECOPONTO": "RODRIGO CAÇAMBAS", "TELEFONE": "9 9738-4479", "ENDEREÇO": "Av. Rubens Vicente de Lucas, 145 Alto dos Pinheiros", "OBSERVAÇÃO": "SERVIÇO PAGO"},
    {"MATERIAL": "Resíduos de Construção Civil", "ECOPONTO": "Limpavia", "TELEFONE": "3221-1838", "ENDEREÇO": "Estrada para fazenda Jacutinga, 3000", "OBSERVAÇÃO": "SERVIÇO PAGO"},
    {"MATERIAL": "Resíduos de Poda/Capim", "ECOPONTO": "LIMA CAÇAMBAS, RODRIGO CAÇAMBAS e Limpavia", "TELEFONE": "mesmos contatos acima", "ENDEREÇO": "mesmos endereços acima", "OBSERVAÇÃO": "SERVIÇO PAGO"},
    {"MATERIAL": "Móveis e Sofás", "ECOPONTO": "Limpavia", "TELEFONE": "3221-1838", "ENDEREÇO": "Estrada para fazenda Jacutinga, 3000", "OBSERVAÇÃO": "SERVIÇO PAGO"},
    {"MATERIAL": "Papel, Papelão e Plástico", "ECOPONTO": "Central de Reciclagem Minas Ltda.", "TELEFONE": "3222-1187", "ENDEREÇO": "Av. Rogassiano Francisco Coelho, 145 - Nova Varginha"},
    {"MATERIAL": "Papel, Papelão e Plástico", "ECOPONTO": "Éloi Reciclagem", "TELEFONE": "9 8886-1474", "ENDEREÇO": ""},
    {"MATERIAL": "Embalagens de Cosméticos", "ECOPONTO": "O Boticário", "TELEFONE": "3221-4594", "ENDEREÇO": "Av. Presidente Antônio Carlos, 408"},
    {"MATERIAL": "Embalagens de Cosméticos", "ECOPONTO": "O Boticário", "TELEFONE": "3221-4585", "ENDEREÇO": "Av. Rio Branco, 348 - Centro"},
    {"MATERIAL": "Tampinha de Plástico e Lacres de Latinha", "ECOPONTO": "VIDA VIVA", "TELEFONE": "3690-2900", "ENDEREÇO": "R. Alzira Magalhães Barra, 166 - Parque Boa Vista"},
    {"MATERIAL": "Tampinha de Plástico e Lacres de Latinha", "ECOPONTO": "Loja STRIP", "TELEFONE": "9 8853-8111", "ENDEREÇO": "R. Dr. Wenceslau Braz, 300"},
    {"MATERIAL": "Meias Sem Uso", "ECOPONTO": "PUKET Via Café Shopping", "TELEFONE": "", "ENDEREÇO": "R. Humberto Pizo, 999 - Jardim Petropolis"}
];


const coletaData: ColetaBairro[] = [
    ...("São Francisco, Cidade Nova, Jardim Itália, Jardim Colonial, Parque das Acácias, Vila Santa Cruz, Vista Alegre, Conjunto Habitacional, Casas Militar, Padre Vitor, Sion, Sion II, Vila Avelar, Alta Vila, Condomínio Romano, Nova Varginha, Parque Grevileas, Bairro Princesa do Sul, Santa Terezinha, Eldorado, Parque Urupês, Condomínio Residencial Urupês, Parque Ozanan, Jardim Andere, Vila Andere II, Santa Terezinha, Residencial Jardins do Ágape, Vila Andere I, Vial Verônica, Industrial Reinaldo Foresti, Vale dos Ipês, Jardim Petrópolis, Vila Bueno, Canaã 50%, Vila Isabel, Jardim dos Pássaros, Santa Luiza".split(', ')).map(bairro => ({ bairro: bairro.trim(), dias: "Segunda, Quarta, Sexta", periodo: "Manhã", horario: "06:30 - 12:30" })),
    ...("Jardim Oriente, Jardim Itália, Jardim Estrela I e II, Jardim Corcetti, Vila Josefina, Parque Eliane, Nossa Senhora Aparecida, Vila Pontal, Jardim Renata, Santana, Jardim Ribeiro, Jardim Primavera, Imaculada I, II e III, Residencial Rio Verde, Rio Verde, Bairro Simões, Residencial Jardim Vale Verde, Residencial Atlântico Sul, Bairro Resende, Jardim Mariana, Vila Isabel, Jardim Canaã 50%, Novo Horizonte, Catanduvas, Vila Nogueira, Três Bicas, Vila Floresta, Vila Morais, Nossa Senhora de Lourdes".split(', ')).map(bairro => ({ bairro: bairro.trim(), dias: "Terça, Quinta e Sábado", periodo: "Manhã", horario: "Consulte o horário exato" })),
    ...("Parque São José II, Bela Vista, Bela Vista II, Boa Vista, Parque Morada do Sol, São Geraldo, Bom Pastor, Alto dos Pinheiros, Vargem, Sete de Outubro, São Miguel Arcanjo, Sagrado Coração, Sagrado Coração II, Jardim das Oliveiras, Parque Alto da Figueiras, Parque Mariela, Condomínio Imperador, Jardim Bouganville, Belo Horizonte III, Vale das Palmeiras, Novo Damasco, Damasco, Imperial, Centenário II, Vila Registânea, Vila Maristela, Barcelona, Pinheiros".split(', ')).map(bairro => ({ bairro: bairro.trim(), dias: "Terça, Quinta e Sábado", periodo: "Tarde", horario: "Consulte o horário exato" })),
    ...("Vila Paiva, Parque Rinaldo, Mont Serrat, São José, Jardim Áurea, Fátima, Vila Adelaide, Vila Martins, Vila Murad, Jardim Orlândia, Vila Ipiranga, Campos Elíseos, Jardim Zinoca, Vila Mendes, Parque do Retiro, Vila do Flamengo, Jardim Europa, Residencial Jetcon, Carvalhos, Novo Tempo, Cruzeiro do Sul, Nossa Senhora das Graças I e II, Centenário I, Santa Mônica, São Sebastião, Santa Maria, Vila Belmiro, São Lucas, São Joaquim".split(', ')).map(bairro => ({ bairro: bairro.trim(), dias: "Segunda, Quarta, Sexta", periodo: "Tarde", horario: "12:00 - 18:00" })),
    ...("Restaurante da Sônia, Fibrax, Hipermax, Unis, Motel Kiss, Avery Termoplasticos, ABB, Bar da Ponte dos Buenos, Restaurante TH, Restaurante Fazendinha, Ilha das Orquídeas, Armazém de Café, Clube dos Servidores, Armazém Cafeco II, Truck, Unis II, Armazém MC Brasil, Sendas, Calçados Bomfim, Roncafé, Recauchutagem Vipal, Transversal, Empresa Santa Cruz, Madereira Magalhães, Jofadel, DER, Cive Veiculos, Armazém Rio Doce, STM, LBC, Clube Bancários, Callis, Sest Senat, Ritifica Líder, Hospital Regional, Hospital Bom Pastor, Hospital Humanitas, Copasa, Cooperativa Cafeicutores, Cemig, Mercado Produtor".split(', ')).map(bairro => ({ bairro: `(Firma) ${bairro.trim()}`, dias: "Terça e Quinta", periodo: "Manhã", horario: "06:30 - 12:30" })),
    ...("Supermecado Alvorada, Posto Ipiranga, Coutinho, Porto Seco, G. Lúcio, Clube Campestre, Água de Varginha, Escola Santa Terezinha, Leste de Minas, Itaipava, Armazém Cafeco, Nova Pagina, Inbrasmec, Patrus Transporte, Atos Distribuição, Nova Safra, Inter Aduaneira, Hotel Sleep Inn, Armazém Santa Clara, Translume, Glapan, Bar da Kátia, Action, Bar da Ponte, GT Minas, Fábrica de Lingerie, Avenida Airton Senna, Santa Terezinha, Recauchutagem Paulista, Caic I, Koop, IMF, Milton, Boiller Mil, Empemaq, Proluminas, Unigel, Leste de Minas I, PP Print, Presidio, Hospital Bom Pastor, Hospital Humanitas, Hospital Regional, (Sitio Engrenagem Segunda Feira), Interflex, Correio, Spacebr, Radial, Aero Cuble, Aeroporto, Porto Seco II, Metalúrgica Varginha, Walita".split(', ')).map(bairro => ({ bairro: `(Firma) ${bairro.trim()}`, dias: "Segunda, Quarta, Sexta", periodo: "Manhã", horario: "06:30 - 12:30" })),
    { bairro: "Área Central", dias: "Segunda a Sexta, Sábado e Domingo", periodo: "Noite", horario: "Seg-Sex: 19h-01h, Sáb: 14h-18h, Dom: 6h-12h" },
    { bairro: "Vila Pinto", dias: "Terça e Quinta, Sábado", periodo: "Noite", horario: "Ter/Qui: 19h-1h, Sáb: 14h-18h" },
];

export default function WasteManagementPage() {
  const [searchTermEcopontos, setSearchTermEcopontos] = useState('');
  const [searchTermBairro, setSearchTermBairro] = useState('');
  
  const getMaterialIcon = (material: string): React.ElementType => {
    const lowerMaterial = material.toLowerCase();
    if (lowerMaterial.includes('esponja')) return Sparkles;
    if (lowerMaterial.includes('lâmpada')) return Lightbulb;
    if (lowerMaterial.includes('eletrônico')) return MonitorSmartphone;
    if (lowerMaterial.includes('pilha') || lowerMaterial.includes('bateria')) return Battery;
    if (lowerMaterial.includes('óleo')) return Droplets;
    if (lowerMaterial.includes('medicamento') || lowerMaterial.includes('remédio') || lowerMaterial.includes('blister')) return Pill;
    if (lowerMaterial.includes('ferro-velho')) return Hammer;
    if (lowerMaterial.includes('pneu')) return CircleDot;
    if (lowerMaterial.includes('construção')) return Construction;
    if (lowerMaterial.includes('poda') || lowerMaterial.includes('capim')) return Leaf;
    if (lowerMaterial.includes('móveis') || lowerMaterial.includes('sofá')) return Sofa;
    if (lowerMaterial.includes('cosmético')) return Container;
    if (lowerMaterial.includes('lacre')) return Unplug;
    if (lowerMaterial.includes('papel') || lowerMaterial.includes('plástico') || lowerMaterial.includes('tampinha')) return Recycle;
    if (lowerMaterial.includes('vidro')) return GlassWater;
    if (lowerMaterial.includes('meias')) return Footprints;
    return Book;
  };

  const filteredEcopontos = useMemo(() => {
    if (!searchTermEcopontos) {
      return ecopontosData;
    }
    return ecopontosData.filter(ecoponto =>
      ecoponto.MATERIAL.toLowerCase().includes(searchTermEcopontos.toLowerCase()) ||
      ecoponto.ECOPONTO.toLowerCase().includes(searchTermEcopontos.toLowerCase())
    );
  }, [searchTermEcopontos]);

  const resultadosColeta = useMemo(() => {
    if (!searchTermBairro) {
      return [];
    }
    const searchLower = searchTermBairro.toLowerCase();
    
    const exactMatches = coletaData.filter(item => item.bairro.toLowerCase() === searchLower);
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    return coletaData.filter(item => item.bairro.toLowerCase().includes(searchLower));
  }, [searchTermBairro]);

  return (
    <PublicLayout>
      <div className="container mx-auto py-12 px-4">
        <PageTitle 
            title="Coleta e Descarte Consciente" 
            icon={Recycle} 
            description="Encontre locais para descarte e horários da coleta de lixo em Varginha." 
        />

        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
                <Search className="mr-3 h-7 w-7 text-primary"/>
                Ecopontos: Encontre o local certo para seu descarte
            </CardTitle>
            <CardDescription>
              O que você quer descartar? (ex: pilha, óleo, lâmpada, nome do local)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Digite o material ou nome do ecoponto..."
              value={searchTermEcopontos}
              onChange={(e) => setSearchTermEcopontos(e.target.value)}
              className="mb-6 text-base"
            />
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="font-semibold">Material</TableHead>
                    <TableHead className="font-semibold">Ecoponto</TableHead>
                    <TableHead className="font-semibold">Endereço</TableHead>
                    <TableHead className="font-semibold">Telefone</TableHead>
                    <TableHead className="font-semibold">Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEcopontos.length > 0 ? (
                    filteredEcopontos.map((ecoponto, index) => {
                      const Icon = getMaterialIcon(ecoponto.MATERIAL);
                      return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                            <span>{ecoponto.MATERIAL}</span>
                          </div>
                        </TableCell>
                        <TableCell>{ecoponto.ECOPONTO}</TableCell>
                        <TableCell>{ecoponto.ENDEREÇO}</TableCell>
                        <TableCell>{ecoponto.TELEFONE}</TableCell>
                        <TableCell>{ecoponto.OBSERVAÇÃO || '-'}</TableCell>
                      </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        Nenhum ecoponto encontrado para "{searchTermEcopontos}".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
             <CardTitle className="flex items-center text-2xl">
                <Trash2 className="mr-3 h-7 w-7 text-primary"/>
                Coleta de Lixo: Confira a programação
            </CardTitle>
            <CardDescription>
              Para saber quando o caminhão de lixo passa na sua rua, digite o nome do seu bairro ou estabelecimento. Solicitamos que os moradores coloquem o lixo uma hora antes do caminhão coletor passar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Digite o nome do seu bairro ou estabelecimento..."
              value={searchTermBairro}
              onChange={(e) => setSearchTermBairro(e.target.value)}
              className="mb-6 text-base"
            />
            <div className="space-y-4">
                {searchTermBairro && resultadosColeta.length > 0 ? (
                    resultadosColeta.map((resultado, index) => (
                        <Card key={index} className="bg-muted/50">
                            <CardHeader>
                            <CardTitle className="flex items-center"><Building className="mr-2 h-6 w-6 text-primary"/> {resultado.bairro}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                            <div className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5 text-muted-foreground"/>
                                <p><strong>Dias da Coleta:</strong> {resultado.dias}</p>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-5 w-5 text-muted-foreground"/>
                                <p><strong>Período:</strong> {resultado.periodo}</p>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-5 w-5 text-muted-foreground"/>
                                <p><strong>Horário Aproximado:</strong> {resultado.horario}</p>
                            </div>
                             {resultado.obs && (
                                <div className="flex items-start text-sm mt-2">
                                    <Info className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5"/>
                                    <p><strong className="font-medium">Atenção Feriados:</strong> {resultado.obs}</p>
                                </div>
                            )}
                            </CardContent>
                        </Card>
                    ))
                ) : searchTermBairro ? (
                <Card className="bg-muted/30">
                    <CardContent className="py-6 text-center">
                    <Info className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground">Nenhum resultado encontrado para "{searchTermBairro}". Verifique a digitação ou tente um nome mais genérico.</p>
                    </CardContent>
                </Card>
                ) : (
                    <Card className="bg-muted/30">
                        <CardContent className="py-6 text-center">
                            <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                            <p className="text-muted-foreground">Digite o nome do seu bairro para ver os horários de coleta.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
