import * as admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';

let dbAdmin: Firestore;

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This function is designed to be safe to call multiple times in a serverless environment.
 */
function initializeAdminApp() {
  // Check if the app is already initialized to prevent errors
  if (admin.apps.length > 0) {
    return;
  }
  
  // The SDK will automatically use the GOOGLE_APPLICATION_CREDENTIALS env var
  // in environments like Firebase Hosting, Cloud Run, etc.
  try {
     admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error);
    // This is a critical error in a server environment.
    throw new Error(`Firebase Admin SDK initialization failed: ${error.message}`);
  }
}

/**
 * Gets the Firestore admin instance, initializing the app if necessary.
 * This lazy-initialization approach prevents race conditions and ensures
 * the app is initialized before any Firestore operations are attempted.
 * @returns The Firestore admin instance.
 */
export function getDbAdmin(): Firestore {
  initializeAdminApp();
  // We check for the dbAdmin instance after ensuring the app is initialized.
  if (!dbAdmin) {
    dbAdmin = admin.firestore();
  }
  return dbAdmin;
}

/**
 * Gets the Auth admin instance, initializing the app if necessary.
 * @returns The Auth admin instance.
 */
export function getAuthAdmin() {
  initializeAdminApp();
  return admin.auth();
}

// Export the admin instance itself if needed for other purposes.
export { admin };
