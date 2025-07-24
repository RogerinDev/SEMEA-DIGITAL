'use server';

import { getFunctions, httpsCallable } from "firebase/functions";
import { type Department, type UserRole } from "@/types";
import { app, FIREBASE_REGION } from "@/lib/firebase";

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
    if (error.code === 'functions/not-found') {
        return { success: false, error: "A função de administração não foi encontrada (not-found). Verifique se a Cloud Function 'setAdminRole' foi implantada corretamente no Firebase." };
    }
    // Firebase callable function errors have a 'message' property
    return { success: false, error: error.message || "Ocorreu um erro desconhecido ao chamar a função." };
  }
}
