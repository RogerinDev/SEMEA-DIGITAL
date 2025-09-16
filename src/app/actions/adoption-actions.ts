/**
 * @fileoverview Server Actions para gerenciar a coleção de animais para adoção no Firestore.
 * Este arquivo contém a lógica do lado do servidor para adicionar novos animais
 * e buscar a lista de animais disponíveis.
 */

'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase-admin/firestore';
import type { AnimalForAdoption } from '@/types';
import { revalidatePath } from 'next/cache'; // Para invalidar o cache do Next.js e atualizar as páginas

// Define a estrutura de dados para um novo animal, omitindo campos gerados pelo servidor.
interface NewAnimalData extends Omit<AnimalForAdoption, 'id' | 'dateAdded'> {}

/**
 * Server Action para adicionar um novo animal à coleção 'animals_for_adoption'.
 * A função primeiro obtém uma instância segura do banco de dados antes de executar a operação.
 * @param data Os dados do novo animal a ser cadastrado.
 * @returns Um objeto indicando o sucesso ou falha da operação.
 */
export async function addAnimalForAdoptionAction(data: NewAnimalData): Promise<{ success: boolean; error?: string }> {
  const { db } = getFirebaseAdmin();
  try {
    // Cria o objeto completo do novo animal, incluindo a data de adição.
    const newAnimal: Omit<AnimalForAdoption, 'id'> = {
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        description: data.description,
        photoUrl: data.photoUrl,
        status: data.status,
        dateAdded: new Date().toISOString(), // Define a data atual como data de adição.
    };

    // Obtém a referência para a coleção no Firestore.
    const animalsCollection = collection(db, 'animals_for_adoption');
    // Adiciona o novo documento à coleção.
    await addDoc(animalsCollection, newAnimal);
    
    // Invalida o cache das páginas de adoção para que elas sejam re-renderizadas com os novos dados.
    revalidatePath('/animal-welfare/adoption');
    revalidatePath('/dashboard/admin/adoption');

    return { success: true };
  } catch (error: any) {
    console.error("Error adding animal for adoption: ", error);
    return { success: false, error: "Não foi possível salvar o registro do animal: " + error.message };
  }
}

/**
 * Server Action para buscar todos os animais para adoção, ordenados pela data de adição.
 * Obtém uma instância segura do banco de dados antes da consulta.
 * @returns Uma promessa que resolve com um array de objetos `AnimalForAdoption`.
 */
export async function getAnimalsForAdoptionAction(): Promise<AnimalForAdoption[]> {
  const { db } = getFirebaseAdmin();
  try {
    // Cria uma query para buscar os documentos na coleção, ordenando pelos mais recentes.
    const q = query(
      collection(db, "animals_for_adoption"),
      orderBy("dateAdded", "desc")
    );

    // Executa a query.
    const querySnapshot = await getDocs(q);
    const animals: AnimalForAdoption[] = [];
    // Itera sobre os resultados e formata os dados para o tipo esperado.
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
    return []; // Retorna um array vazio em caso de erro.
  }
}
