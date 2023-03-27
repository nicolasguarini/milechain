import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { Address } from "hardhat-deploy/dist/types";

task("deleteDeployer", "A task to delete a deployer")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const oldDeployer: Address = taskArgs.address;

        await milechain.deleteDeployer(oldDeployer);
        console.log("Deployer deleted!");
    });