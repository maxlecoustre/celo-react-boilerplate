import {Web3Storage} from "web3.storage"; // "/dist/bundle.esm.min.js";
import axios from "axios";

const formatName = (name) => {
    // replace all spaces with %20
    return encodeURI(name);
}

// object to convert to file
const convertObjectToFile = (data) => {
    const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
    const files = [new File([blob], `${data.name}.json`)];
    return files;
}

export const createNft = async (
    minterContract,
    performActions,
    { name, description, ipfsImage, ownerAddress, attributes }
) => {
    await performActions(async (kit) => {
        if (!name || !description || !ipfsImage) return;
        const { defaultAccount } = kit;

        // Initialize the client with an API key
        const client = new Web3Storage({
            token: process.env.REACT_APP_STORAGE_API_KEY
        });
        // convert NFT metadata to JSON format
        const data = {
            name,
            description,
            image: ipfsImage,
            owner: defaultAccount,
            attributes,
        };

        try {
            // trim any extra whitespaces from the name and
            // replace the whitespaces between the name with %20
            const fileName = formatName(name);

            // bundle nft metadata into a file
            const files = convertObjectToFile(data);

            //save NFT metadata to web3 storage
            const cid = await client.put(files);

            // IPFS url for uploaded metadata
            const url = `https://${cid}.ipfs.w3s.link/${fileName}.json`;

            // mint the NFT and save the IPFS url to the blockchain
            return await minterContract.methods
                .safeMint(ownerAddress, url)
                .send({from: defaultAccount});
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    });
};

export const uploadFileToWebStorage = async (e) => {
    // Initialize the client with an API key
    const client = new Web3Storage({
        token: process.env.REACT_APP_STORAGE_API_KEY
    });
    const files = e.target.files;
    const file = files[0];

    const fileName = file.name;
    const imageName = formatName(fileName);

    const cid = await client.put(files);
    return `https://${cid}.ipfs.w3s.link/^${imageName}`;
};

export const getNfts = async (minterContract) => {
    try {
        const nfts = [];
        const nftsLength = await minterContract.methods.totalSupply().call();
        for (let i = 0 ; i < Number(nftsLength); i++) {
            const nft = new Promise(async (resolve) => {
                const res = await minterContract.methods.tokenURI(i).call();
                const meta = await fetchNftMetadata(res);
                const owner = await fetchNftOwner(minterContract, i);
                resolve({
                    index: i,
                    owner,
                    name: meta.data.name,
                    image: meta.data.image,
                    description: meta.data.description,
                    attributes: meta.data.attributes,
                });
            });
            nfts.push(nft);
        }
        return Promise.all(nfts);
    } catch (e) {
        console.log({ e });
    }
};

export const fetchNftMetadata = async (ipfsUrl) => {
    try {
        if (!ipfsUrl) return null;
        const meta = await axios.get(ipfsUrl);
        return meta;
    } catch (e) {
        console.log({ e });
    }
};

export const fetchNftOwner = async (minterContract, index) => {
    try {
        return await minterContract.methods.ownerOf(index).call();
    } catch (e) {
        console.log({ e });
    }
};

export const fetchNftContractOwner = async (minterContract) => {
    try {
        let owner = await minterContract.methods.owner().call();
        return owner;
    } catch (e) {
        console.log({ e });
    }
};
