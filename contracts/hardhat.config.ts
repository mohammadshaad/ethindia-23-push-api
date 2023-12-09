import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    scrollSepolia: {
      chainId: 534351,
      url: "https://sepolia-rpc.scroll.io/" || "",
      
    },
  },
};

export default config;
