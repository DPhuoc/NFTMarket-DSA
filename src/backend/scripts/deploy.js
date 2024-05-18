const { ethers, artifacts } = require("hardhat")

/**
 * @file deploy.js
 * @summary This script deploys NFT and Marketplace contracts using Hardhat, and saves their ABI and addresses for frontend integration.
 * @description The script utilizes Hardhat to deploy NFT and Marketplace contracts, retrieves their addresses and ABI artifacts, and saves them in JSON files for frontend access. It also logs deployment details such as the deployer's address and balance.
 */


/**
 * @summary Main function for deploying contracts and saving frontend files.
 * @returns {Promise<void>} A promise that resolves when the deployment is complete.
 */
async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // deploy contracts here:

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(1);

    console.log(nft.tokenCount().then((res) => console.log(res.toString())));  


    console.log("NFT address:", nft.address);
    console.log("Marketplace address:", marketplace.address);

    // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
    saveFrontendFiles(nft, "NFT");
    saveFrontendFiles(marketplace, "Marketplace");
}

/**
 * @summary Function to save ABI and address of a contract for frontend use.
 * @param {Object} contract - The deployed contract instance.
 * @param {string} name - The name of the contract.
 */
function saveFrontendFiles(contract, name) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../../frontend/contractsData";

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir);
    }

    fs.writeFileSync(
        contractsDir + `/${name}-address.json`,
        JSON.stringify({ address: contract.address }, undefined, 2)
    );

    const contractArtifact = artifacts.readArtifactSync(name);

    fs.writeFileSync(
        contractsDir + `/${name}.json`,
        JSON.stringify(contractArtifact, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
