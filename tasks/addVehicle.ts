import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { developmentChains } from "../hardhat.config";
import MongoDatabase from "../utils/db";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("addVehicle", "A task to add a new vehicle")
    .addPositionalParam("licensePlate")
    .addPositionalParam("mileage")
    .setAction(async (taskArgs) => {
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const networkName: string = hre.network.name;
        const licensePlate: string = taskArgs.licensePlate;
        const mileage: number = parseInt(taskArgs.mileage);
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;

        if(developmentChains.includes(networkName)){
            const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);
            await milechain.addVehicle(licensePlate, mileage);
            console.log("Vehicle added!");
        }else{
            const signers = await hre.ethers.getSigners();
            const DB_NAME = "milechain-" + networkName;
            const database = MongoDatabase
                .getInstance()
                .getClient()
                .db(DB_NAME);

            try{
                await database.collection("vehicles").insertOne({
                    licensePlate: licensePlate,
                    mileage: mileage,
                    owner: signers[0].address
                });

                await database.collection("owners").insertOne({
                    address: signers[0].address
                });
                
                console.log("Database updated");

                try{
                    const myContract: MileChain = await hre.ethers.getContractAt("MileChain", address, signers[0]);
                    await myContract.addVehicle(licensePlate, mileage);

                    console.log("Added to blockchain");
                }catch(e){
                    console.log("Failed to add vehicle to blockchain, reverting database...");

                    await database.collection("vehicles").deleteOne({
                        licensePlate: licensePlate
                    });

                    console.log("Database reverted.");
                }
            }catch(e){
                console.log("Failed to update database");
                console.error(e);
            }
        }
    });