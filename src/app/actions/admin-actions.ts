'use server';

import { getFunctions, httpsCallable } from "firebase/functions";
import { type Department, type UserRole } from "@/types";
import { app } from "@/lib/firebase";

// Initialize functions, specifying the region
const functions = getFunctions(app, 'southamerica-east1');

// Create a callable function reference
const setAdminRole = httpsCallable<{ email: string; department: Department; role: UserRole }, { message: string }>(functions, 'setAdminRole');

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
    const result = await setAdminRole(data);
    return { success: true, message: result.data.message };
  } catch (error: any) {
    console.error("Error calling setAdminRole function:", error);
    // Firebase callable function errors have a 'message' property
    return { success: false, error: error.message || "Ocorreu um erro desconhecido ao chamar a função." };
  }
}
