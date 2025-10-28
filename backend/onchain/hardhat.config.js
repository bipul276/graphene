// onchain/hardhat.config.js
require("dotenv").config();

require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    // Polygon Amoy testnet
    amoy: {
      url: process.env.CHAIN_RPC,                     // from .env
      accounts: process.env.ISSUER_ADMIN_PK ? [process.env.ISSUER_ADMIN_PK] : []
    }
  }
};
