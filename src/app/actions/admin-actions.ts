/**
 * @fileoverview Server Action para interagir com as Cloud Functions de administração.
 * Este arquivo centraliza a lógica para chamar a função `setAdminRole` do Firebase,
 * permitindo que um superAdmin atribua papéis e departamentos a outros usuários.
 */

'use server';

import { getFunctions, httpsCallable } from "firebase/functions";
import { type Department, type UserRole } from "@/types";
import { app } from "@/lib/firebase/client"; // Importa a instância do app Firebase do cliente.
import { FIREBASE_REGION } from "@/config/firebase"; // Importa a região configurada.

// Inicializa o serviço do Firebase Functions, especificando a região para garantir
// que a chamada seja direcionada para o local correto onde a função foi implantada.
const functions = getFunctions(app, FIREBASE_REGION);

// Cria uma referência tipada para a função "callable" `setAdminRole`.
// Isso fornece autocompletar e verificação de tipos para os dados de entrada e saída.
const setAdminRoleCallable = httpsCallable<{ email: string; department: Department; role: UserRole }, { message: string }>(functions, 'setAdminRole');

// Interface que define a estrutura dos dados necessários para a ação.
interface SetAdminRoleData {
    email: string;
    department: Department;
    role: UserRole;
}

/**
 * Server Action que invoca a Cloud Function `setAdminRole` para promover um usuário.
 * @param data Os dados do usuário a ser promovido, incluindo email, departamento e papel.
 * @returns Um objeto indicando o sucesso ou falha da operação, com uma mensagem correspondente.
 */
export async function setAdminRoleAction(data: SetAdminRoleData): Promise<{ success: boolean; message?: string; error?: string }> {
  // Validação de entrada para garantir que os dados essenciais não são nulos ou vazios.
  if (!data.email || !data.department || !data.role) {
    return { success: false, error: "Dados inválidos fornecidos." };
  }

  try {
    // Chama a Cloud Function com os dados fornecidos.
    const result = await setAdminRoleCallable(data);
    // Retorna um objeto de sucesso com a mensagem retornada pela função.
    return { success: true, message: result.data.message };
  } catch (error: any) {
    console.error("Error calling setAdminRole function:", error);

    // Retorna a mensagem de erro exata da função callable, que geralmente é amigável,
    // ou uma mensagem de erro genérica se nenhuma outra condição for atendida.
    return { success: false, error: error.message || "Ocorreu um erro desconhecido ao chamar a função." };
  }
}
