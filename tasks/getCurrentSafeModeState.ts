import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("getCurrentSafeModeState", "A task to know the safeMode's value")
    .setAction(async () => {
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const networkName: string = hre.network.name;
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const result: boolean = await milechain.getCurrentSafeModeState();
        console.log(result);
    });