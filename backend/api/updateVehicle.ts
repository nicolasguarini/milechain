import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { Db, MongoClient } from "mongodb";
import Web3 from "web3";
import { address, abi } from "../deployments/sepolia/MileChain.json";
import { AbiItem } from "web3-utils";

const mongoClient: MongoClient = new MongoClient(process.env.DB_CONN_STRING!);
const clientPromise = mongoClient.connect();

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  if (event.httpMethod == "GET") {
    const network: string = event.queryStringParameters!.network!;
    const licensePlate: string = event.queryStringParameters!.licensePlate!;

    if (licensePlate == "" || !licensePlate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request" }),
        headers: { "access-control-allow-origin": "*" },
      };
    }

    try {
      if (network == "sepolia" || network == "mainnet") {
        const web3 = new Web3(process.env.SEPOLIA_URL!);
        const contract = new web3.eth.Contract(abi as AbiItem[], address);
        let message = "";
        const blockchainVehicle = await contract.methods
          .getVehicle(licensePlate)
          .call();
        const db = (await clientPromise).db(`milechain-${network}`);
        const dbVehicle = await db.collection("vehicles").findOne({
          licensePlate: { $regex: `${licensePlate}`, $options: "i" },
        });

        if (blockchainVehicle) {
          console.log("Vehicle found on blockchain!");

          if (!dbVehicle) {
            console.log("Inserting vehicle in database");
            await db.collection("vehicles").insertOne({
              licensePlate: blockchainVehicle.licensePlate,
              owner: blockchainVehicle.owner,
              mileage: blockchainVehicle.mileage,
            });

            const owner = await db.collection("owners").findOne({
              address: {
                $regex: `${blockchainVehicle.owner}`,
                $options: "i",
              },
            });
            if (!owner) {
              await db.collection("owners").insertOne({
                address: blockchainVehicle.owner,
              });
            }

            message = "Vehicle inserted in db";
          } else {
            const bcLicensePlate = blockchainVehicle.licensePlate;
            const bcMileage = blockchainVehicle.mileage;
            const bcOwner = blockchainVehicle.owner;

            const dbOwner = dbVehicle.owner;
            const dbMileage = dbVehicle.mileage;

            if (bcOwner != dbOwner || bcMileage != dbMileage) {
              console.log("Found updates on blockchain, updating DB...");
              await db.collection("vehicles").updateOne(
                {
                  licensePlate: { $regex: `${bcLicensePlate}`, $options: "i" },
                },
                {
                  $set: {
                    owner: bcOwner,
                    mileage: parseInt(bcMileage),
                  },
                }
              );
              console.log("DB updated!");
              message = "DB Updated";
            } else {
              message = "No updates needed";
            }
          }
        } else {
          return {
            statusCode: 400,
            body: JSON.stringify({
              message: "Vehicle not found in blockchain",
            }),
            headers: { "access-control-allow-origin": "*" },
          };
        }

        return {
          statusCode: 200,
          body: JSON.stringify({ message: message }),
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
      console.log(e);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "DB or Alchemy Error" }),
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
