import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../hardhat.config";
import * as mongoDB from "mongodb";
import MongoDatabase from "../utils/db";

const deployDb: DeployFunction = async function (hre: HardhatRuntimeEnvironment){
    const { network } = hre;
    const DB_CONN_STRING: string|undefined = process.env.DB_CONN_STRING;
    const DB_NAME: string|undefined = process.env.DB_NAME;

    if(!developmentChains.includes(network.name) && DB_CONN_STRING && DB_NAME){
        const DB_NAME = "milechain-" + network.name;
        const dbList: mongoDB.ListDatabasesResult = await MongoDatabase
            .getInstance()
            .getClient()
            .db()
            .admin()
            .listDatabases();

        const database = MongoDatabase.getInstance().getClient().db(DB_NAME);

        if(dbList.databases.find((db) => db.name == DB_NAME) !== undefined){
            console.log(DB_NAME + " already exists, dropping and recreating it."); //we could duplicate the existing db and dropping the duplicate
            await database.dropDatabase();
        }

        try{
            await database.createCollection("vehicles");
            await database.createCollection("owners");
            console.log(DB_NAME + " created!");
        }catch(e){console.error(e);}
    }
}

export default deployDb;
deployDb.tags = ["db"];