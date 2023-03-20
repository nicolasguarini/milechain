import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../hardhat.config";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Owned, Owned__factory } from "../../typechain-types";

!developmentChains.includes(network.name) ? describe.skip : describe("Owned Unit Tests", function () {
    let accounts: SignerWithAddress[];
    let deployer: SignerWithAddress;
    let secondDeployer: SignerWithAddress;
    let ownedFactory: Owned__factory;
    let owned: Owned;
    
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        secondDeployer = accounts[1];

        await deployments.fixture(["milechain"]);
        ownedFactory = await ethers.getContractFactory("Owned");
        owned = await ownedFactory.deploy([secondDeployer.address]);
    });

    describe("constructor", function(){
        it("initializes the contract correctly", async () => {
            const safeModeState: boolean = await owned.getCurrentSafeModeState();
            assert.equal(safeModeState, false);
        });

        it("saves the deployers addresses in deployers mapping", async () => {
            const isDeployer1 = await owned.isDeployer(deployer.address);
            const isDeployer2 = await owned.isDeployer(secondDeployer.address);
            const isDeployer3 = await owned.isDeployer(accounts[2].address);

            assert.equal(isDeployer1, true);
            assert.equal(isDeployer2, true);
            assert.equal(isDeployer3, false);
        });
    });

    describe("setSafeMode", function(){
        it("enables/disables safe mode correctly", async () => {
            await owned.setSafeMode(true);
            const safeModeOn: boolean = await owned.getCurrentSafeModeState();
            await owned.setSafeMode(false);
            const safeModeOff: boolean = await owned.getCurrentSafeModeState();
            
            assert.equal(safeModeOn, true);
            assert.equal(safeModeOff, false);
        });

        it("reverts if you are not a deployer", async () => {
            await expect(
                owned.connect(accounts[2]).setSafeMode(true)
            ).revertedWith("You have to be a deployer to do this");
        });
    });

    describe("addDeployer", function(){
        it("adds a new deployer",async () => {
            await owned.addDeployer(accounts[2].address);
            const isDeployer: boolean = await owned.isDeployer(accounts[2].address);

            assert.equal(isDeployer, true);
        });

        it("reverts if address is already a deployer", async () => {
            await owned.addDeployer(accounts[2].address);

            await expect(
                owned.addDeployer(accounts[2].address)
            ).revertedWith("The specified address is already a deployer");
        });

        it("reverts if you are not a deployer", async () => {
            await expect(
                owned.connect(accounts[2]).addDeployer(accounts[2].address)
            ).revertedWith("You have to be a deployer to do this");
        });
    });

    describe("deleteDeployer", function(){
        it("deletes a deployer", async () => {
            await owned.deleteDeployer(secondDeployer.address);
            const isDeployer: boolean = await owned.isDeployer(secondDeployer.address);

            assert.equal(isDeployer, false);
        });

        it("reverts is address is not a deployer", async () => {
            await expect(
                owned.deleteDeployer(accounts[2].address)
            ).revertedWith("The specified address is not a deployer");
        });

        it("reverts if you are not a deployer", async () => {
            await expect(
                owned.connect(accounts[2]).addDeployer(secondDeployer.address)
            ).revertedWith("You have to be a deployer to do this");
        });
    })
});