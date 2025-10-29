/**
 * @fileoverview Server Actions para gerenciar a coleção de animais perdidos e achados.
 * Contém a lógica para adicionar, buscar, moderar e gerenciar posts.
 */

'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { LostFoundAnimal, LostFoundStatus } from '@/types';
import { revalidatePath } from 'next/cache';
import type admin from 'firebase-admin';


// Interface para os dados de um novo post, onde a data vem como string do formulário.
interface NewPostData extends Omit<LostFoundAnimal, 'id' | 'dateCreated' | 'dateExpiration' | 'citizenId' | 'status'> {
  date: string; 
  citizenId: string; // Citizen ID is required
}

/**
 * Server Action para adicionar um novo registro de animal perdido ou encontrado.
 * O status é definido como 'pendente' para aguardar moderação.
 * @param data Os dados do novo post.
 * @returns Um objeto indicando sucesso ou falha da operação.
 */
export async function addLostFoundPostAction(data: NewPostData): Promise<{ success: boolean; error?: string }> {
  const { db } = getFirebaseAdmin();
  // Validação para garantir que o usuário está autenticado.
  if (!data.citizenId) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    // Define uma data de expiração para o post (30 dias a partir de hoje).
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    // Monta o objeto completo para o novo post.
    const newPost: Omit<LostFoundAnimal, 'id'> = {
        type: data.type,
        species: data.species,
        breed: data.breed ?? "",
        description: data.description,
        lastSeenLocation: data.lastSeenLocation,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        photoUrl: data.photoUrl ?? "",
        status: 'pendente', // NOVO: Status inicial é 'pendente'
        citizenId: data.citizenId,
        date: new Date(data.date).toISOString(),
        dateCreated: new Date().toISOString(),
        dateExpiration: expirationDate.toISOString(),
    };

    // Adiciona o novo documento ao Firestore.
    await db.collection('lost_found_posts').add(newPost);
    
    // Invalida o cache da página de perdidos e achados e a nova página do cidadão.
    revalidatePath('/animal-welfare/lost-found');
    revalidatePath('/dashboard/citizen/my-posts');

    return { success: true };
  } catch (error: any) {
    console.error("Error adding lost/found post: ", error);
    return { success: false, error: "Não foi possível salvar o registro: " + error.message };
  }
}

/**
 * Converte Timestamps do Firestore em strings ISO para um objeto de post.
 * @param doc O documento do Firestore.
 * @returns Os dados do post com datas como strings.
 */
function mapPostData(doc: admin.firestore.DocumentSnapshot): LostFoundAnimal {
    const data = doc.data() as any;
    return {
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate().toISOString() : data.date,
        dateCreated: data.dateCreated?.toDate ? data.dateCreated.toDate().toISOString() : data.dateCreated,
        dateExpiration: data.dateExpiration?.toDate ? data.dateExpiration.toDate().toISOString() : data.dateExpiration,
    } as LostFoundAnimal;
}


/**
 * Server Action para buscar posts APROVADOS de animais perdidos e achados.
 * Usado pela galeria pública.
 * @returns Uma lista de posts aprovados.
 */
export async function getApprovedLostFoundPostsAction(): Promise<LostFoundAnimal[]> {
  const { db } = getFirebaseAdmin();
  try {
    // CORRIGIDO: Busca apenas posts com status 'aprovado'.
    const q = db.collection("lost_found_posts")
      .where("status", "==", "aprovado")
      .orderBy("dateCreated", "desc");

    const querySnapshot = await q.get();
    const posts: LostFoundAnimal[] = querySnapshot.docs.map(mapPostData);
    return posts;
  } catch (error) {
    console.error("Error fetching approved lost/found posts: ", error);
    return [];
  }
}

/**
 * Server Action para buscar todos os posts de um cidadão específico.
 * @param citizenId O ID do cidadão (Firebase UID).
 * @returns Uma lista de posts do cidadão.
 */
export async function getLostFoundPostsByCitizenAction(citizenId: string): Promise<LostFoundAnimal[]> {
    const { db } = getFirebaseAdmin();
    if (!citizenId) return [];

    try {
        const q = db.collection("lost_found_posts")
            .where("citizenId", "==", citizenId)
            .orderBy("dateCreated", "desc");
        
        const querySnapshot = await q.get();
        return querySnapshot.docs.map(mapPostData);
    } catch (error) {
        console.error("Error fetching posts by citizen: ", error);
        return [];
    }
}

/**
 * Server Action para administradores buscarem posts com filtros.
 * @param filters - Objeto com filtros opcionais (status).
 * @returns Uma lista de posts para o painel de moderação.
 */
export async function getLostFoundPostsForAdminAction(filters: { status?: LostFoundStatus } = {}): Promise<LostFoundAnimal[]> {
    const { db } = getFirebaseAdmin();
    try {
        let query: admin.firestore.Query = db.collection("lost_found_posts");

        if (filters.status) {
            query = query.where("status", "==", filters.status);
        }

        query = query.orderBy("dateCreated", "desc");

        const querySnapshot = await query.get();
        return querySnapshot.docs.map(mapPostData);
    } catch (error) {
        console.error("Error fetching posts for admin: ", error);
        return [];
    }
}

/**
 * Server Action para atualizar o status de um post de perdido/achado.
 * @param postId O ID do post a ser atualizado.
 * @param newStatus O novo status a ser definido.
 * @returns Um objeto indicando sucesso ou falha da operação.
 */
export async function updateLostFoundPostStatusAction(postId: string, newStatus: LostFoundStatus): Promise<{ success: boolean; error?: string }> {
    const { db } = getFirebaseAdmin();
    if (!postId || !newStatus) {
        return { success: false, error: "ID do post e novo status são obrigatórios." };
    }

    try {
        const postRef = db.collection('lost_found_posts').doc(postId);
        await postRef.update({ status: newStatus });

        revalidatePath('/animal-welfare/lost-found');
        revalidatePath('/dashboard/admin/lost-found');
        revalidatePath('/dashboard/citizen/my-posts');

        return { success: true };
    } catch (error: any) {
        console.error("Error updating post status: ", error);
        return { success: false, error: "Não foi possível atualizar o status do post." };
    }
}
