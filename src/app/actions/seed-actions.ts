
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { SectorSettings } from '@/types';
import { randomBytes } from 'crypto';

/**
 * Server Action que insere os dados de conteúdo da Arborização Urbana no Firestore.
 * Esta função deve ser executada uma única vez para popular o banco de dados.
 */
export async function seedUrbanAfforestationDataAction(): Promise<{ success: boolean; message: string; }> {
  console.log('Iniciando o povoamento do conteúdo de Arborização Urbana...');
  const { db } = getFirebaseAdmin();

  const seedData: SectorSettings = {
    contactInfo: {
      phone: "(35) 3606-9969",
      address: "Rua Jaime Venturato, 50, São Geraldo, Varginha/MG",
      schedule: "Seg. a Sex. das 07:30 às 11:30 e 13:00 às 17:00",
      emails: ["evelin.silva@varginha.mg.gov.br", "joana.carneiro@varginha.mg.gov.br"],
    },
    team: [
      { id: randomBytes(8).toString('hex'), name: "Évelin Cristiane de Castro Silva", role: "Engenheira Florestal", email: "evelin.silva@varginha.mg.gov.br" },
      { id: randomBytes(8).toString('hex'), name: "Joana Junqueira Carneiro", role: "Engenheira Florestal", email: "joana.carneiro@varginha.mg.gov.br" },
      { id: randomBytes(8).toString('hex'), name: "Fernando César Costa", role: "Engenheiro Agrônomo", email: "" },
      { id: randomBytes(8).toString('hex'), name: "Gevanildo Ferreira", role: "Encarregado de Corte e Poda", email: "" },
    ],
    downloads: [
      { id: randomBytes(8).toString('hex'), label: "Resolução CODEMA 01/2024", description: "Estabelece os procedimentos e critérios para autorização de poda e corte de árvores no município.", url: "https://www.varginha.mg.gov.br/portal/jornal/1145" },
      { id: randomBytes(8).toString('hex'), label: "Deliberação Normativa nº 01/2018", description: "Define os critérios e diretrizes para o parcelamento do solo urbano, incluindo aspectos de arborização.", url: "#" },
      { id: randomBytes(8).toString('hex'), label: "Lei 5.848/2014", description: "Institui o projeto 'Nasce uma Criança, Plante uma Árvore' no município de Varginha.", url: "#" },
      { id: randomBytes(8).toString('hex'), label: "Modelo de Placa - Proibido Jogar Lixo", description: "Modelo oficial de placa para instalação em áreas com descarte irregular de resíduos.", url: "http://www.varginha.mg.gov.br/imgeditor/file/SEMEA/Modelo_placa_PROIBIDO%20JOGAR%20LIXO_COLORIDO_NOVO.pdf" },
      { id: randomBytes(8).toString('hex'), label: "Formulários e Requerimentos", description: "Acesse e baixe os formulários necessários para diversas solicitações ao setor de arborização.", url: "#" }
    ],
    projects: [
        { id: randomBytes(8).toString('hex'), slug: 'plantar', title: 'Projeto PLANTAR', description: 'O plantio de mudas de árvores nativas e exóticas com fins paisagísticos na arborização urbana de praças e vias públicas.', active: true },
        { id: randomBytes(8).toString('hex'), slug: 'regenerar', title: 'Projeto REGENERAR', description: 'Elaborar, implementar e estudar cientificamente projetos de restauração ecológica em áreas degradadas públicas.', active: true },
        { id: randomBytes(8).toString('hex'), slug: 'pomar-urbano', title: 'Projeto POMAR URBANO', description: 'Realizar o plantio de mudas de árvores frutíferas em áreas públicas estratégicas na cidade.', active: true },
        { id: randomBytes(8).toString('hex'), slug: 'cuidar', title: 'Projeto CUIDAR', description: 'Executar ações de manejo da arborização urbana, como colocação e retirada de gradis, irrigação e podas.', active: true },
        { id: randomBytes(8).toString('hex'), slug: 'normatizar', title: 'Projeto NORMATIZAR', description: 'Atualizar todas as normas ambientais municipais e propor novas leis para fortalecer a sustentabilidade.', active: true },
        { id: randomBytes(8).toString('hex'), slug: 'fito-inventariar', title: 'Projeto FITO-INVENTARIAR', description: 'Catalogar as árvores de Varginha, formando um banco de dados geoespacializados com informações técnicas.', active: true },
        { id: randomBytes(8).toString('hex'), slug: 'tele-arvore', title: 'Projeto TELE-ÁRVORE', description: 'Criar um canal de aproximação da população com a arborização urbana, incentivando os moradores a terem uma árvore para chamar de sua.', active: true },
        { id: randomBytes(8).toString('hex'), slug: 'nasce-uma-crianca-plante-uma-arvore', title: 'Projeto NASCE UMA CRIANÇA, PLANTE UMA ÁRVORE', description: 'Fortalecer os vínculos da família com a natureza através do plantio de uma árvore em homenagem ao nascimento.', active: true },
    ]
  };

  try {
    const docRef = db.collection('sector_settings').doc('urban_afforestation');
    await docRef.set(seedData, { merge: true });
    
    const successMessage = 'Conteúdo de Arborização Urbana inserido no Firestore com sucesso!';
    console.log(successMessage);
    return { success: true, message: successMessage };
  } catch (error: any) {
    console.error("Erro ao popular conteúdo de Arborização Urbana:", error);
    return { 
      success: false, 
      message: "Falha ao popular o banco de dados. Verifique os logs do servidor.",
    };
  }
}

/**
 * Server Action que insere os dados de conteúdo da Educação Ambiental no Firestore.
 */
export async function seedEnvironmentalEducationDataAction(): Promise<{ success: boolean; message: string; }> {
  console.log('Iniciando o povoamento do conteúdo de Educação Ambiental...');
  const { db } = getFirebaseAdmin();

  const seedData: SectorSettings = {
    contactInfo: {
      phone: "(35) 3690-2529",
      address: "Rua Jaime Venturato, 50, São Geraldo, Varginha/MG",
      schedule: "Seg. a Sex. das 07:30 às 11:30 e 13:00 às 17:00",
      emails: ["jaara.cardoso@varginha.mg.gov.br", "(35) 8429-9795 (WhatsApp)"],
    },
    team: [
      { id: randomBytes(8).toString('hex'), name: "Jaara Alvarenga Cardoso Tavares", role: "Bióloga", email: "jaara.cardoso@varginha.mg.gov.br" },
    ],
    downloads: [],
    projects: [
      { id: randomBytes(8).toString('hex'), slug: 'escola-verde', title: 'Escola Verde - Educação Climática', description: 'Destaca a importância das árvores e amplia a arborização nas escolas.', active: true },
      { id: randomBytes(8).toString('hex'), slug: 'educacao-lixo-zero', title: 'Educação Lixo Zero', description: 'Capacitação sobre descarte correto e consumo consciente.', active: true },
      { id: randomBytes(8).toString('hex'), slug: 'botanica-no-parque', title: 'Botânica no Parque', description: 'Aulas práticas nos Parques Novo Horizonte ou Centenário com identificação de árvores. Duração de 2h.', active: true },
      { id: randomBytes(8).toString('hex'), slug: 'conexao-animal', title: 'Conexão Animal', description: 'Estimula boas práticas de bem-estar animal, adoção e convivência com animais silvestres.', active: true },
    ]
  };

  try {
    const docRef = db.collection('sector_settings').doc('environmental_education');
    await docRef.set(seedData, { merge: true });
    
    const successMessage = 'Conteúdo de Educação Ambiental inserido no Firestore com sucesso!';
    console.log(successMessage);
    return { success: true, message: successMessage };
  } catch (error: any) {
    console.error("Erro ao popular conteúdo de Educação Ambiental:", error);
    return { 
      success: false, 
      message: "Falha ao popular o banco de dados. Verifique os logs do servidor.",
    };
  }
}


/**
 * Server Action que insere os dados de conteúdo de Bem-Estar Animal no Firestore.
 */
export async function seedAnimalWelfareDataAction(): Promise<{ success: boolean; message: string; }> {
  console.log('Iniciando o povoamento do conteúdo de Bem-Estar Animal...');
  const { db } = getFirebaseAdmin();

  const seedData: SectorSettings = {
    contactInfo: {
      phone: "(35) 3690-2019 / (35) 3690-2276",
      address: "Rua Sebastião Guimarães Caldas, s/n, Sagrado Coração II",
      schedule: "Segunda a Sexta: Das 07h30 às 11h30 e de 13h30 a 17h30.",
      emails: ["bemestaranimal@varginha.mg.gov.br"],
    },
    team: [
      { id: randomBytes(8).toString('hex'), name: "Gabriela Pelegrini Batista", role: "Supervisora de Serviço de Bem Estar Animal", email: "bemestaranimal@varginha.mg.gov.br" },
      { id: randomBytes(8).toString('hex'), name: "José Eduardo Mambeli Balieiro", role: "Veterinário", email: "" },
      { id: randomBytes(8).toString('hex'), name: "Rafaela Belo Aguiar", role: "Assessor de Apoio Estratégico", email: "" },
      { id: randomBytes(8).toString('hex'), name: "Maria Tereza Dalia Foresti", role: "Assessor de apoio e defesa de bem-estar animal", email: "" },
      { id: randomBytes(8).toString('hex'), name: "Gisleni Pereira dos Santos", role: "Encarregado da Seção de Controle e Cuidado aos Animais", email: "" },
      { id: randomBytes(8).toString('hex'), name: "Nabih Alves", role: "Oficial Administrativo", email: "" },
      { id: randomBytes(8).toString('hex'), name: "Jaqueline Rosa", role: "Oficial Administrativo", email: "" },
    ],
    downloads: [],
    projects: [
      { id: randomBytes(8).toString('hex'), slug: 'cuidado-saude', title: "Cuidado e Saúde", description: "Oferecemos atendimento veterinário básico e acesso a programas de castração gratuita, garantindo a saúde e prevenindo o aumento de animais abandonados.", active: true },
      { id: randomBytes(8).toString('hex'), slug: 'adocao-responsavel', title: "Adoção Responsável", description: "Mantemos uma plataforma de adoção para conectar nossos animais resgatados a famílias que possam oferecer segurança, amor e um lar definitivo.", active: true },
      { id: randomBytes(8).toString('hex'), slug: 'protecao-resgate', title: "Proteção e Resgate", description: "Atendemos a denúncias de maus-tratos e atuamos no resgate de animais em situação de risco, oferecendo-lhes uma segunda chance.", active: true },
      { id: randomBytes(8).toString('hex'), slug: 'conscientizacao', title: "Conscientização", description: "Promovemos a importância da posse responsável, da vacinação e do cuidado contínuo, educando a comunidade para construir um futuro melhor para os animais.", active: true },
    ]
  };

  try {
    const docRef = db.collection('sector_settings').doc('animal_welfare');
    await docRef.set(seedData, { merge: true });
    
    const successMessage = 'Conteúdo de Bem-Estar Animal inserido no Firestore com sucesso!';
    console.log(successMessage);
    return { success: true, message: successMessage };
  } catch (error: any) {
    console.error("Erro ao popular conteúdo de Bem-Estar Animal:", error);
    return { 
      success: false, 
      message: "Falha ao popular o banco de dados. Verifique os logs do servidor.",
    };
  }
}
