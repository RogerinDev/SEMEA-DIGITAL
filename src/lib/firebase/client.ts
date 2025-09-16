/**
 * @fileoverview Configuração e inicialização do Firebase SDK para o lado do cliente.
 * Este arquivo é responsável por inicializar o Firebase no navegador do usuário,
 * permitindo que os componentes do React interajam com serviços como Auth, Firestore e Storage.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import type { FirebaseOptions } from "firebase/app";

// Lê as variáveis de ambiente e monta o objeto de configuração.
const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Variável para armazenar a instância do aplicativo Firebase.
let app: FirebaseApp;

// Inicializa o Firebase.
// A verificação `getApps().length === 0` impede a reinicialização do app
// em cenários de hot-reloading durante o desenvolvimento, o que causaria erros.
if (getApps().length === 0) {
  if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
    throw new Error("CRITICAL FIREBASE CONFIG ERROR: Firebase configuration is missing in environment variables. The app cannot start.");
  }
  app = initializeApp(FIREBASE_CONFIG);
} else {
  // Se o app já estiver inicializado, apenas o obtém.
  app = getApp();
}

// Inicializa os serviços individuais do Firebase, associando-os ao app principal.
const auth: Auth = getAuth(app); // Serviço de autenticação.
const storage = getStorage(app); // Serviço de armazenamento de arquivos (Cloud Storage).
const db: Firestore = getFirestore(app); // Serviço de banco de dados (Cloud Firestore).


// Exporta as instâncias dos serviços para serem usadas em toda a aplicação cliente.
export { app, auth, db, storage };
