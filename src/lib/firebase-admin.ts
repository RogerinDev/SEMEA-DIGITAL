// src/lib/firebase-admin.ts
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
    console.warn(
      'Firebase Admin SDK credentials not found in environment variables. Server-side Firestore operations will fail.'
    );
  }
}

const dbAdmin = admin.firestore();

export { admin, dbAdmin };
