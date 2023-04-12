import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { developmentChains } from "../hardhat.config";
import MongoDatabase from "../utils/db";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Db } from "mongodb";
import { performance } from "perf_hooks";

task("getOwnersRecords", "A task to get the owners'records")
    .addPositionalParam("licensePlate")
    .setAction(async (taskArgs) => {
        const startTime: number = performance.now();
        const hre: HardhatRuntimeEnvironment = require("hardhat");
        const licensePlate: string = taskArgs.licensePlate;
        const networkName: string = hre.network.name;
        const address: string = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        if(developmentChains.includes(networkName)){
            const ownersRecords: MileChain.OwnersRecordStruct[] = await milechain.getOwnersRecords(licensePlate);
            console.log(ownersRecords);
        }else{
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
                    const ownersRecords: MileChain.OwnersRecordStruct[] = await milechain.getOwnersRecords(licensePlate);
                    console.log(ownersRecords);
                }else{
                    console.log("Vehicle not found in database");
                }
            }catch(e){
                console.error(e);
            }
        }

        const endTime: number = performance.now();
        console.log(`Task completed in ${Math.round(endTime - startTime)}ms.`);
    });