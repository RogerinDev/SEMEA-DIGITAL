
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { UrbanAfforestationSettings } from '@/types';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';

const collectionName = 'sector_settings';
const docName = 'urban_afforestation';

// Define os dados padrão como um fallback em caso de erro ou documento inexistente.
const DEFAULT_URBAN_AFFORESTATION_SETTINGS: UrbanAfforestationSettings = {
    contactInfo: {
      phone: "(35) 3606-9969"
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

/**
 * Busca as configurações de conteúdo para a Arborização Urbana.
 * Se a busca falhar ou o documento não existir, retorna dados padrão para evitar que a página quebre.
 */
export async function getUrbanAfforestationSettings(): Promise<UrbanAfforestationSettings> {
  try {
    const { db } = getFirebaseAdmin();
    const docRef = db.collection(collectionName).doc(docName);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // Mescla os dados do banco com os dados padrão para garantir que campos novos não quebrem a aplicação.
      const firestoreData = docSnap.data();
      return {
        contactInfo: { ...DEFAULT_URBAN_AFFORESTATION_SETTINGS.contactInfo, ...firestoreData?.contactInfo },
        team: firestoreData?.team || DEFAULT_URBAN_AFFORESTATION_SETTINGS.team,
        downloads: firestoreData?.downloads || DEFAULT_URBAN_AFFORESTATION_SETTINGS.downloads,
        projects: firestoreData?.projects || DEFAULT_URBAN_AFFORESTATION_SETTINGS.projects,
      };
    } else {
      console.warn(`Documento de configurações '${docName}' não encontrado. Retornando dados padrão.`);
      // Opcional: "Seed on Read". Tenta salvar os dados padrão no banco para a próxima vez.
      docRef.set(DEFAULT_URBAN_AFFORESTATION_SETTINGS).catch(err => {
        console.error("Falha ao tentar criar o documento de configurações padrão no Firestore:", err);
      });
      return DEFAULT_URBAN_AFFORESTATION_SETTINGS;
    }
  } catch (error) {
    console.error("Erro CRÍTICO ao buscar configurações de Arborização Urbana. Retornando dados de fallback.", error);
    // Em caso de erro na conexão ou outro problema, retorna os dados padrão.
    return DEFAULT_URBAN_AFFORESTATION_SETTINGS;
  }
}

/**
 * Atualiza as configurações de conteúdo para a Arborização Urbana.
 * Revalida os caches das páginas afetadas.
 */
export async function updateUrbanAfforestationSettings(data: UrbanAfforestationSettings): Promise<{ success: boolean; error?: string }> {
  const { db } = getFirebaseAdmin();
  try {
    const docRef = db.collection(collectionName).doc(docName);
    await docRef.set(data, { merge: true }); // Usar merge para não sobrescrever campos não enviados

    // Revalida o cache das páginas públicas que usam esses dados
    revalidatePath('/info/urban-afforestation');
    revalidatePath('/info/urban-afforestation/contact');
    revalidatePath('/info/urban-afforestation/legislation');
    revalidatePath('/info/urban-afforestation/projects');
    
    // Revalida as páginas de detalhes dos projetos também
    data.projects.forEach(project => {
        revalidatePath(`/info/urban-afforestation/projects/${project.slug}`);
    });

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar configurações de Arborização Urbana:", error);
    return { success: false, error: "Não foi possível salvar as configurações." };
  }
}
