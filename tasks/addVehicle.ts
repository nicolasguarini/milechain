import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";

task("addVehicle", "A task to add a new vehicle")
    .addPositionalParam("licensePlate")
    .addPositionalParam("mileage")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const licensePlate: string = taskArgs.licensePlate;
        const mileage: number = parseInt(taskArgs.mileage);

        await milechain.addVehicle(licensePlate, mileage);
        console.log("Vehicle added!");
    });