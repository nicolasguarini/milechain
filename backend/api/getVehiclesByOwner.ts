import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { log } from "console";
import { Db } from "mongodb";
import { MongoClient } from "mongodb";

const mongoClient: MongoClient = new MongoClient(process.env.DB_CONN_STRING!);
const clientPromise = mongoClient.connect();

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod == "GET") {
    const network: string = event.queryStringParameters!.network!;
    const address: string = event.queryStringParameters!.address!;

    try {
      if (network == "sepolia" || network == "mainnet") {
        const database: Db = (await clientPromise).db(`milechain-${network}`);
        const vehicles: any[] = await database
          .collection("vehicles")
          .find({
            owner: { $regex: `${address}`, $options: "i" },
          })
          .toArray();

        return {
          statusCode: 200,
          body: JSON.stringify({ vehicles: vehicles }),
          headers: { "access-control-allow-origin": "*" },
        };
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid network" }),
          headers: { "access-control-allow-origin": "*" },
        };
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "DB Error" }),
        headers: { "access-control-allow-origin": "*" },
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
      headers: { "access-control-allow-origin": "*" },
    };
  }
};

export { handler };
