const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const { CERT_REGISTRY_ADDRESS, DEFAULT_ISSUER } = process.env;
  if (!CERT_REGISTRY_ADDRESS || !DEFAULT_ISSUER) {
    throw new Error("Set CERT_REGISTRY_ADDRESS and DEFAULT_ISSUER in .env");
  }
  const [owner] = await hre.ethers.getSigners();
  const Registry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = await Registry.attach(CERT_REGISTRY_ADDRESS);

  console.log("Owner:", owner.address);
  const tx = await registry.revokeIssuer(DEFAULT_ISSUER);
  console.log("tx:", tx.hash);
  await tx.wait();
  console.log("Revoked:", DEFAULT_ISSUER);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
