import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import MongoDatabase from "../utils/db";
import { developmentChains } from "../hardhat.config";

task("getMileageRecords", "A task to get the vehicle's records")
    .addPositionalParam("licensePlate")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const networkName = hre.network.name;

        if(developmentChains.includes(networkName)){
            const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);
            const mileageRecord: MileChain.MileageRecordStruct[] = await milechain.getMileageRecords(taskArgs.licensePlate);
            console.log(mileageRecord);
        }
        else{
            const contractAddress = require(`../deployments/${networkName}/MileChain.json`).address;
            const signers = await hre.ethers.getSigners();
            const DB_NAME = "milechain-" + networkName;
            const database = MongoDatabase
                .getInstance()
                .getClient()
                .db(DB_NAME);
            //get from database vehicle with licensePlate and return its mileageRecords
            try{
                const vehicle = await database.collection("vehicles").findOne({licensePlate: taskArgs.licensePlate});
                
                if(vehicle){
                    const milechain: MileChain = await hre.ethers.getContractAt("MileChain", contractAddress, signers[0]);
                    const mileageRecord: MileChain.MileageRecordStruct[] = await milechain.getMileageRecords(taskArgs.licensePlate);
                    console.log(mileageRecord);
                }
                else
                    console.log("Vehicle not found in database");
            }
            catch(e){
                console.error(e);
            }
        }

    });