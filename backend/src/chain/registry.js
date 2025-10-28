// backend/src/chain/registry.js
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadAbi() {
  const p = path.join(__dirname, '..', '..', 'abi', 'GrapheneRegistry.abi.json');
  const txt = readFileSync(p, 'utf8');
  return JSON.parse(txt);
}

const abi = loadAbi();

export function getProvider() {
  const rpc = process.env.CHAIN_RPC;
  if (!rpc) throw new Error('CHAIN_RPC not configured');
  return new ethers.JsonRpcProvider(rpc);
}

export function registryReadonly() {
  const address = process.env.CERT_REGISTRY_ADDRESS;
  if (!address) throw new Error('CERT_REGISTRY_ADDRESS not configured');
  const provider = getProvider();
  return new ethers.Contract(address, abi, provider);
}

export function registryWithSigner(privateKey) {
  const address = process.env.CERT_REGISTRY_ADDRESS;
  if (!address) throw new Error('CERT_REGISTRY_ADDRESS not configured');
  const provider = getProvider();
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(address, abi, wallet);
}

