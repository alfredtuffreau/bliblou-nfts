require("dotenv").config();

const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const axios = require("axios");
const recursive = require("recursive-fs");
const basePathConverter = require("base-path-converter");

async function pinFile(file, name) {
    const data = new FormData();
    const filepath = `${path.basename(path.dirname(file))}/${path.basename(file)}`;
    data.append(`file`, fs.createReadStream(file), { filepath });
    data.append("pinataMetadata", JSON.stringify({ name }));

    return axios.post(process.env.PINATA_URL, data, {
        maxBodyLength: "Infinity",
        headers: { 
            "Content-Type": `multipart/form-data; boundary=${ data._boundary }`,
            Authorization: `Bearer ${ process.env.PINATA_JWT }`
        }
    });
}

async function pinDirectory(dirpath, name) {
    const data = new FormData();
    const { files } = await recursive.read(dirpath)
    files.forEach(file => data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(dirpath, file)
    }));
    data.append("pinataMetadata", JSON.stringify({ name }));
    
    return axios.post(process.env.PINATA_URL, data, {
        maxBodyLength: "Infinity",
        headers: { 
            "Content-Type": `multipart/form-data; boundary=${ data._boundary }`,
            Authorization: `Bearer ${ process.env.PINATA_JWT }`
        }
    });
}

module.exports = {
    pinFile,
    pinDirectory
};