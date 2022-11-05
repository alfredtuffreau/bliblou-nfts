require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();
require("./tasks/mintRecipe.js");
require("./tasks/getRecipe.js");

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.ALCHEMY_STAGING_URL,
      accounts: [ process.env.PRIVATE_KEY ]
    },
    mainnet: {
      chainId: 1,
      url: process.env.ALCHEMY_PROD_URL,
      accounts: [ process.env.PRIVATE_KEY ]
    }
  }
};
