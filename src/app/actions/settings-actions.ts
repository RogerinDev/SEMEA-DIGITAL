
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { SectorSettings } from '@/types';
import { revalidatePath } from 'next/cache';
import { ecopontosData, coletaData } from '@/lib/waste-data';

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
    ],
    projects: [
        { id: 'proj-1', slug: 'plantar', title: 'Projeto PLANTAR', description: 'O plantio de mudas de árvores nativas e exóticas com fins paisagísticos na arborização urbana de praças e vias públicas.', active: true },
        { id: 'proj-2', slug: 'regenerar', title: 'Projeto REGENERAR', description: 'Elaborar, implementar e estudar cientificamente projetos de restauração ecológica em áreas degradadas públicas.', active: true },
    ]
};

export async function getUrbanAfforestationSettings(): Promise<SectorSettings> {
  try {
    const { db } = getFirebaseAdmin();
    const docRef = db.collection('sector_settings').doc(URBAN_AFFORESTATION_DOC_NAME);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const firestoreData = docSnap.data() as Partial<SectorSettings>;
      console.log('Lendo dados de Arborização Urbana: Sucesso');
      return {
        ...DEFAULT_URBAN_AFFORESTATION_SETTINGS,
        ...firestoreData,
        contactInfo: { ...DEFAULT_URBAN_AFFORESTATION_SETTINGS.contactInfo, ...firestoreData.contactInfo },
      };
    } else {
      console.log('Lendo dados de Arborização Urbana: Fallback (documento não existe)');
      await docRef.set(DEFAULT_URBAN_AFFORESTATION_SETTINGS);
      return DEFAULT_URBAN_AFFORESTATION_SETTINGS;
    }
  } catch (error) {
    console.error("Erro CRÍTICO ao buscar configurações de Arborização Urbana:", error);
    console.log('Lendo dados de Arborização Urbana: Fallback (devido a erro)');
    return DEFAULT_URBAN_AFFORESTATION_SETTINGS;
  }
}

export async function updateUrbanAfforestationSettings(data: SectorSettings): Promise<{ success: boolean; error?: string }> {
  const { db } = getFirebaseAdmin();
  try {
    const docRef = db.collection('sector_settings').doc(URBAN_AFFORESTATION_DOC_NAME);
    await docRef.set(data, { merge: true });
    revalidatePath('/info/urban-afforestation');
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
    ]
};

export async function getEnvironmentalEducationSettings(): Promise<SectorSettings> {
  try {
    const { db } = getFirebaseAdmin();
    const docRef = db.collection('sector_settings').doc(ENVIRONMENTAL_EDUCATION_DOC_NAME);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const firestoreData = docSnap.data() as Partial<SectorSettings>;
      console.log('Lendo dados de Educação Ambiental: Sucesso');
      return {
        ...DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS,
        ...firestoreData,
        contactInfo: { ...DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS.contactInfo, ...firestoreData.contactInfo },
      };
    } else {
      console.log('Lendo dados de Educação Ambiental: Fallback (documento não existe)');
      await docRef.set(DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS);
      return DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS;
    }
  } catch (error) {
    console.error("Erro CRÍTICO ao buscar configurações de Educação Ambiental:", error);
    console.log('Lendo dados de Educação Ambiental: Fallback (devido a erro)');
    return DEFAULT_ENVIRONMENTAL_EDUCATION_SETTINGS;
  }
}

export async function updateEnvironmentalEducationSettings(data: SectorSettings): Promise<{ success: boolean; error?: string }> {
    const { db } = getFirebaseAdmin();
    try {
        const docRef = db.collection('sector_settings').doc(ENVIRONMENTAL_EDUCATION_DOC_NAME);
        await docRef.set(data, { merge: true });
        revalidatePath('/info/education');
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
    ],
    projects: [
        { id: 'bw-proj-1', slug: 'cuidado-saude', title: "Cuidado e Saúde", description: "Oferecemos atendimento veterinário básico e acesso a programas de castração gratuita.", active: true },
        { id: 'bw-proj-2', slug: 'adocao-responsavel', title: "Adoção Responsável", description: "Conectamos animais resgatados a famílias amorosas.", active: true },
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
      console.log('Lendo dados de Bem-Estar Animal: Sucesso');
      return {
        ...DEFAULT_ANIMAL_WELFARE_SETTINGS,
        ...firestoreData,
        contactInfo: { ...DEFAULT_ANIMAL_WELFARE_SETTINGS.contactInfo, ...firestoreData.contactInfo },
      };
    } else {
      console.log('Lendo dados de Bem-Estar Animal: Fallback (documento não existe)');
      await docRef.set(DEFAULT_ANIMAL_WELFARE_SETTINGS);
      return DEFAULT_ANIMAL_WELFARE_SETTINGS;
    }
  } catch (error) {
    console.error("Erro CRÍTICO ao buscar configurações de Bem-Estar Animal:", error);
    console.log('Lendo dados de Bem-Estar Animal: Fallback (devido a erro)');
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

// --- Waste Management Settings ---

const WASTE_MANAGEMENT_DOC_NAME = 'waste_management';
const DEFAULT_WASTE_MANAGEMENT_SETTINGS = {
    ecopoints: ecopontosData,
    collectionPoints: coletaData,
};

export async function getWasteManagementSettings(): Promise<SectorSettings> {
  try {
    const { db } = getFirebaseAdmin();
    const docRef = db.collection('sector_settings').doc(WASTE_MANAGEMENT_DOC_NAME);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const firestoreData = docSnap.data() as Partial<SectorSettings>;
      console.log('Lendo dados de Gestão de Resíduos: Sucesso');
      return {
        ...DEFAULT_WASTE_MANAGEMENT_SETTINGS,
        ...firestoreData,
      } as SectorSettings; // Cast as SectorSettings might be needed
    } else {
      console.log('Lendo dados de Gestão de Resíduos: Auto-Seed (documento não existe)');
      await docRef.set(DEFAULT_WASTE_MANAGEMENT_SETTINGS);
      return DEFAULT_WASTE_MANAGEMENT_SETTINGS as unknown as SectorSettings; // Cast as SectorSettings
    }
  } catch (error) {
    console.error("Erro CRÍTICO ao buscar configurações de Gestão de Resíduos:", error);
    console.log('Lendo dados de Gestão de Resíduos: Fallback (devido a erro)');
    return DEFAULT_WASTE_MANAGEMENT_SETTINGS as unknown as SectorSettings; // Cast as SectorSettings
  }
}

export async function updateWasteManagementSettings(data: Partial<SectorSettings>): Promise<{ success: boolean; error?: string }> {
    const { db } = getFirebaseAdmin();
    try {
        const docRef = db.collection('sector_settings').doc(WASTE_MANAGEMENT_DOC_NAME);
        await docRef.set(data, { merge: true });
        revalidatePath('/info/waste-management');
        return { success: true };
    } catch (error: any) {
        console.error("Erro ao atualizar configurações de Gestão de Resíduos:", error);
        return { success: false, error: "Não foi possível salvar as configurações. Verifique as permissões." };
    }
}
