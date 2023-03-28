import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { Address } from "hardhat-deploy/dist/types";

task("changeOwner", "A task to change the vehicle's owner")
    .addPositionalParam("licensePlate")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const licensePlate: string = taskArgs.licensePlate;
        const newAddress: Address = taskArgs.address;

        await milechain.changeOwner(licensePlate, newAddress);
        console.log("Owner changed!");
    });