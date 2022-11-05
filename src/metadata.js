const aws = require("../src/aws");
const ipfs = require("../src/ipfs");
const axios = require("axios");

const fs = require("fs");
const util = require('util');
const stream = require('stream');

const pipeline = util.promisify(stream.pipeline);

const downloadFile = async (url, dest) => {
    await axios.get(url, { responseType: 'stream' }).then(async ({ data }) => await pipeline(data, fs.createWriteStream(dest))); 
}

async function generateMetadata(uuid) {
    const recipe = await aws.fetchRecipe(uuid);
    const content = JSON.parse(recipe.content);
    const picture = recipe.picture;

    const recipeDir = __dirname + `/../assets/${uuid}`;
    const contentFilename = `content.json`;
    const imageFilename = `image.${picture.split('.').pop()}`;
    const metadataDir = __dirname + `/../assets/metadata`;
    
    if ( !fs.existsSync(recipeDir) ) fs.mkdirSync(recipeDir);
    fs.writeFileSync(`${recipeDir}/${contentFilename}`, JSON.stringify(content));
    await aws.s3Download(picture).then(url => downloadFile(url, `${recipeDir}/${imageFilename}`));

    const { data: { IpfsHash } } = await ipfs.pinDirectory(`./assets/${uuid}`, `${uuid}_recipe`);
    const metadata = {
        name: content.title,
        description: content.description,
        image: `ipfs://${IpfsHash}/${imageFilename}`, // `${process.env.IPFS_GATEWAY}/ipfs/${IpfsHash}/${imageFilename}`,
        content: `ipfs://${IpfsHash}/${contentFilename}`, // `${process.env.IPFS_GATEWAY}/ipfs/${IpfsHash}/${contentFilename}`
    };

    if ( !fs.existsSync(metadataDir) ) fs.mkdirSync(metadataDir);
    fs.writeFileSync(`${metadataDir}/${uuid}.json`, JSON.stringify(metadata));
    
    return await ipfs.pinFile(`${metadataDir}/${uuid}.json`, `${uuid}_metadata`).then(({ data: { IpfsHash } }) => IpfsHash);
};

module.exports = { generateMetadata };