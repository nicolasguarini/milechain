import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { boolean } from "hardhat/internal/core/params/argumentTypes";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { performance } from "perf_hooks";

task("setSafeMode", "A task to change the value of state variable")
    .addPositionalParam("newState")
    .setAction(async (taskArgs) => {
        const startTime: number = performance.now();
        const newState: boolean = boolean.parse("value",taskArgs.newState);
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const networkName: string = hre.network.name;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address, signers[0]);

        await milechain.setSafeMode(newState);
        console.log(`State changed to ${newState}`);
        
        const endTime: number = performance.now();
        console.log(`Task completed in ${Math.round(endTime - startTime)}ms.`);
    });