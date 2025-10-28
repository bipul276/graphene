// src/components/utils/firebase.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage
} from 'firebase/storage';

let app: FirebaseApp | null = null;
let storage: FirebaseStorage | null = null;

const FALLBACK = {
  apiKey: 'AIzaSyCCYkNH2i01BJE7GisHqmLOyhb4m0xGtw8',
  authDomain: 'graphene-d5235.firebaseapp.com',
  projectId: 'graphene-d5235',
  storageBucket: 'graphene-d5235.firebasestorage.app',
  messagingSenderId: '999988873623',
  appId: '1:999988873623:web:4df06c3906cb815ce99cd2',
  measurementId: 'G-D21Y8CZZY8',
};

function getEnv(key: string): string | undefined {
  // Vite exposes env on import.meta.env
  return (import.meta as any)?.env?.[key];
}

function normalizeBucket(bucket: string, projectId: string | undefined) {
  const trimmed = (bucket || '').trim();
  if (!trimmed) return '';

  // Accept gs:// prefix
  const noGs = trimmed.replace(/^gs:\/\//i, '');

  // Accept either *.appspot.com or *.firebasestorage.app
  if (/\.appspot\.com$/i.test(noGs)) return noGs;
  if (/\.firebasestorage\.app$/i.test(noGs)) {
    // Firebase SDK can use the *.firebasestorage.app bucket directly
    return noGs;
  }

  // If someone pasted only the project id by mistake, normalize it
  if (projectId && noGs === projectId) return `${projectId}.firebasestorage.app`;

  return noGs;
}

function ensureFirebase() {
  if (app && storage) return { app, storage };

  const cfg = {
    apiKey: getEnv('VITE_FIREBASE_API_KEY') || FALLBACK.apiKey,
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || FALLBACK.authDomain,
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || FALLBACK.projectId,
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || FALLBACK.storageBucket,
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || FALLBACK.messagingSenderId,
    appId: getEnv('VITE_FIREBASE_APP_ID') || FALLBACK.appId,
    measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID') || FALLBACK.measurementId,
  };

  const debug = String(getEnv('VITE_DEBUG_UPLOADS') || '').toLowerCase() === 'true';

  // Normalize bucket
  const bucket = normalizeBucket(cfg.storageBucket, cfg.projectId);
  if (!bucket) {
    if (debug) {
      console.error('[upload][init] Missing bucket. Env keys present:',
        Object.keys((import.meta as any)?.env || {}).filter(k => k.startsWith('VITE_FIREBASE_')));
    }
    throw new Error('Firebase storage bucket not configured');
  }

  app = initializeApp(cfg);
  storage = getStorage(app, `gs://${bucket}`);

  if (debug) {
    console.log('[upload][init]', {
      projectId: cfg.projectId,
      storageBucketConfigured: cfg.storageBucket,
      bucketUsed: bucket,
    });
  }

  return { app, storage };
}

async function ensureAnonAuthIfEnabled() {
  const enabled = String(getEnv('VITE_ENABLE_ANON_AUTH') || '').toLowerCase() === 'true';
  if (!enabled) return;
  const { app } = ensureFirebase();
  const auth = getAuth(app);
  const debug = String(getEnv('VITE_DEBUG_UPLOADS') || '').toLowerCase() === 'true';
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
      if (debug) {
        const uid = (auth.currentUser as any)?.uid;
        console.log('[upload][auth] signed in anonymously', { uid });
      }
    } else if (debug) {
      const uid = (auth.currentUser as any)?.uid;
      console.log('[upload][auth] already authenticated', { uid });
    }
  } catch (e) {
    if (debug) console.error('[upload][auth] anonymous sign-in failed', e);
    throw e;
  }
}

export async function uploadInstitutionLogo(
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ logoUrl: string; logoStoragePath: string }> {
  await ensureAnonAuthIfEnabled();
  const { storage } = ensureFirebase();

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const pickImageMime = () => {
    if (file.type && file.type.startsWith('image/')) return file.type;
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'svg':
        return 'image/svg+xml';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/bmp';
      case 'ico':
        return 'image/x-icon';
      case 'tif':
      case 'tiff':
        return 'image/tiff';
      case 'avif':
        return 'image/avif';
      default:
        return 'image/jpeg';
    }
  };
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  const ts = Date.now();
  const storagePath = `logos/${ts}-${rand}.${ext}`;
  const objectRef = ref(storage, storagePath);

  const debug = String(getEnv('VITE_DEBUG_UPLOADS') || '').toLowerCase() === 'true';
  if (debug) console.log('[upload][start]', { storagePath, size: file.size, type: file.type });

  const task = uploadBytesResumable(objectRef, file, { contentType: pickImageMime(), cacheControl: 'public, max-age=31536000, immutable' });
  await new Promise<void>((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        if (debug) console.log('[upload][progress]', { pct, transferred: snap.bytesTransferred, total: snap.totalBytes, state: snap.state });
        onProgress?.(pct);
      },
      (err) => {
        if (debug) console.error('[upload][error]', err);
        reject(err);
      },
      () => resolve()
    );
  });

  const logoUrl = await getDownloadURL(objectRef);
  if (debug) console.log('[upload][done]', { storagePath, logoUrl });
  return { logoUrl, logoStoragePath: storagePath };
}
