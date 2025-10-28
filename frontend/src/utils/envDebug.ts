// src/utils/envDebug.ts
// Minimal debug helper to verify Vite env at runtime in the browser.
// When VITE_DEBUG_UPLOADS=true, logs key Firebase vars and exposes them on window.__ENV

declare global {
  interface Window {
    __ENV?: any;
  }
}

const env: any = (import.meta as any).env || {};

if (env.VITE_DEBUG_UPLOADS) {
  try {
    // eslint-disable-next-line no-console
    console.log('[env][vite]', {
      MODE: env.MODE,
      BASE_URL: env.BASE_URL,
      FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET,
    });
    window.__ENV = env;
  } catch {}
}

