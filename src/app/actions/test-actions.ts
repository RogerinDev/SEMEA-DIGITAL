/**
 * @fileoverview Server Action de teste para diagnosticar problemas de escrita no Firestore.
 */

'use server';

import { getFirebaseAdmin } from "@/lib/firebase/admin";

/**
 * Tenta escrever um documento simples em uma coleção de teste no Firestore.
 * @returns Um objeto com o status da operação e o ID do documento criado ou uma mensagem de erro.
 */
export async function testWriteAction(): Promise<{ success: boolean; id?: string; error?: string; }> {
  console.log("Executando testWriteAction no servidor...");
  try {
    const { db } = getFirebaseAdmin();
    const testCollectionRef = db.collection("test_collection");
    const docRef = testCollectionRef.doc(); // Gera um novo ID
    
    await docRef.set({
      message: "Hello World from Server Action!",
      createdAt: new Date().toISOString(),
    });

    const successMessage = `Sucesso! Documento criado com ID: ${docRef.id}`;
    console.log(successMessage);
    return { success: true, id: docRef.id };

  } catch (error: any) {
    console.error("Erro na testWriteAction:", error);
    return { success: false, error: error.message || "Erro desconhecido ao escrever no Firestore." };
  }
}
