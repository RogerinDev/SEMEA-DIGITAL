
import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

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
      "CRITICAL Firebase Initialization Warning: Missing API Key or Project ID.\n" +
      "This means your '.env.local' file is likely missing, misconfigured, or you haven't restarted your Next.js development server.\n" +
      "Please ensure you have a '.env.local' file in your project root with the following Firebase credentials (replace YOUR_... with actual values):\n" +
      "NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY\n" +
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN\n" +
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID\n" +
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET\n" +
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID\n" +
      "NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID\n" +
      "After creating/updating '.env.local', YOU MUST RESTART your Next.js development server."
    );
  }
}

let app: FirebaseApp;

try {
  // Explicitly check for required config values before attempting to initialize
  if (!firebaseConfigValues.apiKey || !firebaseConfigValues.projectId) {
    const errorMessage = `Firebase configuration is critically missing. API Key: '${firebaseConfigValues.apiKey}', Project ID: '${firebaseConfigValues.projectId}'. ` +
                         "Please verify your '.env.local' file and ensure your Next.js development server has been restarted after any changes.";
    console.error("CRITICAL FIREBASE CONFIG ERROR (Pre-initialization):", errorMessage);
    // Throw an error to prevent the application from proceeding with a misconfigured Firebase.
    // This might not be caught by the user's application structure but will be very visible in logs.
    // The Firebase SDK itself will likely throw `auth/configuration-not-found` or similar if we proceed.
    // For a user-facing app, you might want a more graceful fallback UI here.
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfigValues);
  } else {
    app = getApp();
  }
} catch (e: any) {
  console.error("Firebase critical initialization error caught:", e.message);
  if (e.message && e.message.includes("FIREBASE_API_KEY") && e.message.includes("undefined")) {
      console.error("The error message suggests NEXT_PUBLIC_FIREBASE_API_KEY is undefined. Check your .env.local file and restart the server.");
  } else if (!firebaseConfigValues.apiKey) {
      console.error("NEXT_PUBLIC_FIREBASE_API_KEY seems to be missing from your environment variables. Check .env.local and restart the server.");
  }
  // Re-throw the error so the application knows initialization failed.
  // Avoids proceeding with a non-functional Firebase instance.
  throw new Error(`Firebase initialization failed: ${e.message}. Review console logs for details, check .env.local, and restart your server.`);
}

// Initialize Firebase services after ensuring the app is initialized.
// If 'app' is not initialized correctly, getAuth(app) will also fail.
let auth: Auth;
try {
    auth = getAuth(app);
} catch (e: any) {
    console.error("Failed to get Firebase Auth instance:", e.message);
    console.error("This usually happens if Firebase app initialization failed earlier. Check previous logs.");
    throw new Error(`Failed to get Firebase Auth instance: ${e.message}. Ensure Firebase app initialized correctly.`);
}

// const db = getFirestore(app);
// const storage = getStorage(app);

export { app, auth /*, db, storage */ };

    