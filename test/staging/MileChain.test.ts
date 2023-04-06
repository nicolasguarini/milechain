import { ethers, network } from "hardhat";
import { developmentChains } from "../../hardhat.config";
import { MileChain } from "../../typechain-types";
import { assert } from "chai";
import MongoDatabase from "../../utils/db";
import { Db } from "mongodb";

if(!developmentChains.includes(network.name)){
    describe("MileChain Staging Tests", async function () {
        let milechain: MileChain;
        let db: Db;
        const networkName: string = network.name;
        const address: string = require(`../../deployments/${networkName}/MileChain.json`).address;
        const DB_NAME: string = "milechain-" + networkName;
        
        beforeEach(async function () {
            milechain = await ethers.getContractAt("MileChain", address);
            db = MongoDatabase.getInstance().getClient().db(DB_NAME);
        });

        it("Is synchronized with DB", async function () {
            const vehicles: any[] = await db.collection("vehicles").find().toArray();

            for(const vehicle of vehicles){
                const blockchainVehicle: MileChain.VehicleStruct = await milechain.getVehicle(vehicle.licensePlate);

                assert.equal(vehicle.licensePlate, blockchainVehicle.licensePlate);
                assert.equal(vehicle.mileage, blockchainVehicle.mileage);
                assert.equal(vehicle.owner, blockchainVehicle.owner);
            }
        });
    });
}else{
    describe.skip;
}
