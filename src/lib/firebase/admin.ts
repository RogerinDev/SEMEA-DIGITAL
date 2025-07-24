// src/lib/firebase/admin.ts
import { config } from 'dotenv';
config(); // Carrega as variáveis de ambiente do arquivo .env

import * as admin from 'firebase-admin';

// Variáveis de ambiente para o Admin SDK
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Evitar reinicialização em ambientes de desenvolvimento (hot-reloading)
if (!admin.apps.length) {
  if (privateKey && clientEmail && projectId) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error: any) {
        console.error('Firebase Admin Initialization Error:', error.message);
    }
  } else {
    // Adiciona um log de erro mais claro se as credenciais não forem encontradas
    console.error(
      'CRITICAL: Firebase Admin SDK credentials not found. Ensure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set in your .env file.'
    );
  }
}

export const dbAdmin = admin.firestore();
export { admin };
