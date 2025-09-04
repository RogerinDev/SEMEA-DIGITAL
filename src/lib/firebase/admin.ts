import * as admin from 'firebase-admin';

// This function ensures that we initialize the app only once
// and that we return a ready-to-use Firestore instance.
export function getDbAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      // The service account credentials will be automatically
      // discovered by the Firebase Admin SDK in the production environment.
    });
  }
  return admin.firestore();
}

// This function is kept for auth-related operations on the server if needed.
export function getAuthAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return admin.auth();
}
