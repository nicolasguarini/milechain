import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("isDeployer", "A task to know if an address is a deployer")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const networkName: string = hre.network.name;
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);
        const deployer: Address = taskArgs.address;

        const result: boolean = await milechain.isDeployer(deployer);
        console.log(result);
    });