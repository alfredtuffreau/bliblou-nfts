task("getRecipe", "Task to get a recipe from its tokenId.")
    .addPositionalParam("tokenId")
    .setAction(async ({ tokenId }, hre) => {
        const recipesFactory = await hre.ethers.getContractFactory(process.env.BLIBLOU_NFTS_CONTRACT_NAME);
        const contract = recipesFactory.attach(process.env.BLIBLOU_NFTS_ADDRESS);
        console.log({
            owner: await contract.ownerOf(tokenId),
            uri: await contract.tokenURI(tokenId)
        });
    });