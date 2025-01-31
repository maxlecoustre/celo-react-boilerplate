const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
    this.timeout(5000);

    let myNFT;
    let owner;
    let acc1;
    let acc2;

    this.beforeEach(async function () {
        // This is executed before each test
        // Deploying the smart contract
        const MyNFT = await ethers.getContractFactory("MyNFT");
        [owner, acc1, acc2] = await ethers.getSigners();

        myNFT = await MyNFT.deploy();
    });

    it("Should set the right owner", async function () {
        expect(await myNFT.owner()).to.equal(owner.address);
    });

    it("Should mint one NFT", async function () {
        expect(await myNFT.balanceOf(acc1.address)).to.equal(0);

        const tokenURI = "https://example.com/1";
        const tx = await myNFT.connect(owner).safeMint(acc1.address, tokenURI);
        await tx.wait();

        expect(await myNFT.balanceOf(acc1.address)).to.equal(1);
    });

    it("Should set the correct tokenURI", async function () {
        const tokenURI_1 = "https://example.com/1";
        const tokenURI_2 = "https://example.com/2";

        const tx1 = await myNFT.connect(owner).safeMint(acc1.address, tokenURI_1);
        await tx1.wait();
        const tx2 = await myNFT.connect(owner).safeMint(acc2.address, tokenURI_2);
        await tx2.wait();

        expect(await myNFT.tokenURI(0)).to.equal(tokenURI_1);
        expect(await myNFT.tokenURI(1)).to.equal(tokenURI_2);
    });
});

describe("MyNewNFT", function () {
    this.timeout(5000);

    let myNewNFT;
    let owner;
    let acc1;
    let acc2;

    this.beforeEach(async function () {
        // This is executed before each test
        // Deploying the smart contract
        const MyNewNFT = await ethers.getContractFactory("MyNewNFT");
        [owner, acc1, acc2] = await ethers.getSigners();

        myNewNFT = await MyNewNFT.deploy();
    });

    it("Should set the right owner", async function () {
        expect(await myNewNFT.owner()).to.equal(owner.address);
    });

    it("Should mint one NFT", async function () {
        expect(await myNewNFT.balanceOf(acc1.address)).to.equal(0);

        const tokenURI = "https://example.com/1";
        const tx = await myNewNFT.connect(owner).safeMint(acc1.address, tokenURI);
        await tx.wait();

        expect(await myNewNFT.balanceOf(acc1.address)).to.equal(1);
    });

    /*
    it("Should set the correct tokenURI", async function () {
        const tokenURI_1 = "https://example.com/1";
        const tokenURI_2 = "https://example.com/2";

        const tx1 = await myNewNFT.connect(owner).safeMint(acc1.address, tokenURI_1);
        await tx1.wait();
        const tx2 = await myNewNFT.connect(owner).safeMint(acc2.address, tokenURI_2);
        await tx2.wait();

        expect(await myNewNFT.tokenURI(0)).to.equal(tokenURI_1);
        expect(await myNewNFT.tokenURI(1)).to.equal(tokenURI_2);
    });
     */
});