// scripts/3-issue-certificate.js
// Usage examples:
//  npx hardhat run scripts/3-issue-certificate.js --network amoy
//    (reads env CERT_ID, FILE_PATH or FILE_HEX, METADATA_CID)

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
  const { CERT_REGISTRY_ADDRESS, CERT_ID, FILE_PATH, FILE_HEX, METADATA_CID } = process.env;
  if (!CERT_REGISTRY_ADDRESS) throw new Error("Missing CERT_REGISTRY_ADDRESS in .env");
  if (!CERT_ID) throw new Error("Missing CERT_ID in .env (e.g., CERT-2024-001234)");

  let fileHex;
  if (FILE_HEX && FILE_HEX.trim()) {
    fileHex = FILE_HEX.trim().replace(/^0x/, "");
    if (fileHex.length !== 64) throw new Error("FILE_HEX must be 64 hex chars (bytes32)");
  } else if (FILE_PATH && FILE_PATH.trim()) {
    fileHex = sha256FileHex(FILE_PATH.trim());
  } else {
    throw new Error("Provide either FILE_PATH (will sha256) or FILE_HEX (precomputed)");
  }

  const fileHashBytes32 = to0x(fileHex);

  const [signer] = await hre.ethers.getSigners();
  console.log("Issuer (signer):", signer.address);
  console.log("Network:", hre.network.name);

  const Registry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = await Registry.attach(CERT_REGISTRY_ADDRESS);

  // sanity: ensure signer is an allowed issuer
  const isIssuer = await registry.isIssuer(signer.address);
  if (!isIssuer) {
    throw new Error(`Signer ${signer.address} is not an allowed issuer. Grant it first.`);
  }

  const tx = await registry.issueCertificate(
    CERT_ID,
    fileHashBytes32,
    METADATA_CID || "" // optional
  );
  console.log("Submitting tx:", tx.hash);
  const rc = await tx.wait();
  console.log("Mined in block:", rc.blockNumber);

  // Find the event in logs (optional)
  const evt = rc.logs
    .map(log => {
      try { return registry.interface.parseLog(log); } catch { return null; }
    })
    .filter(Boolean)
    .find(e => e.name === "CertificateIssued");

  if (evt) {
    console.log("CertificateIssued event:");
    console.log({
      issuer: evt.args.issuer,
      certId: evt.args.certId,
      fileHash: evt.args.fileHash,
      metadataCid: evt.args.metadataCid,
      blockNumber: evt.args.blockNumber.toString(),
      issuedAt: evt.args.issuedAt.toString(),
    });
  } else {
    console.log("No CertificateIssued event parsed (it’s okay on some RPC providers).");
  }

  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
