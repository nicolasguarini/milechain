import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";

task("getCurrentSafeModeState", "A task to know the safeMode's value")
    .setAction(async () => {
        const hre = require("hardhat");
        const networkName = hre.network.name;
        const address = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const result: boolean = await milechain.getCurrentSafeModeState();
        console.log(result);
    });