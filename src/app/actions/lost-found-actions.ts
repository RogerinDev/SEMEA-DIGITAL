
'use server';

import { getDbAdmin } from '@/lib/firebase/admin';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import type { LostFoundAnimal } from '@/types';
import { revalidatePath } from 'next/cache';

interface NewPostData extends Omit<LostFoundAnimal, 'id' | 'dateCreated' | 'dateExpiration'> {
  date: string; // The form sends a string
}

export async function addLostFoundPostAction(data: NewPostData): Promise<{ success: boolean; error?: string }> {
  if (!data.citizenId) {
    return { success: false, error: "Usuário não autenticado." };
  }

  try {
    const dbAdmin = getDbAdmin();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    const newPost: Omit<LostFoundAnimal, 'id'> = {
        type: data.type,
        species: data.species,
        breed: data.breed ?? "",
        description: data.description,
        lastSeenLocation: data.lastSeenLocation,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        photoUrl: data.photoUrl ?? "",
        status: 'ativo' as const,
        citizenId: data.citizenId,
        date: new Date(data.date).toISOString(),
        dateCreated: new Date().toISOString(),
        dateExpiration: expirationDate.toISOString(),
    };

    await dbAdmin.collection('lost_found_posts').add(newPost);
    
    revalidatePath('/animal-welfare/lost-found');

    return { success: true };
  } catch (error: any) {
    console.error("Error adding lost/found post: ", error);
    return { success: false, error: "Não foi possível salvar o registro: " + error.message };
  }
}

export async function getActiveLostFoundPostsAction(): Promise<LostFoundAnimal[]> {
  try {
    const dbAdmin = getDbAdmin();
    const q = query(
      collection(dbAdmin, "lost_found_posts"),
      where("status", "==", "ativo"),
      where("dateExpiration", ">=", new Date().toISOString()), // Only fetch non-expired posts
      orderBy("dateExpiration", "asc"),
      orderBy("dateCreated", "desc")
    );

    const querySnapshot = await getDocs(q);
    const posts: LostFoundAnimal[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        type: data.type,
        species: data.species,
        breed: data.breed,
        description: data.description,
        lastSeenLocation: data.lastSeenLocation,
        date: data.date,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        photoUrl: data.photoUrl,
        status: data.status,
        citizenId: data.citizenId,
        dateCreated: data.dateCreated,
        dateExpiration: data.dateExpiration,
      } as LostFoundAnimal);
    });
    return posts;
  } catch (error) {
    console.error("Error fetching lost/found posts: ", error);
    return [];
  }
}
