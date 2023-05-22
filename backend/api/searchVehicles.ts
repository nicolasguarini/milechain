import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { Db } from "mongodb";
import { MongoClient } from "mongodb";
import { chainsMap } from "../constants/chains";

const mongoClient: MongoClient = new MongoClient(process.env.DB_CONN_STRING!);
const clientPromise = mongoClient.connect();

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod == "GET") {
    const query: string = event.queryStringParameters!.query!;
    const chainId: number = parseInt(event.queryStringParameters!.chainId!);
    const networkName = chainsMap.get(chainId);

    if (query == "" || !query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request" }),
        headers: { "access-control-allow-origin": "*" },
      };
    }

    try {
      if (networkName) {
        const database: Db = (await clientPromise).db(
          `milechain-${networkName}`
        );
        const vehicles: any[] = await database
          .collection("vehicles")
          .find({
            licensePlate: { $regex: `${query}`, $options: "i" },
          }).limit(50)
          .toArray();
        console.log(vehicles);
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
