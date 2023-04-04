import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { developmentChains } from "../hardhat.config";
import MongoDatabase from "../utils/db";


task("addVehicle", "A task to add a new vehicle")
    .addPositionalParam("licensePlate")
    .addPositionalParam("mileage")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const networkName = hre.network.name;
        const licensePlate: string = taskArgs.licensePlate;
        const mileage: number = parseInt(taskArgs.mileage);

        if(developmentChains.includes(networkName)){
            const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);
            await milechain.addVehicle(licensePlate, mileage);
            console.log("Vehicle added!");
        }else{
            const contractAddress = require(`../deployments/${networkName}/MileChain.json`).address;
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
                    name: "",
                    surname: "",
                    address: signers[0].address
                });
            }catch(e){
                console.error(e);
            }
            
            try{
                const myContract: MileChain = await hre.ethers.getContractAt("MileChain", contractAddress, signers[0]);
                await myContract.addVehicle(licensePlate, mileage);
                console.log("Added to blockchain");
            }catch(e){
                await database.collection("vehicles").deleteOne({licensePlate: licensePlate});
            }
        }
    });