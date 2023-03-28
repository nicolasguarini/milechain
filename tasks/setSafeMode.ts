import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { boolean } from "hardhat/internal/core/params/argumentTypes";

task("setSafeMode", "A task to change the value of state variable")
    .addPositionalParam("newState")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const newState: boolean = boolean.parse("value",taskArgs.newState);
        console.log(newState);
        await milechain.setSafeMode(newState);
        console.log("State changed!");
    });