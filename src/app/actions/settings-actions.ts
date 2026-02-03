
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { SectorSettings } from '@/types';
import { revalidatePath } from 'next/cache';

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
  const { db } = getFirebaseAdmin();
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


// --- Animal Welfare Settings ---

const ANIMAL_WELFARE_DOC_NAME = 'animal_welfare';
const DEFAULT_ANIMAL_WELFARE_SETTINGS: SectorSettings = {
    contactInfo: {
      phone: "(35) 3690-2019 / (35) 3690-2276",
      address: "Rua Sebastião Guimarães Caldas, s/n, Sagrado Coração II",
      schedule: "Segunda a Sexta: Das 07h30 às 11h30 e de 13h30 a 17h30.",
      emails: ["bemestaranimal@varginha.mg.gov.br"],
    },
    team: [
        { id: 'bw-team-1', name: "Gabriela Pelegrini Batista", role: "Supervisora de Serviço de Bem Estar Animal", email: "bemestaranimal@varginha.mg.gov.br" },
        { id: 'bw-team-2', name: "José Eduardo Mambeli Balieiro", role: "Veterinário", email: "" },
        { id: 'bw-team-3', name: "Rafaela Belo Aguiar", role: "Assessor de Apoio Estratégico", email: "" },
        { id: 'bw-team-4', name: "Maria Tereza Dalia Foresti", role: "Assessor de apoio e defesa de bem-estar animal", email: "" },
        { id: 'bw-team-5', name: "Gisleni Pereira dos Santos", role: "Encarregado da Seção de Controle e Cuidado aos Animais", email: "" },
        { id: 'bw-team-6', name: "Nabih Alves", role: "Oficial Administrativo", email: "" },
        { id: 'bw-team-7', name: "Jaqueline Rosa", role: "Oficial Administrativo", email: "" },
    ],
    projects: [
        { id: 'bw-proj-1', slug: 'cuidado-saude', title: "Cuidado e Saúde", description: "Oferecemos atendimento veterinário básico e acesso a programas de castração gratuita, garantindo a saúde e prevenindo o aumento de animais abandonados.", active: true },
        { id: 'bw-proj-2', slug: 'adocao-responsavel', title: "Adoção Responsável", description: "Mantemos uma plataforma de adoção para conectar nossos animais resgatados a famílias que possam oferecer segurança, amor e um lar definitivo.", active: true },
        { id: 'bw-proj-3', slug: 'protecao-resgate', title: "Proteção e Resgate", description: "Atendemos a denúncias de maus-tratos e atuamos no resgate de animais em situação de risco, oferecendo-lhes uma segunda chance.", active: true },
        { id: 'bw-proj-4', slug: 'conscientizacao', title: "Conscientização", description: "Promovemos a importância da posse responsável, da vacinação e do cuidado contínuo, educando a comunidade para construir um futuro melhor para os animais.", active: true },
    ],
    downloads: [],
};

export async function getAnimalWelfareSettings(): Promise<SectorSettings> {
  try {
    const { db } = getFirebaseAdmin();
    const docRef = db.collection('sector_settings').doc(ANIMAL_WELFARE_DOC_NAME);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const firestoreData = docSnap.data() as Partial<SectorSettings>;
      return {
        contactInfo: { ...DEFAULT_ANIMAL_WELFARE_SETTINGS.contactInfo, ...firestoreData.contactInfo },
        team: firestoreData.team || DEFAULT_ANIMAL_WELFARE_SETTINGS.team,
        downloads: firestoreData.downloads || DEFAULT_ANIMAL_WELFARE_SETTINGS.downloads,
        projects: firestoreData.projects || DEFAULT_ANIMAL_WELFARE_SETTINGS.projects,
      };
    } else {
      console.warn(`Documento '${ANIMAL_WELFARE_DOC_NAME}' não encontrado. Retornando dados padrão.`);
      await docRef.set(DEFAULT_ANIMAL_WELFARE_SETTINGS);
      return DEFAULT_ANIMAL_WELFARE_SETTINGS;
    }
  } catch (error) {
    console.error("Erro CRÍTICO ao buscar configurações de Bem-Estar Animal:", error);
    return DEFAULT_ANIMAL_WELFARE_SETTINGS;
  }
}

export async function updateAnimalWelfareSettings(data: SectorSettings): Promise<{ success: boolean; error?: string }> {
    const { db } = getFirebaseAdmin();
    try {
        const docRef = db.collection('sector_settings').doc(ANIMAL_WELFARE_DOC_NAME);
        await docRef.set(data, { merge: true });
        revalidatePath('/info/animal-welfare');
        return { success: true };
    } catch (error: any) {
        console.error("Erro ao atualizar configurações de Bem-Estar Animal:", error);
        return { success: false, error: "Não foi possível salvar as configurações. Verifique as permissões." };
    }
}
