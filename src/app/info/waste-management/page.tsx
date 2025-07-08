
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
    Sparkles
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Ecoponto {
  MATERIAL: string;
  ECOPONTO: string;
  ENDEREÇO: string;
  TELEFONE: string;
  OBSERVAÇÃO: string;
}

interface ColetaBairro {
  bairro: string;
  dias: string;
  periodo: string;
  horario: string;
  obs?: string;
}

const ecopontosData: Ecoponto[] = [
    {"MATERIAL": "Esponja de cozinha ou banho", "ECOPONTO": "Supermercado Maiolini", "ENDEREÇO": "Rua Rio de Janeiro, 684 - Centro", "TELEFONE": "2105-1800", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Esponja de cozinha ou banho", "ECOPONTO": "Loja STRIP", "ENDEREÇO": "R. Dr. Wenceslau Braz, 300", "TELEFONE": "98853-8111", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Lâmpadas", "ECOPONTO": "Supermercado Bretas", "ENDEREÇO": "Av. ayrton Senna, 111 - Rio verde", "TELEFONE": "2105-3551", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Lixo Eletrônico", "ECOPONTO": "Ecobrasil", "ENDEREÇO": "Av. Raul Salgado Filho, 180", "TELEFONE": "3214-2366", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Lixo Eletrônico", "ECOPONTO": "Loja Vivo", "ENDEREÇO": "Av. Rio Branco, 280 - Centro", "TELEFONE": "99911-5265", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Pilhas e baterias", "ECOPONTO": "Supermercado Maiolini", "ENDEREÇO": "Rua Rio de Janeiro, 684 - Centro", "TELEFONE": "2105-1800", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Pilhas e baterias", "ECOPONTO": "Imigrantes Materiais Elétricos", "ENDEREÇO": "Av. dos Imigrantes, 221 - Santa Maria", "TELEFONE": "3015-4001", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Óleo", "ECOPONTO": "Supermercado Maiolini", "ENDEREÇO": "Rua Rio de Janeiro, 684 - Centro", "TELEFONE": "2105-1800", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Óleo", "ECOPONTO": "Róleo Reciclagem", "ENDEREÇO": "", "TELEFONE": "98823-7383", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Medicamentos vencidos", "ECOPONTO": "Imigrantes Materiais Elétricos", "ENDEREÇO": "Av. dos Imigrantes, 221 - Santa Maria", "TELEFONE": "3015-4001", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Medicamentos vencidos", "ECOPONTO": "Unidade Centro UNIMED Varginha", "ENDEREÇO": "Praça Getúlio Vargas, 123, Centro", "TELEFONE": "3690-7100", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Ferro-velho", "ECOPONTO": "Cruzifer Reciclagem", "ENDEREÇO": "Av. Dr. José Justiniano dos reis, 1803 – Jardim Sion", "TELEFONE": "3221-5947", "OBSERVAÇÃO": "latinha, panela, geladeira, fogão, janela e porta de ferro."},
    {"MATERIAL": "Pneus", "ECOPONTO": "Barracão da Prefeitura", "ENDEREÇO": "R. Dr. Osvaldo de Resende, 70 - Parque Rinaldo", "TELEFONE": "3690-2311", "OBSERVAÇÃO": "Apenas para empresas cadastradas na SEMEA"},
    {"MATERIAL": "Resíduos de construção civil", "ECOPONTO": "VGA CAÇAMBAS", "ENDEREÇO": "R. Tenente Joaquim Pinto, 223 - Bom Pastor", "TELEFONE": "99972-5752", "OBSERVAÇÃO": "deve-se contratar o serviço"},
    {"MATERIAL": "Resíduos de construção civil", "ECOPONTO": "LIMA CAÇAMBAS", "ENDEREÇO": "Rodovia Varginha - Três Pontas km 4", "TELEFONE": "99947-7063", "OBSERVAÇÃO": "deve-se contratar o serviço"},
    {"MATERIAL": "Resíduos de construção civil", "ECOPONTO": "RODRIGO CAÇAMBAS", "ENDEREÇO": "Av. Rubens Vicente de Lucas, 145 - Alto dos Pinheiros", "TELEFONE": "99738-4479", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Resíduos de construção civil", "ECOPONTO": "Limpavia", "ENDEREÇO": "Estrada para fazenda Jacutinga, 3000", "TELEFONE": "3221-1838 / 3212-3293 / 3212-1166", "OBSERVAÇÃO": "pequenos volumes levar o material até a empresa"},
    {"MATERIAL": "Resíduos de corte de árvores, capim", "ECOPONTO": "LIMA CAÇAMBAS", "ENDEREÇO": "Rodovia Varginha - Três Pontas km 4", "TELEFONE": "99947-7063", "OBSERVAÇÃO": "deve-se contratar o serviço"},
    {"MATERIAL": "Resíduos de corte de árvores, capim", "ECOPONTO": "RODRIGO CAÇAMBAS", "ENDEREÇO": "Av. Rubens Vicente de Lucas, 145 - Alto dos Pinheiros", "TELEFONE": "99738-4479", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Resíduos de corte de árvores, capim", "ECOPONTO": "Limpavia", "ENDEREÇO": "Estrada para fazenda Jacutinga, 3000", "TELEFONE": "3221-1838 / 3212-3293 / 3212-1166", "OBSERVAÇÃO": "pequenos volumes levar o material até a empresa"},
    {"MATERIAL": "Móveis de madeira, sofás", "ECOPONTO": "Limpavia", "ENDEREÇO": "Estrada para fazenda Jacutinga, 3000", "TELEFONE": "3221-1838 / 3212-3293 / 3212-1166", "OBSERVAÇÃO": "pequenos volumes levar o material até a empresa"},
    {"MATERIAL": "Papel, papelão, plástico", "ECOPONTO": "Crm Central de Reciclagem Minas Ltda", "ENDEREÇO": "Av. Rogassiano Francisco Coelho, 145 - Nova Varginha", "TELEFONE": "3222-1187", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "VIDA VIVA", "ENDEREÇO": "R. Alzira Magalhães Barra, 166 - Parque Boa Vista", "TELEFONE": "3690-2900 / 98831-9726", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "Loja STRIP", "ENDEREÇO": "R. Dr. Wenceslau Braz, 300", "TELEFONE": "98853-8111", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "Vita Corpus – Farmácia de Manipulação", "ENDEREÇO": "Rua Santa Cruz, 887, Centro / Rua Doutor José Resende, 150, loja 101, Vila Pinto / Rua Doutor Marcos Frota, 22, Sion", "TELEFONE": "3212-9980", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "CONSULTÓRIO DRA. LILIAN BRAGA", "ENDEREÇO": "Av. Rui Barbosa, 385, sl 503 – Centro", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "CONSULTÓRIO DRA. SARA PRADO", "ENDEREÇO": "Rua Santa Cruz, 789, sala 602 – Centro", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "Caxieta Seguros", "ENDEREÇO": "R. Silvianópolis, 38 - Jardim Andere, Varginha", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "LUIZA PONZO (CORRETORA DE IMÓVEIS)", "ENDEREÇO": "Av. Rio Branco, 51 apto 203 ou subsolo 01 e 02 – Centro", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "Farmácia Grupo Farma", "ENDEREÇO": "Av. Dr. José Justiniano dos Reis, 1548 – Sion", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "Renato Tecidos", "ENDEREÇO": "Rua Delfim Moreira, 217 – Centro", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "Casa do Advogado", "ENDEREÇO": "Av. Plínio Salgado, 415 - Vila Pinto", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "Imigrantes Materiais Elétricos", "ENDEREÇO": "Av. dos Imigrantes, 221 - Santa Maria", "TELEFONE": "3015-4001", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Cartelas de remédios (BLISTERS)", "ECOPONTO": "Unidade Centro UNIMED Varginha", "ENDEREÇO": "Praça Getúlio Vargas, 123, Centro", "TELEFONE": "3690-7100", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Embalagens de cosméticos", "ECOPONTO": "Loja Traços", "ENDEREÇO": "Rua Delfim Moreira, 451 – Centro", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Embalagens de cosméticos", "ECOPONTO": "Boticário", "ENDEREÇO": "Av. Rio Branco, 348 – Centro / (35) 3221-4585 / Av. Presidente Antônio Carlos, 408 – Centro / (35) 3221-4594 / Rua Rio de Janeiro, 684 – Centro / (35) 3221-2831 / Av. José Benedito de Figueiredo, 10 - Vila Verde / (35) 3222-3594", "TELEFONE": "", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Tampinha de plástico", "ECOPONTO": "VIDA VIVA", "ENDEREÇO": "R. Alzira Magalhães Barra, 166 - Parque Boa Vista", "TELEFONE": "3690-2900 / 98831-9726", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Tampinha de plástico", "ECOPONTO": "Loja STRIP", "ENDEREÇO": "R. Dr. Wenceslau Braz, 300", "TELEFONE": "98853-8111", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Lacres de latinha", "ECOPONTO": "VIDA VIVA", "ENDEREÇO": "R. Alzira Magalhães Barra, 166 - Parque Boa Vista", "TELEFONE": "3690-2900 / 98831-9726", "OBSERVAÇÃO": ""},
    {"MATERIAL": "Lacres de latinha", "ECOPONTO": "Loja STRIP", "ENDEREÇO": "R. Dr. Wenceslau Braz, 300", "TELEFONE": "98853-8111", "OBSERVAÇÃO": ""}
];

const coletaData: ColetaBairro[] = [
    { bairro: "São Francisco", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Cidade Nova", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Itália", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Colonial", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Parque das Acácias", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Santa Cruz", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vista Alegre", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Conjunto Habitacional", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Casas Militar", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Padre Vitor", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Sion", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Sion II", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Avelar", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Alta Vila", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Condomínio Romano", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Nova Varginha", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Parque Grevileas", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Bairro Princesa do Sul", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Santa Terezinha", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Eldorado", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Parque Urupês", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Condomínio Residencial Urupês", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Parque Ozanan", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Andere", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Andere II", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Residencial Jardins do Ágape", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Andere I", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vial Verônica", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Industrial Reinaldo Foresti", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vale dos Ipês", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Petrópolis", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Bueno", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Canaã 50%", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Isabel", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim dos Pássaros", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Santa Luiza", dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Oriente", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Itália", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Estrela I e II", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Corcetti", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Josefina", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Parque Eliane", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Nossa Senhora Aparecida", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Pontal", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Renata", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Santana", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Ribeiro", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Primavera", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Imaculada I, II e III", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Residencial Rio Verde", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Rio Verde", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Bairro Simões", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Residencial Jardim Vale Verde", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Residencial Atlântico Sul", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Bairro Resende", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Mariana", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Isabel", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Jardim Canaã 50%", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Novo Horizonte", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Catanduvas", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Nogueira", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Três Bicas", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Floresta", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Vila Morais", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Nossa Senhora de Lourdes", dias: "Terça – Quinta – Sábado", periodo: "Manhã", horario: "Terça e Quinta 6h30 às 12h30, Sábado 6h30 às 10h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30." },
    { bairro: "Parque São José II", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Bela Vista", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Bela Vista II", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Boa Vista", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Parque Morada do Sol", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "São Geraldo", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Bom Pastor", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Alto dos Pinheiros", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Vargem", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Sete de Outubro", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "São Miguel Arcanjo", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Sagrado Coração", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Sagrado Coração II", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Jardim das Oliveiras", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Parque Alto da Figueiras", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Parque Mariela", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Condomínio Imperador", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Jardim Bouganville", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Belo Horizonte III", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Vale das Palmeiras", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Novo Damasco", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Damasco", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Imperial", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Centenário II", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Vila Registânea", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Vila Maristela", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Barcelona", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Pinheiros", dias: "Terça – Quinta – Sábado", periodo: "Tarde", horario: "Terça e Quinta 12h às 18h, Sábado 10h30 às 14h30", obs: "Em feriados, a coleta acontece das 6h30 às 14h30." },
    { bairro: "Vila Paiva", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Parque Rinaldo", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Mont Serrat", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "São José", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Jardim Áurea", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Fátima", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Vila Adelaide", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Vila Martins", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Vila Murad", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Jardim Orlândia", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Vila Ipiranga", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Campos Elíseos", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Jardim Zinoca", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Vila Mendes", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Parque do Retiro", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Vila do Flamengo", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Jardim Europa", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Residencial Jetcon", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Carvalhos", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Novo Tempo", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Cruzeiro do Sul", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Nossa Senhora das Graças I e II", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Centenário I", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Santa Mônica", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "São Sebastião", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Santa Maria", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Vila Belmiro", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "São Lucas", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "São Joaquim", dias: "Segunda – Quarta – Sexta", periodo: "Tarde", horario: "12h às 18h", obs: "Em feriados, a coleta acontece das 10h30 às 14h30." },
    { bairro: "Área Central", dias: "Segunda a Sexta, Sábado e Domingo", periodo: "Noite", horario: "Segunda a Sexta 19h às 01h, Sábado 14h às 18h, Domingo 6h às 12h" },
    { bairro: "Vila Pinto", dias: "Terça – Quinta, Sábado", periodo: "Noite", horario: "Terça e Quinta 19h às 1h, Sábado 14h às 18h" },
    ...("Restaurante da Sônia, Fibrax, Hipermax, Unis, Motel Kiss, Avery Termoplasticos, ABB, Bar da Ponte dos Buenos, Restaurante TH, Restaurante Fazendinha, Ilha das Orquídeas, Armazém de Café, Clube dos Servidores, Armazém Cafeco II, Truck, Unis II, Armazém MC Brasil, Sendas, Calçados Bomfim, Roncafé, Recauchutagem Vipal, Transversal, Empresa Santa Cruz, Madereira Magalhães, Jofadel, DER, Cive Veiculos, Armazém Rio Doce, STM, LBC, Clube Bancários, Callis, Sest Senat, Ritifica Líder, Hospital Regional, Hospital Bom Pastor, Hospital Humanitas, Copasa, Cooperativa Cafeicutores, Cemig, Mercado Produtor".split(', ')).map(b => ({ bairro: b.trim(), dias: "Terça e Quinta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30."})),
    ...("Supermecado Alvorada, Posto Ipiranga, Coutinho, Porto Seco, G. Lúcio, Clube Campestre, Água de Varginha, Escola Santa Terezinha, Leste de Minas, Itaipava, Armazém Cafeco, Nova Pagina, Inbrasmec, Patrus Transporte, Atos Distribuição, Nova Safra, Inter Aduaneira, Hotel Sleep Inn, Armazém Santa Clara, Translume, Glapan, Bar da Kátia, Action, Bar da Ponte, GT Minas, Fábrica de Lingerie, Avenida Airton Senna, Santa Terezinha, Recauchutagem Paulista, Caic I, Koop, IMF, Milton, Boiller Mil, Empemaq, Proluminas, Unigel, Leste de Minas I, PP Print, Presidio, Hospital Bom Pastor, Hospital Humanitas, Hospital Regional, (Sitio Engrenagem Segunda Feira), Interflex, Correio, Spacebr, Radial, Aero Cuble, Aeroporto, Porto Seco II, Metalúrgica Varginha, Walita".split(', ')).map(b => ({ bairro: b.trim(), dias: "Segunda – Quarta – Sexta", periodo: "Manhã", horario: "6h30 às 12h30", obs: "Em feriados, a coleta acontece das 6h30 às 10h30."})),
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
    if (lowerMaterial.includes('medicamento') || lowerMaterial.includes('remédio')) return Pill;
    if (lowerMaterial.includes('ferro-velho')) return Hammer;
    if (lowerMaterial.includes('pneu')) return CircleDot;
    if (lowerMaterial.includes('construção')) return Construction;
    if (lowerMaterial.includes('corte de árvore') || lowerMaterial.includes('capim')) return Leaf;
    if (lowerMaterial.includes('móveis') || lowerMaterial.includes('sofá')) return Sofa;
    if (lowerMaterial.includes('cosmético')) return Container;
    if (lowerMaterial.includes('lacre')) return Unplug;
    if (lowerMaterial.includes('papel') || lowerMaterial.includes('plástico') || lowerMaterial.includes('tampinha')) return Recycle;
    return Recycle; // Default icon
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
    
    // Prioritize exact matches
    const exactMatches = coletaData.filter(item => item.bairro.toLowerCase() === searchLower);
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    // Fallback to partial matches
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
