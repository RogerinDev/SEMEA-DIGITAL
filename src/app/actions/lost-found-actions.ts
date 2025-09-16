/**
 * @fileoverview Server Actions para gerenciar a coleção de animais perdidos e achados.
 * Contém a lógica para adicionar novos posts e buscar posts ativos.
 * Cada função garante a obtenção de uma instância de DB segura antes de operar.
 */

'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import { collection, getDocs, query, where, orderBy, addDoc } from 'firebase/firestore';
import type { LostFoundAnimal } from '@/types';
import { revalidatePath } from 'next/cache';

// Interface para os dados de um novo post, onde a data vem como string do formulário.
interface NewPostData extends Omit<LostFoundAnimal, 'id' | 'dateCreated' | 'dateExpiration'> {
  date: string; 
}

/**
 * Server Action para adicionar um novo registro de animal perdido ou encontrado.
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
        photoUrl: data.photoUrl ?? "", // Garante que photoUrl seja uma string vazia se nula.
        status: 'ativo' as const,
        citizenId: data.citizenId,
        date: new Date(data.date).toISOString(), // Converte a data do formulário para ISO string.
        dateCreated: new Date().toISOString(),
        dateExpiration: expirationDate.toISOString(),
    };

    // Adiciona o novo documento ao Firestore.
    const postsCollection = collection(db, 'lost_found_posts');
    await addDoc(postsCollection, newPost);
    
    // Invalida o cache da página de perdidos e achados para mostrar o novo post.
    revalidatePath('/animal-welfare/lost-found');

    return { success: true };
  } catch (error: any) {
    console.error("Error adding lost/found post: ", error);
    return { success: false, error: "Não foi possível salvar o registro: " + error.message };
  }
}

/**
 * Server Action para buscar todos os posts de animais perdidos e achados que estão ativos.
 * Um post é considerado ativo se seu status for 'ativo' e a data de expiração não tiver passado.
 * @returns Uma lista de posts ativos, ordenados pela data de expiração e criação.
 */
export async function getActiveLostFoundPostsAction(): Promise<LostFoundAnimal[]> {
  const { db } = getFirebaseAdmin();
  try {
    // Cria uma query para buscar posts que atendam aos critérios de "ativo" e "não expirado".
    const q = query(
      collection(db, "lost_found_posts"),
      where("status", "==", "ativo"),
      where("dateExpiration", ">=", new Date().toISOString()), // Filtra apenas posts não expirados.
      orderBy("dateExpiration", "asc"), // Ordena para mostrar os que expiram primeiro.
      orderBy("dateCreated", "desc") // Ordena os mais recentes primeiro dentro da mesma data de expiração.
    );

    // Executa a query.
    const querySnapshot = await getDocs(q);
    const posts: LostFoundAnimal[] = [];
    // Itera sobre os resultados e formata os dados.
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
      } as LostFoundAnimal);
    });
    return posts;
  } catch (error) {
    console.error("Error fetching lost/found posts: ", error);
    return [];
  }
}
