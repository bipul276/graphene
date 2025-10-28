// backend/src/services/storage.js
import admin from 'firebase-admin';

let initialized = false;

function init() {
  if (initialized) return;
  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const gcloudPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
  // Use the bucket value exactly as provided (supports *.firebasestorage.app)
  const rawBucket = process.env.FIREBASE_STORAGE_BUCKET;
  let storageBucket = rawBucket;
  if (!storageBucket && projectId) storageBucket = `${projectId}.firebasestorage.app`;

  if (!admin.apps.length) {
    if (credJson) {
      const parsed = JSON.parse(credJson);
      admin.initializeApp({
        credential: admin.credential.cert(parsed),
        storageBucket,
      });
    } else if (gcloudPath) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket,
      });
    } else {
      throw new Error('Firebase Admin credentials not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.');
    }
  }
  initialized = true;
}

export function getBucket() {
  init();
  const bucket = admin.storage().bucket();
  return bucket;
}
