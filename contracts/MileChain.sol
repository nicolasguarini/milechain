// SPDX-License-Identifier: GNU
pragma solidity ^0.8.18;

import "./Owned.sol";

/**
 * A contract for keeping track of mileage records for vehicles.
 * @title MileChain
 * @author Nicolas Guarini, Lorenzo Ficazzola
 */
contract MileChain is Owned {
    /**
     * @dev Define the Vehicle struct with licencePlate, owner and mileage
     */
    struct Vehicle {
        string licensePlate;
        address owner;
        uint256 mileage;
    }

    struct mileageRecord{
        uint256[] miles;
        uint256 [] times;
    }

    /**
     * @dev Define mappings to keep track of vehicles, their mileage records, and owners.
     */
    mapping(string => Vehicle) private vehicles;
    mapping(string => mileageRecord) private mileageRecords;
    mapping(string => address[]) private ownersRecords;

    /**
     * Function to add a new vehicle
     * @param licensePlate The licence plate of the vehicle
     * @param mileage The initial mileage of the vehicle
     */
    function addVehicle(string memory licensePlate, uint256 mileage) public {
        require(
            vehicles[licensePlate].owner == address(0),
            "Vehicle already exists"
        );
        require(
            !safeMode,
            "Contract is in read-only mode for security reasons."
        );
        Vehicle memory newVehicle = Vehicle(licensePlate, msg.sender, mileage);
        vehicles[licensePlate] = newVehicle;
        uint256[] memory miles = new uint256[](1);
        uint256[] memory times =  new uint256[](1);
        miles[0]=mileage;
        times[0]=block.timestamp;
        mileageRecords[licensePlate]= mileageRecord(miles,times);
        ownersRecords[licensePlate].push(msg.sender);
    }

    /**
     * Function to update the mileage of the vehicle
     * @param licensePlate The licence plate of the vehicle
     * @param mileage The new mileage of the vehicle
     */
    function updateMileage(string memory licensePlate, uint256 mileage) public {
        require(
            vehicles[licensePlate].owner == msg.sender,
            "You do not own this vehicle"
        );
        require(
            mileage > vehicles[licensePlate].mileage,
            "New mileage must be greater than current mileage"
        );
        require(
            !safeMode,
            "Contract is in read-only mode for security reasons."
        );
        vehicles[licensePlate].mileage = mileage;
        mileageRecords[licensePlate].miles.push(mileage);
        mileageRecords[licensePlate].times.push(block.timestamp);
    }

    /**
     * Function to change the owner of a vehicle
     * @param licensePlate The licence plate of the veichle
     * @param newOwner The new owner of the vehicle
     */
    function changeOwner(string memory licensePlate, address newOwner) public {
        require(
            vehicles[licensePlate].owner != address(0),
            "Vehicle not found"
        );
        require(
            !safeMode,
            "Contract is in read-only mode for security reasons."
        );
        vehicles[licensePlate].owner = newOwner;
        ownersRecords[licensePlate].push(newOwner);
    }

    /**
     * Function to get the owner and the latest mileage of a vehicle
     * @param licensePlate The licence plate of the vehicle
     * @return The licence plate of the vehicle
     * @return The owner's address of the vehicle
     * @return The current mileage of the vehicle
     */
    function getVehicleByLicencePlate(
        string memory licensePlate
    ) public view returns (string memory, address, uint256) {
        require(
            vehicles[licensePlate].owner != address(0),
            "Vehicle not found"
        );
        return (
            vehicles[licensePlate].licensePlate,
            vehicles[licensePlate].owner,
            vehicles[licensePlate].mileage
        );
    }

    /**
     * Function to get the mileage records of a vehicle
     * @param licensePlate The licence plate of the vehicle
     * @return The mileage records of a vehicle
     */
    function getMileageRecord(
        string memory licensePlate
    ) public view returns (uint256[] memory,uint256[] memory) {
        require(
            vehicles[licensePlate].owner != address(0),
            "Vehicle not found"
        );
        return ( mileageRecords[licensePlate].miles, mileageRecords[licensePlate].times);
    }

    /**
     * Function to get the owners records of a vehicle
     * @param licensePlate The licence plate of the vehicle
     * @return The owners records of the vehicle
     */
    function getOwnersRecords(
        string memory licensePlate
    ) public view returns (address[] memory) {
        require(
            vehicles[licensePlate].owner != address(0),
            "Vehicle not found"
        );
        return ownersRecords[licensePlate];
    }
}
