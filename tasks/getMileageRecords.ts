import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";

task("getMileageRecords", "A task to get the vehicle's records")
    .addPositionalParam("licensePlate")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const mileageRecord: MileChain.MileageRecordStruct[] = await milechain.getMileageRecords(taskArgs.licensePlate);
        console.log(mileageRecord);
    });