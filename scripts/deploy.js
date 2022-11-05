const { ethers, upgrades } = require('hardhat');

async function main() {
  const recipesFactory = await ethers.getContractFactory(process.env.BLIBLOU_NFTS_CONTRACT_NAME);
  // const recipes = await upgrades.deployProxy(recipesFactory, []);
  const recipes = await upgrades.upgradeProxy(process.env.BLIBLOU_NFTS_ADDRESS, recipesFactory);
  await recipes.deployed();
  return recipes.address;
}

main().then(res => {
  console.log(`${process.env.BLIBLOU_NFTS_CONTRACT_NAME} deployed to:`, res);
  process.exit(0);
}).catch(error => {
  console.error(error);
  process.exit(1);
});
