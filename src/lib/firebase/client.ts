/**
 * @fileoverview Configuração e inicialização do Firebase SDK para o lado do cliente.
 * Este arquivo é responsável por inicializar o Firebase no navegador do usuário,
 * permitindo que os componentes do React interajam com serviços como Auth, Firestore e Storage.
 * Ele usa um padrão para garantir que a inicialização ocorra apenas uma vez.
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

// Variáveis para armazenar as instâncias dos serviços Firebase.
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: any; // Usando 'any' para evitar problemas de tipo com a exportação

/**
 * Função que inicializa o Firebase se ainda não foi inicializado.
 * Este padrão singleton é crucial para evitar erros no Next.js com Fast Refresh.
 */
function initializeAppIfNecessary() {
  if (getApps().length === 0) {
    if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
      throw new Error("CRITICAL FIREBASE CONFIG ERROR: Firebase configuration is missing in environment variables. The app cannot start.");
    }
    app = initializeApp(FIREBASE_CONFIG);
  } else {
    app = getApp();
  }
  
  // Obtém as instâncias dos serviços após garantir que o app está inicializado.
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// Executa a inicialização
initializeAppIfNecessary();

// Exporta as instâncias dos serviços para serem usadas em toda a aplicação cliente.
export { app, auth, db, storage };
