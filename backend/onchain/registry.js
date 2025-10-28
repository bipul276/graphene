// src/onchain/registry.js
import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

/**
 * Minimal ABI for CertificateRegistry used by backend.
 * Matches your deployed contract (issueCertificate, grantIssuer, getCertificate, isIssuer).
 */
const REGISTRY_ABI = [
  "function grantIssuer(address issuer) external",
  "function isIssuer(address) view returns (bool)",
  "function issueCertificate(string certId, bytes32 fileHash, string metadataCid) external",
  "function getCertificate(address issuer, string certId) view returns (bool exists, bytes32 fileHash, string metadataCid, uint64 issuedAt, address storedIssuer)"
];

/**
 * Returns a read-only contract instance (no private key required).
 */
export function getReadContract() {
  const rpc = mustEnv('CHAIN_RPC');
  const address = mustEnv('CERT_REGISTRY_ADDRESS');
  const provider = new ethers.JsonRpcProvider(rpc);
  return new ethers.Contract(address, REGISTRY_ABI, provider);
}

/**
 * Returns a signer-based contract instance (writes use this).
 * Uses ISSUER_PK or ISSUER_ADMIN_PK (private key) from .env
 */
export function getWriteContract() {
  const rpc = mustEnv('CHAIN_RPC');
  const address = mustEnv('CERT_REGISTRY_ADDRESS');
  const pk = process.env.ISSUER_PK || process.env.ISSUER_ADMIN_PK; // prefer ISSUER_PK; fallback admin
  if (!pk) throw new Error('Missing ISSUER_PK or ISSUER_ADMIN_PK in .env');
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);
  const contract = new ethers.Contract(address, REGISTRY_ABI, wallet);
  return { contract, wallet, provider };
}

function mustEnv(key) {
  const val = process.env[key];
  if (!val || String(val).trim() === '') {
    throw new Error(`Missing required env ${key}`);
  }
  return val;
}
