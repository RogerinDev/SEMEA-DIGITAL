
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// As variáveis NEXT_PUBLIC_ são injetadas pelo processo de build do Next.js no cliente.
// Se elas não estiverem definidas pelo Firebase Studio / App Hosting, a inicialização do Firebase falhará.
const firebaseConfigValues: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Opcional
};

// Client-side check and warning for missing essential Firebase config
if (typeof window !== 'undefined') { // Run only on the client-side
  if (!firebaseConfigValues.apiKey || !firebaseConfigValues.projectId) {
    console.error(
      "Firebase Initialization Warning: Missing API Key or Project ID.\n" +
      "Please ensure you have a '.env.local' file in your project root with the following Firebase credentials:\n" +
      "NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY\n" +
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN\n" +
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID\n" +
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET\n" +
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID\n" +
      "NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID\n" +
      "Replace 'YOUR_...' with your actual Firebase project values.\n" +
      "After creating/updating '.env.local', YOU MUST RESTART your Next.js development server."
    );
  }
}


// O SDK do Firebase fará suas próprias verificações e lançará um erro se a configuração estiver inadequada.
// Por exemplo, se apiKey ou projectId estiverem faltando.
// Se firebaseConfigValues.apiKey ou firebaseConfigValues.projectId forem undefined aqui, o initializeApp falhará.

let app;
let authInstance; // Renamed to avoid conflict with the export

try {
  app = !getApps().length ? initializeApp(firebaseConfigValues) : getApp();
  authInstance = getAuth(app);
} catch (error) {
  console.error("Firebase critical initialization error:", error);
  // This error often masks the real issue if config is missing,
  // The console warning above should give a better clue.
  // You might want to display a user-friendly message on the UI if Firebase fails to load
}

// const db = getFirestore(app);
// const storage = getStorage(app);

// Export authInstance as auth
export { app, authInstance as auth /*, db, storage */ };
