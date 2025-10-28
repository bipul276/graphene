import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const { CHAIN_RPC, ISSUER_ADMIN_PK, CERT_REGISTRY_ADDRESS } = process.env;

// Load ABI compiled by Hardhat
const abiPath = path.join(
  process.cwd(),
  "backend/onchain/artifacts/contracts/CertificateRegistry.sol/CertificateRegistry.json"
);
const artifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const ABI = artifact.abi;

function getIssuerWallet() {
  const provider = new ethers.JsonRpcProvider(CHAIN_RPC);
  const wallet = new ethers.Wallet(ISSUER_ADMIN_PK, provider);
  return { provider, wallet };
}

export async function issueOnChain({ issuerAddress, certId, fileHashHex, metadataCid }) {
  // fileHashHex must be 0x + 64 hex (bytes32)
  const { wallet } = getIssuerWallet();
  const registry = new ethers.Contract(CERT_REGISTRY_ADDRESS, ABI, wallet);

  // If you want per-issuer keys, grant issuerAddress once; or just use wallet as issuer.
  // await (await registry.grantIssuer(issuerAddress)).wait();

  const tx = await registry.issueCertificate(certId, fileHashHex, metadataCid || "");
  const receipt = await tx.wait();
  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}

export async function verifyOnChain({ issuerAddress, certId, fileHashHex }) {
  const provider = new ethers.JsonRpcProvider(CHAIN_RPC);
  const registry = new ethers.Contract(CERT_REGISTRY_ADDRESS, ABI, provider);
  const [valid, metadataCid, issuedAt] = await registry.verify(issuerAddress, certId, fileHashHex);
  return { valid, metadataCid, issuedAt: Number(issuedAt) };
}
