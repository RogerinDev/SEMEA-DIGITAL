
// src/lib/firebase/client.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from "@/config/firebase";

// This is a critical check for the client-side Firebase configuration.
if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
  // Log an error to the console, but don't throw, as this can crash the server in some environments.
  // The check in config/firebase.ts will also log this error.
  console.error("CRITICAL FIREBASE CONFIG ERROR: Firebase configuration is missing. The app will not work correctly.");
}

let app: FirebaseApp;
let db: Firestore;

// Add the databaseURL to the config
const fullFirebaseConfig = {
    ...FIREBASE_CONFIG,
    databaseURL: "https://semeabd.firebaseio.com",
};

// Initialize Firebase
// This check prevents re-initialization on hot reloads
if (getApps().length === 0) {
  app = initializeApp(fullFirebaseConfig);
} else {
  app = getApp();
}

// Initialize Firebase services after ensuring the app is initialized.
const auth: Auth = getAuth(app);
const storage = getStorage(app);
db = getFirestore(app);


export { app, auth, db, storage };
