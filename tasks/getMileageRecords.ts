import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import MongoDatabase from "../utils/db";
import { developmentChains } from "../hardhat.config";

task("getMileageRecords", "A task to get the vehicle's records")
    .addPositionalParam("licensePlate")
    .setAction(async (taskArgs) => {
        const licensePlate: string = taskArgs.licensePlate;
        const hre = require("hardhat");
        const networkName = hre.network.name;
        const address = require(`../deployments/${networkName}/MileChain.json`).address;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        if(developmentChains.includes(networkName)){
            const mileageRecord: MileChain.MileageRecordStruct[] = await milechain.getMileageRecords(licensePlate);
            console.log(mileageRecord);
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
                    const mileageRecord: MileChain.MileageRecordStruct[] = await milechain.getMileageRecords(licensePlate);
                    console.log(mileageRecord);
                }else{
                    console.log("Vehicle not found in database");
                }
            }
            catch(e){
                console.error(e);
            }
        }
    });