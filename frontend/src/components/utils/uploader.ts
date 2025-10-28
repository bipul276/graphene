// src/components/utils/uploader.ts
import { BASE_URL } from './api';

export async function uploadLogoViaBackend(file: File): Promise<{ logoUrl: string; logoStoragePath: string }> {
  const fd = new FormData();
  fd.append('file', file, file.name);
  const res = await fetch(`${BASE_URL}/upload/logo`, { method: 'POST', body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err?.error || 'Backend upload failed');
  }
  return res.json();
}

