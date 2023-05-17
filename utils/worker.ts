import { HardhatRuntimeEnvironment } from "hardhat/types";
import { workerData, parentPort } from "worker_threads";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MileChain } from "../typechain-types";
import { writeToExtendedCSV } from "./writeToCSV";

async function main() {
  const hre: HardhatRuntimeEnvironment = require("hardhat");
  const signers: SignerWithAddress[] = await hre.ethers.getSigners();
  const address: string =
    require(`../deployments/localhost/MileChain.json`).address;
  const milechain: MileChain = await hre.ethers.getContractAt(
    "MileChain",
    address,
    signers[workerData.account]
  );

  const csvData = [];
  for (const vehicle of workerData.vehicles) {
    let start = new Date().getTime();
    await milechain.addVehicle(vehicle.licensePlate, vehicle.mileage);
    await fetch(
      `${process.env.SERVER_BASE_URL}.netlify/functions/updateVehicle?chainId=31337&licensePlate=${vehicle.licensePlate}`
    );
    let end = new Date().getTime();
    let elapsed = Math.round(end - start);

    csvData.push({
      thread: workerData.account,
      action: "addVehicle",
      start: start,
      end: end,
      duration: elapsed,
    });

    console.log(
      `${workerData.account} added ${vehicle.licensePlate} in ${elapsed}ms`
    );

    for (const mileage of vehicle.mileageUpdates.slice(1)) {
      start = new Date().getTime();
      await milechain.updateMileage(vehicle.licensePlate, mileage);
      await fetch(
        `${process.env.SERVER_BASE_URL}.netlify/functions/updateVehicle?chainId=31337&licensePlate=${vehicle.licensePlate}`
      );
      end = new Date().getTime();
      elapsed = Math.round(end - start);

      csvData.push({
        thread: workerData.account,
        action: "updateVehicle",
        start: start,
        end: end,
      });

      console.log(
        `${workerData.account} updated ${vehicle.licensePlate} in ${elapsed}ms`
      );
    }
  }

  await writeToExtendedCSV("durations_conc.csv", csvData);
  parentPort?.postMessage(`Thread ${workerData.account} finished!`);
}

main().catch((error) => {
  console.error(error);
});
