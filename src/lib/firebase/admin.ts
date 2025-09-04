
import * as admin from 'firebase-admin';

// This ensures we only initialize the app once.
if (!admin.apps.length) {
  admin.initializeApp();
}

const dbAdmin = admin.firestore();
const authAdmin = admin.auth();

export { dbAdmin, authAdmin };
