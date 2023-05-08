import { deployments, ethers, network } from "hardhat";
import { developmentChains } from "../../hardhat.config";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { MileChain, MileChain__factory } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("MileChain Unit Tests", function () {
      let accounts: SignerWithAddress[];
      let deployer: SignerWithAddress;
      let secondDeployer: SignerWithAddress;
      let milechainFactory: MileChain__factory;
      let milechain: MileChain;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        secondDeployer = accounts[1];

        await deployments.fixture(["milechain"]);
        milechainFactory = await ethers.getContractFactory("MileChain");
        milechain = await milechainFactory.deploy([secondDeployer.address]);
      });

      describe("addVehicle", function () {
        it("saves a new vehicle", async () => {
          await milechain.addVehicle("AA000AA", 1000);
          const vehicle: MileChain.VehicleStruct = await milechain.getVehicle(
            "AA000AA"
          );
          const { licensePlate, mileage, owner } = vehicle;

          assert.equal("AA000AA", licensePlate);
          assert.equal(1000, mileage);
          assert.equal(deployer.address, owner);
        });

        it("updates mileage records", async () => {
          await milechain.addVehicle("AA000AA", 1000);
          const mileageRecord: MileChain.MileageRecordStruct[] =
            await milechain.getMileageRecords("AA000AA");

          assert.equal(1000, mileageRecord[0].mileage);
        });

        it("updates owners record", async () => {
          await milechain.addVehicle("AA000AA", 1000);
          const ownersRecord: MileChain.OwnersRecordStruct[] =
            await milechain.getOwnersRecords("AA000AA");

          assert.equal(deployer.address, ownersRecord[0].owner);
        });

        it("reverts if vehicle already exists", async () => {
          await milechain.addVehicle("AA000AA", 1000);

          await expect(
            milechain.addVehicle("AA000AA", 1000)
          ).revertedWithCustomError(milechain, "VehicleAlreadyExists");
        });

        it("reverts if contract is in safe mode", async () => {
          await milechain.setSafeMode(true);

          await expect(
            milechain.addVehicle("AA000AA", 1000)
          ).revertedWithCustomError(milechain, "SafeModeEnabled");
        });
      });

      describe("updateMileage", function () {
        it("updates the miles correctly", async () => {
          await milechain.addVehicle("AA000AA", 1000);
          await milechain.updateMileage("AA000AA", 10000);
          const vehicle: MileChain.VehicleStruct = await milechain.getVehicle(
            "AA000AA"
          );
          const vehicleRecord: MileChain.MileageRecordStruct[] =
            await milechain.getMileageRecords("AA000AA");

          assert.equal(vehicle.mileage, 10000);
          assert.equal(vehicleRecord[0].mileage, 1000);
          assert.equal(vehicleRecord[1].mileage, 10000);
        });

        it("reverts if vehicle does not exists", async () => {
          await expect(
            milechain.updateMileage("AA000AA", 1200)
          ).revertedWithCustomError(milechain, "VehicleNotFound");
        });

        it("reverts if you are not the owner", async () => {
          await milechain.addVehicle("AA000AA", 1000);

          await expect(
            milechain.connect(accounts[1]).updateMileage("AA000AA", 2000)
          ).revertedWithCustomError(milechain, "VehicleOfAnotherOwner");
        });

        it("reverts if the mileage is lower than current mileage", async () => {
          await milechain.addVehicle("AA000AA", 1000);

          await expect(
            milechain.updateMileage("AA000AA", 100)
          ).revertedWithCustomError(milechain, "InvalidMileage");
        });

        it("reverts if contract is in safe mode", async () => {
          await milechain.addVehicle("AA000AA", 1000);
          await milechain.setSafeMode(true);

          await expect(
            milechain.updateMileage("AA000AA", 10000)
          ).revertedWithCustomError(milechain, "SafeModeEnabled");
        });
      });

      describe("changeOwner", function () {
        it("updates the owner correctly", async () => {
          await milechain.addVehicle("AA000AA", 1000);
          await milechain.changeOwner("AA000AA", accounts[1].address);
          const vehicle: MileChain.VehicleStruct = await milechain.getVehicle(
            "AA000AA"
          );
          const ownersRecords: MileChain.OwnersRecordStruct[] =
            await milechain.getOwnersRecords("AA000AA");

          assert.equal(accounts[1].address, vehicle.owner);
          assert.equal(deployer.address, ownersRecords[0].owner);
          assert.equal(accounts[1].address, ownersRecords[1].owner);
        });

        it("reverts if the vehicle does not exists", async () => {
          await expect(
            milechain.changeOwner("AA000AA", accounts[1].address)
          ).revertedWithCustomError(milechain, "VehicleNotFound");
        });

        it("reverts if you are not the owner", async () => {
          await milechain.addVehicle("AA000AA", 1000);

          await expect(
            milechain
              .connect(accounts[1])
              .changeOwner("AA000AA", accounts[1].address)
          ).revertedWithCustomError(milechain, "VehicleOfAnotherOwner");
        });

        it("reverts if the contract is in safe mode", async () => {
          await milechain.addVehicle("AA000AA", 1000);
          await milechain.setSafeMode(true);

          await expect(
            milechain.changeOwner("AA000AA", accounts[1].address)
          ).revertedWithCustomError(milechain, "SafeModeEnabled");
        });
      });

      describe("getVehicle", function () {
        it("reverts if vehicle does not exists", async () => {
          await expect(milechain.getVehicle("AA000AA")).revertedWithCustomError(
            milechain,
            "VehicleNotFound"
          );
        });
      });

      describe("getMileageRecords", function () {
        it("reverts if vehicle does not exists", async () => {
          await expect(
            milechain.getMileageRecords("AA000AA")
          ).revertedWithCustomError(milechain, "VehicleNotFound");
        });
      });

      describe("getOwnersRecords", function () {
        it("reverts if vehicle does not exists", async () => {
          await expect(
            milechain.getOwnersRecords("AA000AA")
          ).revertedWithCustomError(milechain, "VehicleNotFound");
        });
      });
    });
