import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { performance } from "perf_hooks";

task("deleteDeployer", "A task to delete a deployer")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const startTime: number = performance.now();
        const oldDeployer: Address = taskArgs.address;
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const networkName: string = hre.network.name;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address, signers[0]);

        await milechain.deleteDeployer(oldDeployer);
        console.log("Deployer deleted!");
        
        const endTime: number = performance.now();
        console.log(`Task completed in ${Math.round(endTime - startTime)}ms.`);
    });