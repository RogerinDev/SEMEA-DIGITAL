/**
 * @fileoverview Dados estáticos para a seção de Gestão de Resíduos.
 * Usado como fallback e para o 'seed' inicial do banco de dados.
 */

import type { CollectionPoint, Ecopoint } from '@/types';
import { randomBytes } from 'crypto';

function generateId() {
    return randomBytes(8).toString('hex');
}

export const ecopontosData: Ecopoint[] = [
    {"id": generateId(), "material": "Lixo Eletrônico", "name": "Ecobrasil", "phone": "9 8856-1145", "address": "Av. Raul Salgado Filho, 130", "active": true},
    {"id": generateId(), "material": "Lixo Eletrônico", "name": "Minasul", "phone": "3219-6900", "address": "Av. Dinamarca, 01 - Industrial JK", "active": true},
    {"id": generateId(), "material": "Lixo Eletrônico", "name": "Clube da Casa", "phone": "3690-1700", "address": "Av. Princesa do Sul, 500", "active": true},
    {"id": generateId(), "material": "Lixo Eletrônico", "name": "Loja Vivo", "phone": "9 9911-5265", "address": "Av. Rio Branco, 280 - Centro", "active": true},
    {"id": generateId(), "material": "Vidro", "name": "Raneri", "phone": "9 9759-6398", "address": "R. Coronel José Franscisco Coelho, 1015 Indl. JK", "active": true},
    {"id": generateId(), "material": "Vidro", "name": "Mineirão Atacarejo", "phone": "3223-9353", "address": "Av. Celina Ottoni, 888 - N. Sa. das Graças", "active": true},
    {"id": generateId(), "material": "Lâmpadas", "name": "Supermercado BH", "phone": "31 9 9925-3851", "address": "Rua Gabriel Penha de Paiva, 477 - Vila Paiva", "active": true},
    {"id": generateId(), "material": "Lâmpadas", "name": "Supermercados Rex", "phone": "3222-6811", "address": "Rua Santos Dumont, 127 - Barcelona", "active": true},
    {"id": generateId(), "material": "Óleo de Cozinha Usado", "name": "Róleo Reciclagem (Estacionamento Super. Maiolini)", "phone": "9 8835-3900 / 2105-1800", "address": "Rua Rio de Janeiro, 684", "active": true},
    {"id": generateId(), "material": "Medicamentos Vencidos e Blister", "name": "Sec. Municipal de Saúde e UBS", "phone": "3690-2203", "address": "Todas as unidades", "active": true},
    {"id": generateId(), "material": "Medicamentos Vencidos e Blister", "name": "CAPS", "phone": "3690-2182", "address": "Rua Aristides Paiva, 18 - Vila Paiva", "active": true},
    {"id": generateId(), "material": "Medicamentos Vencidos e Blister", "name": "Farmácia de Minas", "phone": "3690-2102", "address": "Av. Celina Ottoni, 3389 Padre Vitor", "active": true},
    {"id": generateId(), "material": "Pneus", "name": "Barracão da Prefeitura", "phone": "3690-2311", "address": "Rua Dr. Osvaldo de Resende, 70 - Parque Rinaldo", "active": true},
    {"id": generateId(), "material": "Resíduos de Construção Civil", "name": "VGA CAÇAMBAS", "phone": "9 9972-5752", "address": "R. Tenente Joaquim Pinto, 223 Bom Pastor", "observation": "SERVIÇO PAGO", "active": true},
    {"id": generateId(), "material": "Resíduos de Construção Civil", "name": "LIMA CAÇAMBAS", "phone": "9 9947-7063", "address": "Rodovia Varginha - Três Pontas km 4", "observation": "SERVIÇO PAGO", "active": true},
    {"id": generateId(), "material": "Móveis e Sofás", "name": "Limpavia", "phone": "3221-1838", "address": "Estrada para fazenda Jacutinga, 3000", "observation": "SERVIÇO PAGO", "active": true},
    {"id": generateId(), "material": "Papel, Papelão e Plástico", "name": "Central de Reciclagem Minas Ltda.", "phone": "3222-1187", "address": "Av. Rogassiano Francisco Coelho, 145 - Nova Varginha", "active": true},
    {"id": generateId(), "material": "Tampinha de Plástico e Lacres de Latinha", "name": "VIDA VIVA", "phone": "3690-2900", "address": "R. Alzira Magalhães Barra, 166 - Parque Boa Vista", "active": true},
];

export const coletaData: CollectionPoint[] = [
    ...("São Francisco, Cidade Nova, Jardim Itália, Jardim Colonial, Parque das Acácias, Vila Santa Cruz, Vista Alegre, Conjunto Habitacional, Casas Militar, Padre Vitor, Sion, Sion II, Vila Avelar, Alta Vila, Condomínio Romano, Nova Varginha, Parque Grevileas, Bairro Princesa do Sul, Santa Terezinha, Eldorado, Parque Urupês, Condomínio Residencial Urupês, Parque Ozanan, Jardim Andere, Vila Andere II, Residencial Jardins do Ágape, Vila Andere I, Vial Verônica, Industrial Reinaldo Foresti, Vale dos Ipês, Jardim Petrópolis, Vila Bueno, Canaã 50%, Vila Isabel, Jardim dos Pássaros, Santa Luiza".split(', ')).map(bairro => ({ id: generateId(), neighborhood: bairro.trim(), days: "Segunda, Quarta, Sexta", period: "Manhã", schedule: "06:30 - 12:30", observation: "Quando os dias citados acima forem feriados, a coleta acontecerá nos seguintes horários: 6h30 às 10h30", "active": true })),
    ...("Jardim Oriente, Jardim Itália, Jardim Estrela I e II, Jardim Corcetti, Vila Josefina, Parque Eliane, Nossa Senhora Aparecida, Vila Pontal, Jardim Renata, Santana, Jardim Ribeiro, Jardim Primavera, Imaculada I, II e III, Residencial Rio Verde, Rio Verde, Bairro Simões, Residencial Jardim Vale Verde, Residencial Atlântico Sul, Bairro Resende, Jardim Mariana, Vila Isabel, Jardim Canaã 50%, Novo Horizonte, Catanduvas, Vila Nogueira, Três Bicas, Vila Floresta, Vila Morais, Nossa Senhora de Lourdes".split(', ')).map(bairro => ({ id: generateId(), neighborhood: bairro.trim(), days: "Terça, Quinta, Sábado", period: "Manhã", schedule: "Terça e Quinta 6h30 às 12h30 / Sábado 6h30 às 10h30", observation: "Quando os dias citados acima forem feriados, a coleta acontecerá nos seguintes horários: 6h30 às 10h30", "active": true })),
    ...("Parque São José II, Bela Vista, Bela Vista II, Boa Vista, Parque Morada do Sol, São Geraldo, Bom Pastor, Alto dos Pinheiros, Vargem, Sete de Outubro, São Miguel Arcanjo, Sagrado Coração, Sagrado Coração II, Jardim das Oliveiras, Parque Alto da Figueiras, Parque Mariela, Condomínio Imperador, Jardim Bouganville, Belo Horizonte III, Vale das Palmeiras, Novo Damasco, Damasco, Imperial, Centenário II, Vila Registânea, Vila Maristela, Barcelona, Pinheiros".split(', ')).map(bairro => ({ id: generateId(), neighborhood: bairro.trim(), days: "Terça, Quinta, Sábado", period: "Tarde", schedule: "Terça – Quinta – 12h às 18h / Sábado 10h30 às 14h30", observation: "Quando os dias citados acima forem feriados, a coleta acontecerá nos seguintes horários: 6h30 às 14h30", "active": true })),
    ...("Vila Paiva, Parque Rinaldo, Mont Serrat, São José, Jardim Áurea, Fátima, Vila Adelaide, Vila Martins, Vila Murad, Jardim Orlândia, Vila Ipiranga, Campos Elíseos, Jardim Zinoca, Vila Mendes, Parque do Retiro, Vila do Flamengo, Jardim Europa, Residencial Jetcon, Carvalhos, Novo Tempo, Cruzeiro do Sul, Nossa Senhora das Graças I e II, Centenário I, Santa Mônica, São Sebastião, Santa Maria, Vila Belmiro, São Lucas, São Joaquim".split(', ')).map(bairro => ({ id: generateId(), neighborhood: bairro.trim(), days: "Segunda, Quarta, Sexta", period: "Tarde", schedule: "12:00 - 18:00", observation: "Quando os dias citados acima forem feriados, a coleta acontecerá nos seguintes horários: 10h30 às 14h30", "active": true })),
    { id: generateId(), neighborhood: "Área Central", days: "Segunda a Sexta, Sábado e Domingo", period: "Noite", schedule: "Seg-Sex: 19h às 01h, Sáb: 14h às 18h, Dom: 6h às 12h", observation: "Solicitamos que moradores coloquem o lixo uma hora antes do caminhão coletor passar.", "active": true },
    { id: generateId(), neighborhood: "Vila Pinto", days: "Terça e Quinta, Sábado", period: "Noite", schedule: "Terça e Quinta 19h às 1h / Sábado 14h às 18h", observation: "Solicitamos que moradores coloquem o lixo uma hora antes do caminhão coletor passar.", "active": true },
];
