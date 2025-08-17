// src/lib/firebase/client.ts
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

export const FIREBASE_REGION = "southamerica-east1";

const firebaseConfigValues: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Opcional
};

// This is a critical check for the client-side Firebase configuration.
if (!firebaseConfigValues.apiKey || !firebaseConfigValues.projectId) {
  const errorMessage = "CRITICAL FIREBASE CONFIG ERROR: Required public environment variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY) are missing.\n" +
    "Please ensure you have a '.env.local' file in your project root with your Firebase web app credentials.\n" +
    "After creating/updating the file, YOU MUST RESTART your Next.js development server.";
  
  // This error will be thrown during the build process on the server if variables are missing,
  // or in the browser console.
  throw new Error(errorMessage);
}


let app: FirebaseApp;
let db: Firestore;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfigValues);
  } else {
    app = getApp();
  }
} catch (e: any) {
  console.error("Firebase client initialization error caught:", e.message);
  throw new Error(`Firebase client initialization failed: ${e.message}. Review console logs for details.`);
}

// Initialize Firebase services after ensuring the app is initialized.
const auth: Auth = getAuth(app);
const storage = getStorage(app);
db = getFirestore(app);


export { app, auth, db, storage };
