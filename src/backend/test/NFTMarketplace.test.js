/* eslint-disable jest/valid-expect */
const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => ethers.utils.parseEther(value.toString());
const fromWei = (value) => ethers.utils.formatEther(value.toString());

/**
 * @file NFTMarketplace.test.js
 * @summary This file contains unit tests for the NFTMarketplace smart contract.
 * @description The tests cover deployment, minting NFTs, making items for sale, and purchasing marketplace items.
 */

// eslint-disable-next-line jest/valid-describe-callback
describe("NFTMarketplace", async function() {
    let owner, addr1, addr2, nft, marketplace;
    let feePercent = 1;
    let URI = "Sample URI"
    
    beforeEach(async function() {
        // get contractFactory
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");

        // get signers
        [owner, addr1, addr2] = await ethers.getSigners();
        // deploy contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(1);
    });

    describe("Deployment", function() {
        // test if the contracts are deployed
        it("Should track name and symbol of the nft collections", async function() {
            expect(await nft.name()).to.equal("Dapp NFT");
            expect(await nft.symbol()).to.equal("DAPP");
        });

        it("Should track the fee Acount and fee percent of the marketplace", async function() {
            expect(await marketplace.feeAccount()).to.equal(owner.address);
            expect(await marketplace.feePercent()).to.equal(feePercent);
        });
    });

    describe("Minting NFTs", function() {
        it("Should mint NFTs", async function() {
            // addr1 mints an NFT
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            // addr2 mints an NFT
            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        });
    });

    describe("Making items for sale", function() {
        beforeEach(async function() {
            // addr1 mints an NFT
            await nft.connect(addr1).mint(URI);
            // addr1 approves the marketplace to sell the NFT
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
        });        

        it("Should track newly created items for sale, transfer it to marketplace", async function() {
            // addr1 offers 1 eth for the NFT
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1)))
                .to.emit(marketplace, "Offered")
                .withArgs(1, nft.address, 1, toWei(1), addr1.address)

            // await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1));
            // console.log(marketplace)
            // Owner of the NFT is the marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);

            // itemCount is 1
            expect(await marketplace.itemCount()).to.equal(1);
            
            // check if the item is created correctly
            const item = await marketplace.items(1);
            // console.log(item)
            expect(item.itemId).to.equal(1);
            expect(item.nftContract).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.isSold).to.equal(false);
        });

        it("Should fail if price is 0", async function() {
            // check price is 0
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1, 0))
                .to.be.revertedWith("Price must be at least 1 wei");
        });
    });

    describe("Purchasing marketplace items", function() {
        let price = 2;
        let totalPriceinWei;
        beforeEach(async function() {
            // addr1 mints an NFT
            await nft.connect(addr1).mint(URI);
            // addr1 approves the marketplace to sell the NFT 
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
            // addr1 offers 1 eth for the NFT
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price));
        });

        it("Should update item as sold, transfer funds to seller and fee to owner", async function() {
            const sellerBalanceBefore = await addr1.getBalance();
            const ownerBalanceBefore = await owner.getBalance();

            // console.log("Seller balance before: ", fromWei(sellerBalanceBefore));
            // console.log("Owner balance before: ", fromWei(ownerBalanceBefore));
            // console.log("Customer balance before: ", fromWei(await addr2.getBalance()));

            // get total price
            totalPriceinWei = marketplace.getTotalPrice(1);

            // addr2 purchases the item
            await expect(marketplace.connect(addr2).purchaseItem(1, { value: totalPriceinWei }))
                .to.emit(marketplace, "Purchased")
                .withArgs(1, nft.address, 1, toWei(price), addr1.address, addr2.address)

            const sellerBalanceAfter = await addr1.getBalance();
            const ownerBalanceAfter = await owner.getBalance();

            // console.log("Seller balance after: ", fromWei(sellerBalanceAfter));
            // console.log("Owner balance after: ", fromWei(ownerBalanceAfter));
            // console.log("Customer balance after: ", fromWei(await addr2.getBalance()));


            // check if the price is transferred to the seller
            expect(+fromWei(sellerBalanceAfter)).to.equal(+fromWei(sellerBalanceBefore) + price);
            
            // console.log("[Success]")
            
            // calculate the fee
            let fee = (feePercent / 100) * price
            // console.log("Fee: ", fee)
            // console.log("Total Price: ", +fee + +fromWei(ownerBalanceBefore))
            // console.log("Check: ", +fromWei(ownerBalanceAfter) - +fee - +fromWei(ownerBalanceBefore))
            // check if the fee is transferred to the owner
            expect(+ownerBalanceAfter).to.equal(+toWei(fee) + +ownerBalanceBefore);

            // check if addr2 is the owner of the NFT
            expect(await nft.ownerOf(1)).to.equal(addr2.address);

            // check if the item is updated correctly
            expect((await marketplace.items(1)).isSold).to.equal(true);
        });

        it("Should fail if the price is not enough", async function() {
            // check if item is not available
            await expect(
                marketplace.connect(addr2).purchaseItem(2, { value: totalPriceinWei })
            ).to.be.revertedWith("Item not available");

            
            await expect(
                marketplace.connect(addr2).purchaseItem(0, { value: totalPriceinWei })
            ).to.be.revertedWith("Item not available");

            // check if price is not enough
            await expect(
                marketplace.connect(addr2).purchaseItem(1, { value: toWei(price) })
            ).to.be.revertedWith("Not enough funds sent");

            // addr2 purchases the item
            await marketplace.connect(addr2).purchaseItem(1, { value: totalPriceinWei });

            // check if item is already sold
            await expect(
                marketplace.connect(addr2).purchaseItem(1, { value: totalPriceinWei })
            ).to.be.revertedWith("Item is already sold");
        });
    });
}); 