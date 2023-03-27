import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { Address } from "hardhat-deploy/dist/types";

task("isDeployer", "A task to know if an address is a deployer")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const deployer: Address = taskArgs.address;

        const result: boolean = await milechain.isDeployer(deployer);
        console.log("result");
    });