import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { log } from "console";
import { Db, MongoClient } from "mongodb";
import {checkToken} from "../utils/checkToken";
import { chainsMap } from "../constants/chains";

const mongoClient: MongoClient = new MongoClient(process.env.DB_CONN_STRING!);
const clientPromise = mongoClient.connect();

const handler: Handler = async ( event: HandlerEvent, context: HandlerContext ) => {
    
    if(event.httpMethod == "GET"){
        console.log(event.headers.token);
        const name: string = event.queryStringParameters!.name!;
        const bio: string = event.queryStringParameters!.bio!;
        const address: string = event.queryStringParameters!.address!;
        const token: string = event.queryStringParameters!.token!;
        const chainId: number = parseInt(event.queryStringParameters!.chainId!);
        const networkName = chainsMap.get(chainId);
        if(checkToken(address,token)){
            if(name == "" || !name || bio == "" || !bio || address == "" || !address){
                return{
                    statusCode: 400,
                    body: JSON.stringify({ message: "Invalid request" }),
                    headers: { "access-control-allow-origin": "*",
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS", },
                };
                }
                const db = (await clientPromise).db(`milechain-${networkName}`);
                await db.collection("owners").updateOne(
                    {
                      address: { $regex: `${address}`, $options: "i" },
                    },
                    {
                      $set: {
                        name: name,
                        bio: bio,
                      },
                    }
                  );
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "Owner data updated successfully",
                    }),
                    headers: { "access-control-allow-origin": "*",
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS", },
                  };
            }
        else{
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized" }),
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

export { handler };
