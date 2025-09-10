/**
 * @fileoverview Configuração do Firebase para o lado do cliente.
 * Este arquivo lê as variáveis de ambiente (com prefixo NEXT_PUBLIC_)
 * e monta o objeto de configuração do Firebase que será usado para
 * inicializar o SDK do Firebase no navegador.
 */

import type { FirebaseOptions } from "firebase/app";

/**
 * Objeto de configuração do Firebase.
 * As variáveis são lidas do ambiente. É crucial que as variáveis de ambiente
 * públicas comecem com `NEXT_PUBLIC_` para que o Next.js as exponha ao cliente.
 */
export const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Opcional, para Google Analytics.
};

// Define a região do Firebase onde as funções de nuvem estão implantadas.
export const FIREBASE_REGION = "southamerica-east1";

/**
 * Verificação crítica de configuração.
 * Se as variáveis de ambiente essenciais (apiKey, projectId) não estiverem definidas,
 * um erro é logado no console. Isso ajuda a diagnosticar problemas de configuração
 * rapidamente durante o desenvolvimento.
 */
if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
  console.error(
    "CRITICAL FIREBASE CONFIG ERROR: Required public environment variables " +
    "(e.g., NEXT_PUBLIC_FIREBASE_API_KEY) are missing. Please ensure you have " +
    "a '.env.local' file in your project root with your Firebase web app credentials. " +
    "After creating/updating the file, YOU MUST RESTART your Next.js development server."
  );
}
