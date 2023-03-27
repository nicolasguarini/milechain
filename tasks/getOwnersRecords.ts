import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";

task("getOwnersRecords", "A task to get the owners'records")
    .addPositionalParam("licensePlate")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const ownersRecords: MileChain.OwnersRecordStruct[] = await milechain.getOwnersRecords(taskArgs.licensePlate);
        console.log(ownersRecords);
    });