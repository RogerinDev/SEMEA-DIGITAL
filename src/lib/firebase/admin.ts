
import * as admin from 'firebase-admin';
import type { Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const dbAdmin: Firestore = admin.firestore();
const authAdmin: Auth = admin.auth();

export { dbAdmin, authAdmin };
