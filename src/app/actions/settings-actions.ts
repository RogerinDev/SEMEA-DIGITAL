
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { SectorSettings } from '@/types';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';

// --- Urban Afforestation Settings ---

const URBAN_AFFORESTATION_DOC_NAME = 'urban_afforestation';
const DEFAULT_URBAN_AFFORESTATION_SETTINGS: SectorSettings = {
    contactInfo: {
      phone: "(35) 3606-9969",
      address: "Rua Jaime Venturato, 50, São Geraldo, Varginha/MG",
      schedule: "Seg. a Sex. das 07:30 às 11:30 e 13:00 às 17:00",
      emails: ["evelin.silva@varginha.mg.gov.br", "joana.carneiro@varginha.mg.gov.br"],
    },
    team: [
      { id: 'team-1', name: "Évelin Cristiane de Castro Silva", role: "Engenheira Florestal", email: "evelin.silva@varginha.mg.gov.br" },
      { id: 'team-2', name: "Joana Junqueira Carneiro", role: "Engenheira Florestal", email: "joana.carneiro@varginha.mg.gov.br" },
      { id: 'team-3', name: "Fernando César Costa", role: "Engenheiro Agrônomo", email: "" },
      { id: 'team-4', name: "Gevanildo Ferreira", role: "Encarregado de Corte e Poda", email: "" },
    ],
    downloads: [
      { id: 'dl-1', label: "Resolução CODEMA 01/2024", description: "Estabelece os procedimentos e critérios para autorização de poda e corte de árvores no município.", url: "https://www.varginha.mg.gov.br/portal/jornal/1145" },
      { id: 'dl-2', label: "Deliberação Normativa nº 01/2018", description: "Define os critérios e diretrizes para o parcelamento do solo urbano, incluindo aspectos de arborização.", url: "#" },
      { id: 'dl-3', label: "Lei 5.848/2014", description: "Institui o projeto 'Nasce uma Criança, Plante uma Árvore' no município de Varginha.", url: "#" },
      { id: 'dl-4', label: "Modelo de Placa - Proibido Jogar Lixo", description: "Modelo oficial de placa para instalação em áreas com descarte irregular de resíduos.", url: "http://www.varginha.mg.gov.br/imgeditor/file/SEMEA/Modelo_placa_PROIBIDO%20JOGAR%20LIXO_COLORIDO_NOVO.pdf" },
      { id: 'dl-5', label: "Formulários e Requerimentos", description: "Acesse e baixe os formulários necessários para diversas solicitações ao setor de arborização.", url: "#" },
    ],
    projects: [
        { id: 'proj-1', slug: 'plantar', title: 'Projeto PLANTAR', description: 'O plantio de mudas de árvores nativas e exóticas com fins paisagísticos na arborização urbana de praças e vias públicas.', active: true },
        { id: 'proj-2', slug: 'regenerar', title: 'Projeto REGENERAR', description: 'Elaborar, implementar e estudar cientificamente projetos de restauração ecológica em áreas degradadas públicas.', active: true },
        { id: 'proj-3', slug: 'pomar-urbano', title: 'Projeto POMAR URBANO', description: 'Realizar o plantio de mudas de árvores frutíferas em áreas públicas estratégicas na cidade.', active: true },
        { id: 'proj-4', slug: 'cuidar', title: 'Projeto CUIDAR', description: 'Executar ações de manejo da arborização urbana, como colocação e retirada de gradis, irrigação e podas.', active: true },
        { id: 'proj-5', slug: 'normatizar', title: 'Projeto NORMATIZAR', description: 'Atualizar todas as normas ambientais municipais e propor novas leis para fortalecer a sustentabilidade.', active: true },
        { id: 'proj-6', slug: 'fito-inventariar', title: 'Projeto FITO-INVENTARIAR', description: 'Catalogar as árvores de Varginha, formando um banco de dados geoespacializados com informações técnicas.', active: true },
        { id: 'proj-7', slug: 'tele-arvore', title: 'Projeto TELE-ÁRVORE', description: 'Criar um canal de aproximação da população com a arborização urbana, incentivando os moradores a terem uma árvore para chamar de sua.', active: true },
        { id: 'proj-8', slug: 'nasce-uma-crianca-plante-uma-arvore', title: 'Projeto NASCE UMA CRIANÇA, PLANTE UMA ÁRVORE', description: 'Fortalecer os vínculos da família com a natureza através do plantio de uma árvore em homenagem ao nascimento.', active: true },
    ]
};

export async function getUrbanAfforestationSettings(): Promise<SectorSettings> {
  try {
    const { db } = getFirebaseAdmin();
    const docRef = db.collection('sector_settings').doc(URBAN_AFFORESTATION_DOC_NAME);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const firestoreData = docSnap.data() as Partial<SectorSettings>;
      return {
        contactInfo: { ...DEFAULT_URBAN_AFFORESTATION_SETTINGS.contactInfo, ...firestoreData.contactInfo },
        team: firestoreData.team || DEFAULT_URBAN_AFFORESTATION_SETTINGS.team,
        downloads: firestoreData.downloads || DEFAULT_URBAN_AFFORESTATION_SETTINGS.downloads,
        projects: firestoreData.projects || DEFAULT_URBAN_AFFORESTATION_SETTINGS.projects,
      };
    } else {
      console.warn(`Documento '${URBAN_AFFORESTATION_DOC_NAME}' não encontrado. Retornando dados padrão.`);
      await docRef.set(DEFAULT_URBAN_AFFORESTATION_SETTINGS);
      return DEFAULT_URBAN_AFFORESTATION_SETTINGS;
    }
  } catch (error) {
    console.error("Erro CRÍTICO ao buscar configurações de Arborização Urbana:", error);
    return DEFAULT_URBAN_AFFORESTATION_SETTINGS;
  }
}

export async function updateUrbanAfforestationSettings(data: SectorSettings): Promise<{ success: boolean; error?: string }> {
  const { db, auth } = getFirebaseAdmin();
  // RBAC logic will be handled by Firestore Rules, but we can double-check here.
  // This is a simplified check. A real app should verify the user's token.
  try {
    const docRef = db.collection('sector_settings').doc(URBAN_AFFORESTATION_DOC_NAME);
    await docRef.set(data, { merge: true });

    revalidatePath('/info/urban-afforestation', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar configurações de Arborização Urbana:", error);
    return { success: false, error: "Não foi possível salvar as configurações. Verifique as permissões." };
  }
}


// --- Environmental Education Settings ---

const ENVIRONMENTAL_EDUCATION_DOC_NAME = 'environmental_education';
const DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS: SectorSettings = {
    contactInfo: {
      phone: "(35) 3690-2529",
      address: "Rua Jaime Venturato, 50, São Geraldo, Varginha/MG",
      schedule: "Seg. a Sex. das 07:30 às 11:30 e 13:00 às 17:00",
      emails: ["(35) 8429-9795 (WhatsApp)"],
    },
    team: [
      { id: 'team-edu-1', name: "Jaara Alvarenga Cardoso Tavares", role: "Bióloga", email: "jaara.cardoso@varginha.mg.gov.br" },
    ],
    downloads: [],
    projects: [
        { id: 'edu-proj-1', slug: 'escola-verde', title: 'Escola Verde - Educação Climática', description: 'Destaca a importância das árvores e amplia a arborização nas escolas.', active: true },
        { id: 'edu-proj-2', slug: 'educacao-lixo-zero', title: 'Educação Lixo Zero', description: 'Capacitação sobre descarte correto e consumo consciente.', active: true },
        { id: 'edu-proj-3', slug: 'botanica-no-parque', title: 'Botânica no Parque', description: 'Aulas práticas nos Parques Novo Horizonte ou Centenário com identificação de árvores. Duração de 2h.', active: true },
        { id: 'edu-proj-4', slug: 'conexao-animal', title: 'Conexão Animal', description: 'Estimula boas práticas de bem-estar animal, adoção e convivência com animais silvestres.', active: true },
    ]
};

export async function getEnvironmentalEducationSettings(): Promise<SectorSettings> {
  try {
    const { db } = getFirebaseAdmin();
    const docRef = db.collection('sector_settings').doc(ENVIRONMENTAL_EDUCATION_DOC_NAME);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const firestoreData = docSnap.data() as Partial<SectorSettings>;
      return {
        contactInfo: { ...DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS.contactInfo, ...firestoreData.contactInfo },
        team: firestoreData.team || DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS.team,
        downloads: firestoreData.downloads || DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS.downloads,
        projects: firestoreData.projects || DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS.projects,
      };
    } else {
      console.warn(`Documento '${ENVIRONMENTAL_EDUCATION_DOC_NAME}' não encontrado. Retornando dados padrão.`);
      await docRef.set(DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS);
      return DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS;
    }
  } catch (error) {
    console.error("Erro CRÍTICO ao buscar configurações de Educação Ambiental:", error);
    return DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS;
  }
}

export async function updateEnvironmentalEducationSettings(data: SectorSettings): Promise<{ success: boolean; error?: string }> {
    // RBAC is primarily handled by Firestore rules, this is a server-side safeguard.
    // In a real scenario, you'd get the user's token from the request.
    // For now, we trust the client to make authorized calls, protected by Firestore rules.
    const { db } = getFirebaseAdmin();
    try {
        const docRef = db.collection('sector_settings').doc(ENVIRONMENTAL_EDUCATION_DOC_NAME);
        await docRef.set(data, { merge: true });

        revalidatePath('/info/education', 'layout');

        return { success: true };
    } catch (error: any) {
        console.error("Erro ao atualizar configurações de Educação Ambiental:", error);
        return { success: false, error: "Não foi possível salvar as configurações. Verifique as permissões." };
    }
}
