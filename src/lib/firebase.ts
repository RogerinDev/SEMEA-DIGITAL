
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

let firebaseConfigValues: FirebaseOptions | null = null;

// Log para depuração da disponibilidade das variáveis de ambiente
// console.log("Attempting to load Firebase config...");
// console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
// console.log("FIREBASE_WEBAPP_CONFIG env var:", process.env.FIREBASE_WEBAPP_CONFIG ? "Exists" : "Does not exist");

// 1. Tentar carregar a partir da variável de ambiente FIREBASE_WEBAPP_CONFIG (string JSON injetada pelo Firebase App Hosting)
if (process.env.FIREBASE_WEBAPP_CONFIG) {
  try {
    const parsedConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
    if (parsedConfig.projectId) {
      firebaseConfigValues = {
        apiKey: parsedConfig.apiKey,
        authDomain: parsedConfig.authDomain,
        projectId: parsedConfig.projectId,
        storageBucket: parsedConfig.storageBucket,
        messagingSenderId: parsedConfig.messagingSenderId,
        appId: parsedConfig.appId,
        measurementId: parsedConfig.measurementId, // Adicionado por precaução, se existir
      };
      // console.log("Loaded Firebase config from FIREBASE_WEBAPP_CONFIG:", firebaseConfigValues);
    } else {
      // console.error("Parsed FIREBASE_WEBAPP_CONFIG from environment variable is missing projectId.");
    }
  } catch (error) {
    // console.error("Failed to parse FIREBASE_WEBAPP_CONFIG from environment variable:", error);
  }
}

// 2. Se não carregou de FIREBASE_WEBAPP_CONFIG, tentar carregar de variáveis NEXT_PUBLIC_ (para desenvolvimento local ou outros ambientes)
if (!firebaseConfigValues &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
) {
  firebaseConfigValues = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Adicionado por precaução
  };
  // console.log("Loaded Firebase config from NEXT_PUBLIC_ variables:", firebaseConfigValues);
}

if (!firebaseConfigValues || !firebaseConfigValues.projectId) {
  // console.error("Firebase configuration is critically missing or incomplete. Check environment variables.");
  throw new Error(
    "Firebase configuration is critically missing or incomplete. " +
    "Ensure NEXT_PUBLIC_FIREBASE_... variables are correctly set (e.g., in .env files or via build environment settings), " +
    "or that the FIREBASE_WEBAPP_CONFIG environment variable is correctly injected and parsable by the build system."
  );
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfigValues) : getApp();
const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

export { app, auth /*, db, storage */ };
