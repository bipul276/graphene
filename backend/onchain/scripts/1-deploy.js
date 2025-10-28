// scripts/1-deploy.js
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Network:", hre.network.name);

  const Registry = await hre.ethers.getContractFactory("CertificateRegistry");

  // if your constructor is `constructor(address owner)`:
  const registry = await Registry.deploy(deployer.address);

  // Ethers v6: wait for deployment and get address
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();

  console.log("CertificateRegistry deployed to:", registryAddress);

  // Optionally grant a default issuer
  const { DEFAULT_ISSUER } = process.env;
  if (DEFAULT_ISSUER && DEFAULT_ISSUER.trim() !== "") {
    const tx = await registry.grantIssuer(DEFAULT_ISSUER);
    await tx.wait();
    console.log("Granted issuer:", DEFAULT_ISSUER);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
