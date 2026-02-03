
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { UrbanAfforestationSettings } from '@/types';
import { randomBytes } from 'crypto';

/**
 * Server Action que insere os dados de conteúdo da Arborização Urbana no Firestore.
 * Esta função deve ser executada uma única vez para popular o banco de dados.
 */
export async function seedUrbanAfforestationDataAction(): Promise<{ success: boolean; message: string; }> {
  console.log('Iniciando o povoamento do conteúdo de Arborização Urbana...');
  const { db } = getFirebaseAdmin();

  // Dados extraídos dos arquivos estáticos existentes
  const seedData: UrbanAfforestationSettings = {
    contactInfo: {
      phone: "(35) 3606-9969"
    },
    team: [
      { id: randomBytes(8).toString('hex'), name: "Évelin Cristiane de Castro Silva", role: "Engenheira Florestal", email: "evelin.silva@varginha.mg.gov.br" },
      { id: randomBytes(8).toString('hex'), name: "Joana Junqueira Carneiro", role: "Engenheira Florestal", email: "joana.carneiro@varginha.mg.gov.br" },
      { id: randomBytes(8).toString('hex'), name: "Fernando César Costa", role: "Engenheiro Agrônomo", email: "" },
      { id: randomBytes(8).toString('hex'), name: "Gevanildo Ferreira", role: "Encarregado de Corte e Poda", email: "" },
    ],
    downloads: [
      {
        id: randomBytes(8).toString('hex'),
        label: "Resolução CODEMA 01/2024",
        description: "Estabelece os procedimentos e critérios para autorização de poda e corte de árvores no município.",
        url: "https://www.varginha.mg.gov.br/portal/jornal/1145",
      },
      {
        id: randomBytes(8).toString('hex'),
        label: "Deliberação Normativa nº 01/2018",
        description: "Define os critérios e diretrizes para o parcelamento do solo urbano, incluindo aspectos de arborização.",
        url: "#",
      },
      {
        id: randomBytes(8).toString('hex'),
        label: "Lei 5.848/2014",
        description: "Institui o projeto 'Nasce uma Criança, Plante uma Árvore' no município de Varginha.",
        url: "#",
      },
      {
        id: randomBytes(8).toString('hex'),
        label: "Modelo de Placa - Proibido Jogar Lixo",
        description: "Modelo oficial de placa para instalação em áreas com descarte irregular de resíduos.",
        url: "http://www.varginha.mg.gov.br/imgeditor/file/SEMEA/Modelo_placa_PROIBIDO%20JOGAR%20LIXO_COLORIDO_NOVO.pdf",
      },
      {
        id: randomBytes(8).toString('hex'),
        label: "Formulários e Requerimentos",
        description: "Acesse e baixe os formulários necessários para diversas solicitações ao setor de arborização.",
        url: "#",
      }
    ],
    projects: [
        {
            id: randomBytes(8).toString('hex'),
            slug: 'plantar',
            title: 'Projeto PLANTAR',
            description: 'O plantio de mudas de árvores nativas e exóticas com fins paisagísticos na arborização urbana de praças e vias públicas, em diferentes regiões da cidade onde a cobertura é mais escassa.',
            active: true
        },
        {
            id: randomBytes(8).toString('hex'),
            slug: 'regenerar',
            title: 'Projeto REGENERAR',
            description: 'Elaborar, implementar e estudar cientificamente projetos de restauração ecológica em áreas degradadas públicas utilizando um conjunto de técnicas regenerativas.',
            active: true
        },
        {
            id: randomBytes(8).toString('hex'),
            slug: 'pomar-urbano',
            title: 'Projeto POMAR URBANO',
            description: 'Realizar o plantio de mudas de árvores frutíferas em áreas públicas estratégicas na cidade, como cantos de ruas, escolas e creches, desde que não causem conflitos e seja propício ao convívio com a população.',
            active: true
        },
        {
            id: randomBytes(8).toString('hex'),
            slug: 'cuidar',
            title: 'Projeto CUIDAR',
            description: 'Executar ações de manejo da arborização urbana, como colocação e retirada de gradis, irrigação e podas de limpeza, condução e de risco. Inclui também o serviço de vistoria e emissão de autorização para poda e corte.',
            active: true
        },
        {
            id: randomBytes(8).toString('hex'),
            slug: 'normatizar',
            title: 'Projeto NORMATIZAR',
            description: 'Atualizar todas as normas ambientais municipais, elaborar instruções técnicas, termos de referência e propor novas leis para fortalecer a sustentabilidade em Varginha.',
            active: true
        },
        {
            id: randomBytes(8).toString('hex'),
            slug: 'fito-inventariar',
            title: 'Projeto FITO-INVENTARIAR',
            description: 'Catalogar as árvores de Varginha, formando um banco de dados geoespacializados com informações técnicas sobre a situação dos indivíduos arbóreos do ambiente urbano.',
            active: true
        },
        {
            id: randomBytes(8).toString('hex'),
            slug: 'tele-arvore',
            title: 'Projeto TELE-ÁRVORE',
            description: 'Criar um canal de aproximação da população com a arborização urbana, incentivando os moradores a terem uma árvore pública para chamar de sua.',
            active: true
        },
        {
            id: randomBytes(8).toString('hex'),
            slug: 'nasce-uma-crianca-plante-uma-arvore',
            title: 'Projeto NASCE UMA CRIANÇA, PLANTE UMA ÁRVORE',
            description: 'Fortalecer os vínculos da família e da criança com a natureza através do plantio de uma árvore em homenagem ao seu nascimento.',
            active: true
        },
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
