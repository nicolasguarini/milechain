import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { Address } from "hardhat-deploy/dist/types";
import { developmentChains } from "../hardhat.config";
import { network } from "hardhat";
import MongoDatabase from "../utils/db";

task("changeOwner", "A task to change the vehicle's owner")
    .addPositionalParam("licensePlate")
    .addPositionalParam("address")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const networkName = hre.network.name;
        const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);

        const licensePlate: string = taskArgs.licensePlate;
        const newAddress: Address = taskArgs.address;

        await milechain.changeOwner(licensePlate, newAddress);
        console.log("Owner changed!");

        if(developmentChains.includes(networkName)){
            const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);
            await milechain.changeOwner(licensePlate, newAddress);
            console.log("Owner changed!");
        }
        else{
            const contractAddress = require(`../deployments/${networkName}/MileChain.json`).address;
            const signers = await hre.ethers.getSigners();
            const DB_NAME = "milechain-" + networkName;
            const database = MongoDatabase
                .getInstance()
                .getClient()
                .db(DB_NAME);
            try{
                await database.collection("vehicles").updateOne({licensePlate: licensePlate}, {$set: {owner: newAddress}});
            }catch(e){
                console.error(e);
            }
            try{
                const myContract: MileChain = await hre.ethers.getContractAt("MileChain", contractAddress, signers[0]);
                await myContract.changeOwner(licensePlate, newAddress);
                console.log("Changed on blockchain");
            }catch(e){
                await database.collection("vehicles").updateOne({licensePlate: licensePlate}, {$set: {owner: signers[0].address}});
            }
        }
    });