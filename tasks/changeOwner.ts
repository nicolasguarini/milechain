import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { Address } from "hardhat-deploy/dist/types";
import { developmentChains } from "../hardhat.config";
import MongoDatabase from "../utils/db";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Db } from "mongodb";
import { performance } from "perf_hooks";

task("changeOwner", "A task to change the vehicle's owner")
    .addPositionalParam("licensePlate")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const startTime: number = performance.now();
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        const networkName: string = hre.network.name;
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        const licensePlate: string = taskArgs.licensePlate;
        const newAddress: Address = taskArgs.address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address, signers[0]);

        if(developmentChains.includes(networkName)){
            await milechain.changeOwner(licensePlate, newAddress);
            console.log("Owner changed!");
        }
        else{
            const DB_NAME: string = "milechain-" + networkName;
            const database: Db = MongoDatabase
                .getInstance()
                .getClient()
                .db(DB_NAME);

            try{
                const vehicle = await database.collection("vehicles").findOne({
                    licensePlate: licensePlate
                });

                if(vehicle){
                    await database.collection("vehicles").updateOne({
                        licensePlate: licensePlate
                    }, {
                        $set: {
                            owner: newAddress
                        }
                    });
                    
                    console.log("Database updated");

                    try{
                        await milechain.changeOwner(licensePlate, newAddress);
                        console.log("Blockchain updated");
                    }catch(e){
                        console.log(e);
                        console.log("Failed to update blockchain, reverting database...");
    
                        await database.collection("vehicles").updateOne({
                            licensePlate: licensePlate
                        }, {
                            $set: {
                                owner: signers[0].address
                            }
                        });
    
                        console.log("Database reverted")
                    }
                }else{
                    console.log("Vehicle not found in database");
                }
            }catch(e){
                console.log("Failed to update database");
                console.error(e);
            }
        }

        const endTime: number = performance.now();
        console.log(`Task completed in ${Math.round(endTime - startTime)}ms.`);
    });