import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { Address } from "hardhat-deploy/dist/types";

task("deleteDeployer", "A task to delete a deployer")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const oldDeployer: Address = taskArgs.address;
        const hre = require("hardhat");
        const networkName = hre.network.name;
        const signers = hre.ethers.getSigners();
        const address = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address, signers[0]);

        await milechain.deleteDeployer(oldDeployer);
        console.log("Deployer deleted!");
    });