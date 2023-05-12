import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { log } from "console";
import { Db, MongoClient } from "mongodb";
import {checkToken} from "../utils/checkToken";
import { chainsMap } from "../constants/chains";

const mongoClient: MongoClient = new MongoClient(process.env.DB_CONN_STRING!);
const clientPromise = mongoClient.connect();

const handler: Handler = async ( event: HandlerEvent, context: HandlerContext ) => {
    console.log("ciao")
    if(event.httpMethod=="GET"){
        const address: string = event.queryStringParameters!.address!;
        const chainId: number = parseInt(event.queryStringParameters!.chainId!);
        const networkName = chainsMap.get(chainId);
        try{
            const db = (await clientPromise).db(`milechain-${networkName}`);
            const user: any = await db.collection("owners").findOne({
                address: address,
            });
            return {
                statusCode: 200,
                body: JSON.stringify({ user: user }),
                headers: { "access-control-allow-origin": "*",
                "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS", },
                };
            }
            catch(e){
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: "DB Error" }),
                    headers: { "access-control-allow-origin": "*",
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS", },
                  };
            }
    }
    else{
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method not allowed" }),
            headers: { "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS", },
          };
    }

}