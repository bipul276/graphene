/* src/components/utils/api.ts
   Aligns with how components use the API in strict TS mode. */

import { sha256File } from './crypto';

// Env
export const BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Types expected by components
export interface LoginResponse {
  token: string;
  institutionName: string;
  issuerId: string;
  logoUrl: string | null;
  email: string; // added for App.tsx localStorage restore
}

export interface RegisterRequest {
  institutionName: string;
  address: string;
  city: string;
  stateProvince: string;
  contactName: string;
  email: string;
  password: string;
  logoUrl?: string | null;
  logoStoragePath?: string | null;
}

export interface RegisterResponse {
  issuerId: string;
  institutionName: string;
  blockNumber: number;
  txHash: string;
  logoUrl: string | null;
  alreadyExisted: boolean;
}

export type TxType = 'CERTIFICATE_ISSUED' | 'INSTITUTION_REGISTERED';
export type TxStatus = 'CONFIRMED' | 'PENDING';

export interface LedgerTransaction {
  id: string;
  blockNumber: number;
  hash: string;
  certificateTitle: string;
  issuedBy: string;
  issuerId: string;
  timestamp: string; // ISO
  transactionType: TxType;
  status: TxStatus;
}

export interface LedgerResponse {
  items: LedgerTransaction[];
  latestBlock: number | null;
  total: number;
}

export interface Institution {
  id: string;
  name: string;
  location: string;
  establishedDate: string;
  issuerId: string;
  imageUrl: string;
  certificatesIssued: number;
  lastActivity: string | null;
  verified: boolean;
  approvals?: number;
  reports?: number;
  approvalRate?: number;
}

export interface VerificationResult {
  isValid: boolean;
  certificateTitle?: string;
  studentName?: string;
  institutionName?: string;
  issuerId?: string;
  issueDate?: string;
  blockchainHash?: string | null;
  blockNumber?: number | null;
  metadataCid?: string | null;
  institutionLogoUrl?: string | null;
  institutionCity?: string | null;
  institutionState?: string | null;
  institutionEmail?: string | null;
  errorMessage?: string;
}

// Helpers
function buildJsonHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function withQuery(url: string, q: Record<string, string | number | undefined>) {
  const u = new URL(url);
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) u.searchParams.set(k, String(v));
  });
  return u.toString();
}

// Auth + session
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: buildJsonHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Login failed');
  }
  const payload = (await res.json()) as { token: string; institutionName: string; issuerId: string; logoUrl: string | null };
  const lr: LoginResponse = { ...payload, email };
  // persist
  localStorage.setItem('graphene_token', lr.token);
  localStorage.setItem('graphene_user', JSON.stringify(lr));
  return lr;
}

export function logout() {
  localStorage.removeItem('graphene_token');
  localStorage.removeItem('graphene_user');
}

export async function registerInstitution(payload: RegisterRequest): Promise<RegisterResponse> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: buildJsonHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Registration failed');
  }
  return res.json();
}

// Issuers listing maps 1:1 from backend route
export async function getInstitutions(search?: string): Promise<Institution[]> {
  const url = search && search.trim()
    ? withQuery(`${BASE_URL}/institutions/issuers`, { search: search.trim() })
    : `${BASE_URL}/institutions/issuers`;
  const res = await fetch(url, { headers: buildJsonHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Failed to load institutions');
  }
  return res.json();
}

// Ledger with client-side filtering + pagination
export async function getLedger(params: {
  search?: string;
  type?: 'all' | TxType;
  status?: 'all' | TxStatus;
  page?: number;
  limit?: number;
}): Promise<LedgerResponse> {
  const { search, type = 'all', status = 'all', page = 1, limit = 10 } = params || {};
  const base = search && search.trim()
    ? withQuery(`${BASE_URL}/institutions/ledger`, { search: search.trim() })
    : `${BASE_URL}/institutions/ledger`;
  const res = await fetch(base, { headers: buildJsonHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Failed to load ledger');
  }
  const data = (await res.json()) as LedgerResponse;
  // apply filters client-side to match UI controls
  let items = data.items;
  if (type !== 'all') items = items.filter((t) => t.transactionType === type);
  if (status !== 'all') items = items.filter((t) => t.status === status);
  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  return { items: paged, latestBlock: data.latestBlock, total };
}

// Verify: hash file client-side, call backend public endpoint
export async function verifyCertificate(input: {
  file: File;
  certificateId: string;
  issuerId: string;
}): Promise<VerificationResult> {
  const fileHash = await sha256File(input.file);
  if ((import.meta as any)?.env?.VITE_DEBUG_HASH === 'true') {
    // eslint-disable-next-line no-console
    console.log('[hash][verify] sha256(file)=', fileHash, 'certId=', input.certificateId, 'issuerId=', input.issuerId);
  }
  const url = withQuery(`${BASE_URL}/public`, {
    certificateId: input.certificateId,
    issuerId: input.issuerId,
    fileHash,
  });
  const res = await fetch(url, { headers: buildJsonHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { isValid: false, errorMessage: err?.errorMessage || 'Unable to verify this certificate' };
  }
  return res.json();
}

// Issue: generate a certificateId, hash file, send to backend with auth
export async function issueCertificate(input: {
  file: File;
  studentName: string;
  certificateTitle: string;
  issueDate: string; // not stored on backend currently
  issuerId: string; // not needed by backend (comes from token), kept for UI consistency
  metadataCid?: string;
}): Promise<{ certificateId: string; transactionHash: string }> {
  const token = localStorage.getItem('graphene_token') || '';
  if (!token) throw new Error('Not authenticated');
  const fileHash = await sha256File(input.file);
  if ((import.meta as any)?.env?.VITE_DEBUG_HASH === 'true') {
    // eslint-disable-next-line no-console
    console.log('[hash][issue] sha256(file)=', fileHash);
  }
  const year = new Date().getFullYear();
  const suffix = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  const certificateId = `CERT-${year}-${suffix}`;
  const res = await fetch(`${BASE_URL}/certificates`, {
    method: 'POST',
    headers: buildJsonHeaders(token),
    body: JSON.stringify({
      studentName: input.studentName,
      title: input.certificateTitle,
      certificateId,
      fileHash,
      metadataCid: input.metadataCid,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Issue certificate failed');
  }
  const payload = (await res.json()) as { txHash: string };
  return { certificateId, transactionHash: payload.txHash };
}

// Profile (JWT)
export async function getMyInstitution(token: string): Promise<{
  institutionName: string;
  email: string;
  issuerId: string;
  logoUrl: string | null;
  issuerWalletAddress: string | null;
  verified: boolean;
  createdAt: string;
} | null> {
  const res = await fetch(`${BASE_URL}/institutions/me`, { headers: buildJsonHeaders(token) });
  if (!res.ok) throw new Error(`Profile fetch failed: ${res.status}`);
  return res.json();
}

// Bind wallet (JWT)
export async function updateIssuerWallet(token: string, walletAddress: string): Promise<{ ok: boolean; issuerWalletAddress: string; chain?: { granted: boolean; txHash?: string } }>{
  const res = await fetch(`${BASE_URL}/institutions/me/wallet`, {
    method: 'PATCH',
    headers: buildJsonHeaders(token),
    body: JSON.stringify({ walletAddress }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Wallet bind failed: ${res.status}`);
  }
  return res.json();
}

// Public feedback (no auth)
export async function submitInstitutionFeedback(issuerId: string, vote: 'approve'|'report', reason?: string) {
  const res = await fetch(`${BASE_URL}/institutions/${encodeURIComponent(issuerId)}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vote, reason }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Feedback failed: ${res.status}`);
  }
  return res.json();
}

// Convenience export
export const api = {
  login,
  logout,
  registerInstitution,
  getInstitutions,
  getLedger,
  verifyCertificate,
  issueCertificate,
  getMyInstitution,
  updateIssuerWallet,
  submitInstitutionFeedback,
};
