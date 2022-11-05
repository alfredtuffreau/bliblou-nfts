const fs = require("fs");
const { task } = require("hardhat/config");
const aws = require("../src/aws");
const { generateMetadata } = require("../src/metadata");

task("mintRecipe", "Task to mint a recipe using its uuid to a 0x address.")
    .addPositionalParam("uuid")
    .addPositionalParam("to")
    .setAction(async ({ uuid, to }, hre) => {
        await aws.signIn(process.env.BLIBLOU_USERS_MAIL, process.env.BLIBLOU_USERS_PASSWORD);
        const IpfsHash = await generateMetadata(uuid);
        const recipesFactory = await hre.ethers.getContractFactory(process.env.BLIBLOU_NFTS_CONTRACT_NAME);
        const contract = recipesFactory.attach(process.env.BLIBLOU_NFTS_ADDRESS);
        return await contract.mintTo(to, `ipfs://${IpfsHash}/${uuid}.json`); // `${process.env.IPFS_GATEWAY}/ipfs/${IpfsHash}/${uuid}.json`);
    });