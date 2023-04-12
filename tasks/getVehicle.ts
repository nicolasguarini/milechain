import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { developmentChains } from "../hardhat.config";
import MongoDatabase from "../utils/db";
import { performance } from "perf_hooks";

task("getVehicle", "A task to get a vehicle")
    .addPositionalParam("licensePlate")
    .setAction(async (taskArgs) => {
        const startTime: number = performance.now();
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
                    try {
                        console.log("Trying to get vehicle from blockchain");
                        const resVehicle: MileChain.VehicleStruct = await milechain.getVehicle(licensePlate);  
                        console.log("Vehicle found in blockchain, adding to database");
                        await database.collection("vehicles").insertOne({
                            licensePlate: resVehicle.licensePlate,
                            mileage: resVehicle.mileage,
                            owner: resVehicle.owner,
                        });

                        await database.collection("owners").insertOne({
                            address: resVehicle.owner,
                        });
                        
                        console.log("Database updated");
                    } catch (e) {
                        console.error("Vehicle not found in blockchain");
                    }
                }
            }catch(e){
                console.error(e);
            }
        }

        const endTime: number = performance.now();
        console.log(`Task completed in ${Math.round(endTime - startTime)}ms.`);
    });