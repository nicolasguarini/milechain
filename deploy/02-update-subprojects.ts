import { HardhatRuntimeEnvironment } from "hardhat/types";

const updateSubprojects = async function (hre: HardhatRuntimeEnvironment) {
  const { network } = hre;
  const chainId: string = network.config.chainId!.toString();
  let networkName: string = network.name;

  if (networkName == "hardhat") networkName = "localhost";

  const milechain = require(`../deployments/${networkName}/MileChain.json`);
  const address: string = milechain.address;
  const abi = milechain.abi;

  updateFrontend(chainId, address, abi);
  updateBackend(chainId, address, abi);
};

async function updateFrontend(chainId: string, address: string, abi: any) {
  console.log("Updating frontend...");
  const fs = require("fs");
  const path = require("path");
  const addressesFilePath = path.join(
    __dirname,
    "../frontend/constants/addresses.json"
  );
  const abiFilePath = path.join(__dirname, "../frontend/constants/abi.json");
  let addresses: any = {};

  try {
    addresses = JSON.parse(fs.readFileSync(addressesFilePath));
  } catch (err: any) {
    console.error(`Error while reading ${addressesFilePath}: ${err.message}`);
  }

  addresses[chainId] = address;

  try {
    fs.writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2));
    console.log(`Updated address for chainId ${chainId} to ${address}`);
  } catch (err: any) {
    console.error(
      `Error while writing file ${addressesFilePath}: ${err.message}`
    );
  }

  try {
    fs.writeFileSync(abiFilePath, JSON.stringify(abi, null, 2));
    console.log(`Updated abi`);
  } catch (err: any) {
    console.error(`Error while writing file ${abiFilePath}: ${err.message}`);
  }
}

async function updateBackend(chainId: string, address: string, abi: any) {
  console.log("Updating backend...");
  const fs = require("fs");
  const path = require("path");
  const addressesFilePath = path.join(
    __dirname,
    "../backend/constants/addresses.json"
  );
  const abiFilePath = path.join(__dirname, "../backend/constants/abi.json");
  let addresses: any = {};

  try {
    addresses = JSON.parse(fs.readFileSync(addressesFilePath));
  } catch (err: any) {
    console.error(`Error while reading ${addressesFilePath}: ${err.message}`);
  }

  addresses[chainId] = address;

  try {
    fs.writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2));
    console.log(`Updated address for chainId ${chainId} to ${address}`);
  } catch (err: any) {
    console.error(
      `Error while writing file ${addressesFilePath}: ${err.message}`
    );
  }

  try {
    fs.writeFileSync(abiFilePath, JSON.stringify(abi, null, 2));
    console.log(`Updated abi`);
  } catch (err: any) {
    console.error(`Error while writing file ${abiFilePath}: ${err.message}`);
  }
}

export default updateSubprojects;
updateSubprojects.tags = ["all", "update"];
