import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../hardhat.config";
import { PrismaClient } from "@prisma/client";


const deployPrisma: DeployFunction = async function(hre: HardhatRuntimeEnvironment){
    const {network} = hre;
    const DATABASE_URL = process.env.DATABASE_URL

    if(!developmentChains.includes(network.name) && DATABASE_URL){
        console.log("siamo dentro");
        
        const prisma = new PrismaClient();
        await prisma.$connect();
        console.log(prisma);
        
        const vehicle = await prisma.vehicle.create({
            data: {
                licensePlate: "BB000BB",
                mileage: 1000,
                owner: "0xporcodio123"
            }
        });

        console.log(vehicle);
        
        
    }
}

export default deployPrisma;
deployPrisma.tags = ["all", "db"]