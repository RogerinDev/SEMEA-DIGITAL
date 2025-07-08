
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
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
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    await addDoc(collection(db, 'lost_found_posts'), {
      ...data,
      date: new Date(data.date).toISOString(), // Ensure date is stored consistently
      dateCreated: new Date(),
      dateExpiration: Timestamp.fromDate(expirationDate), // Store as Firestore Timestamp
      status: 'ativo',
    });
    
    revalidatePath('/animal-welfare/lost-found');

    return { success: true };
  } catch (error: any) {
    console.error("Error adding lost/found post: ", error);
    return { success: false, error: error.message };
  }
}

export async function getActiveLostFoundPostsAction(): Promise<LostFoundAnimal[]> {
  try {
    const q = query(
      collection(db, "lost_found_posts"),
      where("status", "==", "ativo"),
      where("dateExpiration", ">=", new Date()), // Only fetch non-expired posts
      orderBy("dateExpiration", "asc"), // Show posts closer to expiration first
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
        dateCreated: (data.dateCreated as Timestamp)?.toDate().toISOString(),
        dateExpiration: (data.dateExpiration as Timestamp)?.toDate().toISOString(),
      });
    });
    return posts;
  } catch (error) {
    console.error("Error fetching lost/found posts: ", error);
    return [];
  }
}
