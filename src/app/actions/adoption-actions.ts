
'use server';

import { dbAdmin } from '@/lib/firebase/admin';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import type { AnimalForAdoption } from '@/types';
import { revalidatePath } from 'next/cache';

interface NewAnimalData extends Omit<AnimalForAdoption, 'id' | 'dateAdded'> {}

export async function addAnimalForAdoptionAction(data: NewAnimalData): Promise<{ success: boolean; error?: string }> {
  try {
    const newAnimal: Omit<AnimalForAdoption, 'id'> = {
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        description: data.description,
        photoUrl: data.photoUrl,
        status: data.status,
        dateAdded: new Date().toISOString(),
    };

    const animalsCollection = collection(dbAdmin, 'animals_for_adoption');
    await addDoc(animalsCollection, newAnimal);
    
    revalidatePath('/animal-welfare/adoption');
    revalidatePath('/dashboard/admin/adoption');

    return { success: true };
  } catch (error: any) {
    console.error("Error adding animal for adoption: ", error);
    return { success: false, error: "Não foi possível salvar o registro do animal: " + error.message };
  }
}

export async function getAnimalsForAdoptionAction(): Promise<AnimalForAdoption[]> {
  try {
    const q = query(
      collection(dbAdmin, "animals_for_adoption"),
      orderBy("dateAdded", "desc")
    );

    const querySnapshot = await getDocs(q);
    const animals: AnimalForAdoption[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      animals.push({
        id: doc.id,
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        description: data.description,
        photoUrl: data.photoUrl,
        status: data.status,
        dateAdded: data.dateAdded,
      } as AnimalForAdoption);
    });
    return animals;
  } catch (error) {
    console.error("Error fetching animals for adoption: ", error);
    return [];
  }
}
