import * as admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';

let dbAdmin: Firestore;

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This function is designed to be safe to call multiple times.
 * It relies on the GOOGLE_APPLICATION_CREDENTIALS environment variable 
 * being set in the deployment environment.
 */
function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return;
  }
  try {
    // initializeApp() without arguments will use the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable, which is the standard way in Google Cloud environments.
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.stack);
    // In a server environment, this is a critical error.
    // We throw to prevent the application from continuing in a broken state.
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

export { admin };
