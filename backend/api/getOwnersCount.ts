import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { Collection, Db } from "mongodb";
import { MongoClient } from "mongodb";

const mongoClient: MongoClient = new MongoClient(process.env.DB_CONN_STRING!);
const clientPromise = mongoClient.connect();

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const network: string = event.queryStringParameters!.network!;

    try{
        if(network == "sepolia" || network == "mainnet"){
            const database: Db = (await clientPromise).db(`milechain-${network}`);
            const collection: Collection = database.collection("owners");
            const count: number = await collection.countDocuments();

            return {
                statusCode: 200,
                body: JSON.stringify({ count: count })
            };
        }else{
            throw Error("Invalid network");
        }
    }catch(e){
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error" })
        };
    }
};

export { handler };
