import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { boolean } from "hardhat/internal/core/params/argumentTypes";

task("setSafeMode", "A task to change the value of state variable")
    .addPositionalParam("newState")
    .setAction(async (taskArgs) => {
        const newState: boolean = boolean.parse("value",taskArgs.newState);
        const hre = require("hardhat");
        const networkName = hre.network.name;
        const signers = hre.ethers.getSigners();
        const address = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address, signers[0]);

        await milechain.setSafeMode(newState);
        console.log(`State changed to ${newState}`);
    });