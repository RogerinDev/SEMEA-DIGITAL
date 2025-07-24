
import { config } from 'dotenv';
config(); // Carrega as variáveis de ambiente do arquivo .env

import * as admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';

// Variáveis de ambiente para o Admin SDK
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let dbAdmin: Firestore;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return;
  }

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
      console.error('Firebase Admin Initialization Error:', error.stack);
      throw error; // Rethrow to prevent proceeding with a failed init
    }
  } else {
    const errorMsg = 'CRITICAL: Firebase Admin SDK credentials not found. Ensure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set in your .env.local file.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Gets the Firestore admin instance, initializing the app if necessary.
 * This lazy-initialization approach prevents race conditions in serverless environments.
 * @returns The Firestore admin instance.
 */
export function getDbAdmin() {
  initializeAdminApp();
  if (!dbAdmin) {
    dbAdmin = admin.firestore();
  }
  return dbAdmin;
}

/**
 * Gets the Auth admin instance, initializing the app if necessary.
 * @returns The Auth admin instance.
 */
export function getAuthAdmin() {
    initializeAdminApp();
    return admin.auth();
}

export { admin };
