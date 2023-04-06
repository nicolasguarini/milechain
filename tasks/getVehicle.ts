import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { developmentChains } from "../hardhat.config";
import MongoDatabase from "../utils/db";

task("getVehicle", "A task to get a vehicle")
    .addPositionalParam("licensePlate")
    .setAction(async (taskArgs) => {
        const licensePlate: string = taskArgs.licensePlate;
        const hre = require("hardhat");
        const networkName = hre.network.name;
        const address = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        if(developmentChains.includes(networkName)){
            const vehicle: MileChain.VehicleStruct = await milechain.getVehicle(taskArgs.licensePlate);
            console.log(vehicle);
        }else{
            const DB_NAME = "milechain-" + networkName;
            const database = MongoDatabase
                .getInstance()
                .getClient()
                .db(DB_NAME);

            try{
                const vehicle = await database.collection("vehicles").findOne({
                    licensePlate: licensePlate
                });

                if(vehicle){
                    const resVehicle: MileChain.VehicleStruct = await milechain.getVehicle(licensePlate);
                    console.log(resVehicle);
                }else{
                    console.log("Vehicle not found in database");

                    // TODO: check if the vehicle is present in the blockchain, if so, update the db
                }
            }catch(e){
                console.error(e);
            }
        }
    });