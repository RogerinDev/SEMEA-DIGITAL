
// src/config/firebase.ts
import type { FirebaseOptions } from "firebase/app";

/**
 * Firebase configuration object.
 * Reads environment variables and exports them for client-side use.
 * This file is the single source of truth for the Firebase config.
 */
export const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Opcional
};

export const FIREBASE_REGION = "southamerica-east1";

// This is a critical check for the client-side Firebase configuration.
if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
  console.error(
    "CRITICAL FIREBASE CONFIG ERROR: Required public environment variables " +
    "(e.g., NEXT_PUBLIC_FIREBASE_API_KEY) are missing. Please ensure you have " +
    "a '.env.local' file in your project root with your Firebase web app credentials. " +
    "After creating/updating the file, YOU MUST RESTART your Next.js development server."
  );
}
