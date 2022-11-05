const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Recipes", () => {

  let recipes, oldAddress, owner, address1, address2;
  const tokenURI = "https://test.com";

  before(async () => {
    [ owner, address1, address2 ] = await ethers.getSigners(3);

    const recipesFactory = await ethers.getContractFactory(process.env.BLIBLOU_NFTS_CONTRACT_NAME);
    const oldRecipes = await upgrades.deployProxy(recipesFactory, []);
    await oldRecipes.deployed();
    oldAddress = oldRecipes.address;

    recipes = await upgrades.upgradeProxy(oldAddress, recipesFactory);
    await recipes.deployed();
  });

  it("is upgradeable", () => {
    expect(recipes.address).to.equal(oldAddress);
  });

  it("mints new tokens and return the token URI", async () => {
    await recipes.mintTo(address1.address, tokenURI);
    expect(await recipes.ownerOf(1)).to.equal(address1.address);
  });

  it("has a token URI", async () => {
    expect(await recipes.tokenURI(1)).to.equal(tokenURI);
  });

  it("transfers from", async () => {
    await recipes.connect(address1).transferFrom(address1.address, address2.address, 1);
    expect(await recipes.ownerOf(1)).to.equal(address2.address);
  });

  it("is pausable and unpausable only by owner", async () => {
    await recipes.pause();
    const txs = [ recipes.mintTo(address1.address, tokenURI), recipes.transferFrom(address2.address, address1.address, 1) ];
    txs.forEach(async tx => await expect(tx).to.be.revertedWith("Pausable: paused"));

    await recipes.unpause();
    await recipes.connect(address2).transferFrom(address2.address, address1.address, 1);
    expect(await recipes.ownerOf(1)).to.equal(address1.address);

    await expect(recipes.connect(address1).pause()).to.be.revertedWith("Ownable: caller is not the owner");
    await expect(recipes.connect(address1).unpause()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("is enumerable", async () => {
    expect(await recipes.totalSupply()).to.equal(2);
    
    expect(await recipes.tokenByIndex(0)).to.equal(1);
    expect(await recipes.tokenByIndex(1)).to.equal(2);
    await expect(recipes.tokenByIndex(2)).to.be.revertedWith("global index out of bounds");
    
    expect(await recipes.tokenOfOwnerByIndex(address1.address, 0)).to.equal(2);
    expect(await recipes.tokenOfOwnerByIndex(address1.address, 1)).to.equal(1);
    await expect(recipes.tokenOfOwnerByIndex(address1.address, 2)).to.be.revertedWith("owner index out of bounds");
    await expect(recipes.tokenOfOwnerByIndex(address2.address, 0)).to.be.revertedWith("owner index out of bounds");
  });
});