import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { developmentChains } from "../hardhat.config";
import MongoDatabase from "../utils/db";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

task("updateMileage", "A task to update a vehicle")
    .addPositionalParam("licensePlate")
    .addPositionalParam("mileage")
    .setAction(async (taskArgs) => {
        const licensePlate: string = taskArgs.licensePlate;
        const mileage: number = parseInt(taskArgs.mileage);
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const networkName: string = hre.network.name;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address, signers[0]);

        if(developmentChains.includes(networkName)){
            await milechain.updateMileage(licensePlate, mileage);
            console.log("Vehicle updated!");
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
                    const oldMileage: number = vehicle.mileage;
                    await database.collection("vehicles").updateOne({
                        licensePlate: licensePlate
                    }, {
                        $set: {
                            mileage: mileage
                        }
                    });

                    console.log("Database updated");

                    try{
                        await milechain.updateMileage(licensePlate, mileage);
                        console.log("Blockchain updated");
                    }catch(e){
                        console.log(e);
                        console.log("Failed to upadte blockchain, reverting database...");

                        await database.collection("vehicles").updateOne({
                            licensePlate: licensePlate
                        }, {
                            $set: {
                                mileage: oldMileage
                            }
                        });

                        console.log("Database reverted");
                    }
                }else{
                    console.log("Vehicle not found in database");
                }
            }catch(e){
                console.log("Failed to update database");
                console.error(e);
            }
        }
    });