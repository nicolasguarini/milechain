import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { performance } from "perf_hooks";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("getCurrentSafeModeState", "A task to know the safeMode's value")
    .setAction(async () => {
        const startTime: number = performance.now();
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const networkName: string = hre.network.name;
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const result: boolean = await milechain.getCurrentSafeModeState();
        console.log(result);

        const endTime: number = performance.now();
        console.log(`Task completed in ${Math.round(endTime - startTime)}ms.`);
    });