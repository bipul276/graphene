// scripts/4-read-certificate.js
// Reads on-chain record and checks a given file hash matches.

const hre = require("hardhat");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

function to0x(bytesHex) {
  const h = bytesHex.startsWith("0x") ? bytesHex.slice(2) : bytesHex;
  if (h.length !== 64) throw new Error("fileHash must be 32-byte hex (64 chars)");
  return "0x" + h.toLowerCase();
}
function sha256FileHex(path) {
  const buf = fs.readFileSync(path);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function main() {
  const { CERT_REGISTRY_ADDRESS, CERT_ID, ISSUER_ADDRESS, FILE_PATH, FILE_HEX } = process.env;
  if (!CERT_REGISTRY_ADDRESS) throw new Error("Missing CERT_REGISTRY_ADDRESS");
  if (!CERT_ID) throw new Error("Missing CERT_ID");
  if (!ISSUER_ADDRESS) throw new Error("Missing ISSUER_ADDRESS (the issuing wallet)");

  // compute or accept provided hex
  let fileHex;
  if (FILE_HEX && FILE_HEX.trim()) {
    fileHex = FILE_HEX.trim().replace(/^0x/, "");
    if (fileHex.length !== 64) throw new Error("FILE_HEX must be 64 hex chars");
  } else if (FILE_PATH && FILE_PATH.trim()) {
    fileHex = sha256FileHex(FILE_PATH.trim());
  } else {
    throw new Error("Provide either FILE_PATH or FILE_HEX");
  }
  const fileHashBytes32 = to0x(fileHex);

  const Registry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = await Registry.attach(CERT_REGISTRY_ADDRESS);

  const res = await registry.getCertificate(ISSUER_ADDRESS, CERT_ID);
  const exists = res[0];
  const storedHash = res[1];
  const metadataCid = res[2];
  const issuedAt = Number(res[3]);
  const storedIssuer = res[4];

  console.log({ exists, storedHash, metadataCid, issuedAt, storedIssuer });

  if (!exists) {
    console.log("On-chain record does not exist.");
    return;
  }
  console.log("Hash match?", storedHash.toLowerCase() === fileHashBytes32.toLowerCase());
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
