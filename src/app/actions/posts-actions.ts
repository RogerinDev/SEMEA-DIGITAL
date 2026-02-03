/**
 * @fileoverview Server Actions para gerenciar a coleção de notícias (posts) no Firestore.
 */

'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import type { Post, Department } from '@/types';
import { revalidatePath } from 'next/cache';
import type admin from 'firebase-admin';

// Helper para converter texto em slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normaliza para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por -
    .replace(/[^\w-]+/g, '') // Remove caracteres não alfanuméricos (exceto -)
    .replace(/--+/g, '-'); // Remove hífens duplicados
}

/**
 * Converte Timestamps do Firestore em strings ISO para um objeto de Post.
 */
function mapPostData(doc: admin.firestore.DocumentSnapshot): Post {
    const data = doc.data() as Omit<Post, 'id' | 'date'> & { date: admin.firestore.Timestamp };
    return {
        id: doc.id,
        ...data,
        date: data.date.toDate().toISOString(),
    } as Post;
}

interface GetPostsParams {
  sector?: Department;
  limit?: number;
  activeOnly?: boolean; // Novo parâmetro de filtro
}

/**
 * Busca posts do Firestore, com filtros opcionais.
 */
export async function getPosts({ sector, limit, activeOnly = false }: GetPostsParams): Promise<Post[]> {
  const { db } = getFirebaseAdmin();
  try {
    let query: admin.firestore.Query = db.collection('posts');

    if (activeOnly) {
      query = query.where('active', '==', true);
    }
    
    if (sector) {
      query = query.where('sector', '==', sector);
    }

    query = query.orderBy('date', 'desc');

    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(mapPostData);
  } catch (error) {
    console.error("Error fetching posts: ", error);
    return [];
  }
}

/**
 * Busca um único post pelo seu ID de documento.
 */
export async function getPostById(id: string): Promise<Post | null> {
    const { db } = getFirebaseAdmin();
    try {
        const doc = await db.collection('posts').doc(id).get();
        if (!doc.exists) return null;
        return mapPostData(doc);
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        return null;
    }
}

/**
 * Busca um único post pelo seu slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
    const { db } = getFirebaseAdmin();
    try {
        const query = db.collection('posts').where('slug', '==', slug).limit(1);
        const snapshot = await query.get();
        if (snapshot.empty) return null;
        // Adicionalmente, verifica se o post encontrado está ativo.
        const post = mapPostData(snapshot.docs[0]);
        if (!post.active) return null;
        return post;
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}


/**
 * Salva (cria ou atualiza) um post no Firestore.
 * A segurança é garantida pelas regras do Firestore.
 */
export async function savePost(data: Omit<Post, 'id' | 'slug' | 'date'> & { id?: string }): Promise<{ success: boolean; error?: string }> {
  const { db } = getFirebaseAdmin();
  const { id, ...postData } = data;

  try {
    const slug = slugify(postData.title);

    if (id) {
      // Atualizando post existente
      await db.collection('posts').doc(id).update({
        ...postData,
        slug,
      });
    } else {
      // Criando novo post
      await db.collection('posts').add({
        ...postData,
        slug,
        date: new Date().toISOString(),
      });
    }
    
    // Revalida o cache para refletir as mudanças
    revalidatePath('/');
    revalidatePath('/news');
    revalidatePath(`/news/${slug}`);
    revalidatePath('/dashboard/admin/posts');

    return { success: true };
  } catch (error: any) {
    console.error("Error saving post:", error);
    return { success: false, error: "Falha ao salvar a notícia. Verifique as permissões e os logs do servidor." };
  }
}

/**
 * Deleta um post do Firestore.
 */
export async function deletePost(id: string): Promise<{ success: boolean, error?: string }> {
    const { db } = getFirebaseAdmin();
    try {
        await db.collection('posts').doc(id).delete();
        
        revalidatePath('/');
        revalidatePath('/dashboard/admin/posts');

        return { success: true };
    } catch (error: any) {
        console.error("Error deleting post:", error);
        return { success: false, error: "Falha ao deletar a notícia." };
    }
}
