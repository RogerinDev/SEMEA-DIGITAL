
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfigValues: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Opcional
};

// This is the most important check. If the API key is missing, Firebase cannot work.
if (!firebaseConfigValues.apiKey) {
  const errorMessage = "CRITICAL FIREBASE CONFIG ERROR: NEXT_PUBLIC_FIREBASE_API_KEY is missing or undefined.\n" +
    "This means your '.env.local' file is likely missing, misconfigured, or you haven't restarted your Next.js development server.\n" +
    "Please ensure you have a '.env.local' file in your project root with your real Firebase credentials, and that all variable names start with 'NEXT_PUBLIC_'.\n" +
    "After creating/updating the '.env.local' file, YOU MUST RESTART your Next.js development server.";
  
  // Log to both server and client consoles
  console.error(errorMessage);
  
  // Throw an error to stop the application from loading further with a broken configuration.
  throw new Error(errorMessage);
}


let app: FirebaseApp;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfigValues);
  } else {
    app = getApp();
  }
} catch (e: any) {
  console.error("Firebase critical initialization error caught:", e.message);
  // Re-throw to ensure the application does not proceed with a misconfigured Firebase instance.
  throw new Error(`Firebase initialization failed: ${e.message}. Review console logs for details.`);
}

// Initialize Firebase services after ensuring the app is initialized.
const auth: Auth = getAuth(app);
const storage = getStorage(app);

// const db = getFirestore(app);

export { app, auth, storage };
