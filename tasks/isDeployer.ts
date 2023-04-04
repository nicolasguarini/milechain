import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { Address } from "hardhat-deploy/dist/types";

task("isDeployer", "A task to know if an address is a deployer")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const networkName = hre.network.name;
        const address = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);
        const deployer: Address = taskArgs.address;

        const result: boolean = await milechain.isDeployer(deployer);
        console.log(result);
    });