'use server';

import { getFunctions, httpsCallable } from "firebase/functions";
import { type Department, type UserRole } from "@/types";
import { app, FIREBASE_REGION } from "@/lib/firebase/client";

// Initialize functions, specifying the region
const functions = getFunctions(app, FIREBASE_REGION);

// Create a callable function reference
const setAdminRoleCallable = httpsCallable<{ email: string; department: Department; role: UserRole }, { message: string }>(functions, 'setAdminRole');

interface SetAdminRoleData {
    email: string;
    department: Department;
    role: UserRole;
}

export async function setAdminRoleAction(data: SetAdminRoleData): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!data.email || !data.department || !data.role) {
    return { success: false, error: "Dados inválidos fornecidos." };
  }

  try {
    const result = await setAdminRoleCallable(data);
    return { success: true, message: result.data.message };
  } catch (error: any) {
    console.error("Error calling setAdminRole function:", error);
    // Provide more specific error feedback based on the error code from Firebase Functions
    if (error.code === 'functions/permission-denied') {
        return { success: false, error: "Permissão negada. Apenas Super Admins podem executar esta ação." };
    }
     if (error.code === 'functions/invalid-argument') {
        return { success: false, error: "Argumentos inválidos. Verifique o e-mail e o departamento." };
    }
    if (error.code === 'functions/not-found') {
        return { success: false, error: "A função de administração não foi encontrada (not-found). Verifique se a Cloud Function 'setAdminRole' foi implantada corretamente no Firebase." };
    }
    // Firebase callable function errors often have a 'message' property with user-friendly text
    return { success: false, error: error.message || "Ocorreu um erro desconhecido ao chamar a função." };
  }
}
