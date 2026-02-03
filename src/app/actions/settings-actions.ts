
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { UrbanAfforestationSettings } from '@/types';
import { revalidatePath } from 'next/cache';

const collectionName = 'sector_settings';
const docName = 'urban_afforestation';

/**
 * Busca as configurações de conteúdo para a Arborização Urbana.
 * Retorna null se o documento não existir.
 */
export async function getUrbanAfforestationSettings(): Promise<UrbanAfforestationSettings | null> {
  const { db } = getFirebaseAdmin();
  try {
    const docRef = db.collection(collectionName).doc(docName);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      // O tipo do Firestore é mais genérico, então fazemos um cast aqui.
      return docSnap.data() as UrbanAfforestationSettings;
    } else {
      console.warn(`Documento de configurações '${docName}' não encontrado.`);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar configurações de Arborização Urbana:", error);
    // Lançar o erro permite que páginas do servidor (RSC) lidem com isso (ex: página de erro).
    throw new Error("Não foi possível carregar as configurações do setor.");
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
