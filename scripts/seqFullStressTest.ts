import { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MileChain } from "../typechain-types";
import { writeToCSV } from "../utils/writeToCSV";

const DATASET_FILE = "dataset.json";
const CSV_FILE = "durations_seq_full.csv";

async function run() {
  const hre: HardhatRuntimeEnvironment = require("hardhat");
  const signers: SignerWithAddress[] = await hre.ethers.getSigners();
  const address: string =
    require(`../deployments/localhost/MileChain.json`).address;
  const milechain: MileChain = await hre.ethers.getContractAt(
    "MileChain",
    address,
    signers[0]
  );

  const dataset = JSON.parse(fs.readFileSync(DATASET_FILE, "utf8"));
  const csvData = [];
  for (const vehicle of dataset) {
    const globalStart = performance.now();

    let start = performance.now();
    await milechain.addVehicle(vehicle.licensePlate, vehicle.mileage);
    await fetch(
      `${process.env.SERVER_BASE_URL}.netlify/functions/updateVehicle?chainId=31337&licensePlate=${vehicle.licensePlate}`
    )
      .then((res) => res.json())
      .then((jsonData) => console.log(jsonData));

    let end = performance.now();
    let elapsed = Math.round(end - start);

    console.log(`Added ${vehicle.licensePlate} in ${elapsed}ms`);
    csvData.push({ action: "addVehicle", duration: elapsed });

    for (const mileage of vehicle.mileageUpdates.slice(1)) {
      start = performance.now();
      await milechain.updateMileage(vehicle.licensePlate, mileage);
      await fetch(
        `${process.env.SERVER_BASE_URL}.netlify/functions/updateVehicle?chainId=31337&licensePlate=${vehicle.licensePlate}`
      )
        .then((res) => res.json())
        .then((jsonData) => console.log(jsonData));

      end = performance.now();
      elapsed = Math.round(end - start);
      console.log(`Updated ${vehicle.licensePlate} in ${elapsed}ms`);

      csvData.push({ action: "updateVehicle", duration: elapsed });
    }
    const globalEnd = performance.now();
    const globalDuration = Math.round(globalEnd - globalStart);
    console.log(`${vehicle.licensePlate} completed in ${globalDuration}ms`);
  }

  await writeToCSV(CSV_FILE, csvData);
}

run().catch((err) => console.error(err));
