import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { Address } from "hardhat-deploy/dist/types";

task("getCurrentSafeModeState", "A task to know the safeMode's value")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const result: boolean = await milechain.getCurrentSafeModeState();
        console.log(result);
    });