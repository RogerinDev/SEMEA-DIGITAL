/**
 * @fileoverview Configuração e inicialização do Firebase SDK para o lado do cliente.
 * Este arquivo é responsável por inicializar o Firebase no navegador do usuário,
 * permitindo que os componentes do React interajam com serviços como Auth, Firestore e Storage.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from "@/config/firebase";

// Verificação crítica para garantir que as configurações do Firebase estejam presentes.
// Sem essas configurações, o aplicativo não funcionará.
if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
  console.error("CRITICAL FIREBASE CONFIG ERROR: Firebase configuration is missing. The app will not work correctly.");
}

// Variável para armazenar a instância do aplicativo Firebase.
let app: FirebaseApp;

// Adiciona a `databaseURL` ao objeto de configuração.
// Isso pode ser necessário para garantir a compatibilidade com todos os serviços do Firebase.
const fullFirebaseConfig = {
    ...FIREBASE_CONFIG,
    databaseURL: `https://${FIREBASE_CONFIG.projectId}.firebaseio.com`,
};

// Inicializa o Firebase.
// A verificação `getApps().length === 0` impede a reinicialização do app
// em cenários de hot-reloading durante o desenvolvimento, o que causaria erros.
if (getApps().length === 0) {
  app = initializeApp(fullFirebaseConfig);
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
