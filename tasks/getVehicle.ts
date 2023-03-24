import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";

task("getVehicle", "A task to get a vehicle")
    .addPositionalParam("licensePlate")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const vehicle: MileChain.VehicleStruct = await milechain.getVehicle(taskArgs.licensePlate);
        console.log(vehicle);
    });