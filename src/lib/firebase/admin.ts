
import * as admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';

let dbAdmin: Firestore;
let authAdmin: Auth;

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This function is designed to be safe to call multiple times.
 */
function initializeAdminApp() {
  // Check if the app is already initialized to prevent errors
  if (admin.apps.length === 0) {
    // When deployed to Firebase/Google Cloud, the SDK automatically finds the default credentials.
    // No need to pass any config object.
    admin.initializeApp();
  }
  
  // Assign the firestore and auth instances after initialization
  // This ensures they are available for subsequent calls
  if (!dbAdmin) {
    dbAdmin = admin.firestore();
  }
  if (!authAdmin) {
    authAdmin = admin.auth();
  }
}

/**
 * Gets the Firestore admin instance, initializing the app if necessary.
 * @returns The Firestore admin instance.
 */
export function getDbAdmin(): Firestore {
  initializeAdminApp();
  return dbAdmin;
}

/**
 * Gets the Auth admin instance, initializing the app if necessary.
 * @returns The Auth admin instance.
 */
export function getAuthAdmin(): Auth {
  initializeAdminApp();
  return authAdmin;
}
