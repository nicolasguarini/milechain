import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Address } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("addDeployer", "A task to add a new deployer")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const networkName: string = hre.network.name;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        const newDeployer: Address = taskArgs.address;
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address, signers[0]);
        await milechain.addDeployer(newDeployer);
        console.log("Deployer added!");
    });