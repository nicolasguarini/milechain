import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../hardhat.config";
import * as mongoDB from "mongodb";

const deployDb: DeployFunction = async function (hre: HardhatRuntimeEnvironment){
    const { network } = hre;
    const DB_CONN_STRING: string|undefined = process.env.DB_CONN_STRING;
    const DB_NAME: string|undefined = process.env.DB_NAME;

    if(!developmentChains.includes(network.name) && DB_CONN_STRING && DB_NAME){
        const DB_FULL_NAME = DB_NAME + "-" + network.name;

        console.log("Connecting to MongoDB Atlas...");
        const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);
        await client.connect();
        console.log("Connected!");
        
        const dbList: mongoDB.ListDatabasesResult = await client.db().admin().listDatabases();
        const database = client.db(DB_FULL_NAME);

        if(dbList.databases.find((db) => db.name == DB_FULL_NAME) === undefined){
            console.log("Creating " + DB_FULL_NAME + " database...");
        }else{
            console.log(DB_FULL_NAME + " already exists, dropping and recreating it."); //we could duplicate the existing db and dropping the duplicate
            await database.dropDatabase();
        }

        try{
            await database.createCollection("vehicles");
            await database.createCollection("owners");
            console.log(DB_FULL_NAME + " created!");
        }finally{
            client.close();
            console.log("Client closed.")
        }
    }
}

export default deployDb;
deployDb.tags = ["all", "db"];