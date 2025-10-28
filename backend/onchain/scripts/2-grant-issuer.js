const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const registryAddress = process.env.CERT_REGISTRY_ADDRESS;
  const issuerToGrant = process.env.DEFAULT_ISSUER;

  if (!registryAddress || !issuerToGrant) {
    throw new Error("Set CERT_REGISTRY_ADDRESS and DEFAULT_ISSUER in .env");
  }

  const Registry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = await Registry.attach(registryAddress);

  console.log("Owner:", owner.address);
  console.log("Registry:", await registry.getAddress());

  const tx = await registry.grantIssuer(issuerToGrant);
  await tx.wait();
  console.log("✅ Granted issuer:", issuerToGrant);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
