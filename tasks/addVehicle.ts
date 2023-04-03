import { task } from "hardhat/config";
import { MileChain } from "../typechain-types";
import { address } from "../deployments/localhost/MileChain.json";
import { developmentChains } from "../hardhat.config";
import * as mongoDB from "mongodb";

task("addVehicle", "A task to add a new vehicle")
    .addPositionalParam("licensePlate")
    .addPositionalParam("mileage")
    .setAction(async (taskArgs) => {
        const hre = require("hardhat");
        const licensePlate: string = taskArgs.licensePlate;
        const mileage: number = parseInt(taskArgs.mileage);

        if(developmentChains.includes(hre.network.name)){
            const milechain: MileChain = await hre.ethers.getContractAt("MileChain", address);
            await milechain.addVehicle(licensePlate, mileage);
            console.log("Vehicle added!");
        }else{
            const networkName = hre.network.name;
            const contractAddress = require(`../deployments/${networkName}/MileChain.json`).address;
            const signers = await hre.ethers.getSigners();

            const DB_CONN_STRING: string|undefined = process.env.DB_CONN_STRING;
            const DB_NAME: string|undefined = process.env.DB_NAME;
            const DB_FULL_NAME = DB_NAME + "-" + networkName;

            console.log("Connecting to MongoDB Atlas...");
            const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING!);
            await client.connect();
            const database = client.db(DB_FULL_NAME);

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

                console.log("");
            }catch(e){
                console.log(e);
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