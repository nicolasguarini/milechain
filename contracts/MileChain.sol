// SPDX-License-Identifier: GNU
pragma solidity ^0.8.18;

import "./Owned.sol";

/**
 * A contract for keeping track of mileage records for _vehicles.
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

    /**
     * @dev Define the MileageRecord struct with mileage and unix timestamp.
     */
    struct MileageRecord {
        uint256 mileage;
        uint256 timestamp;
    }

    /**
     * @dev Define the OwnersRecord struct with owner address and unix timestamp.
     */
    struct OwnersRecord {
        address owner;
        uint256 timestamp;
    }

    /**
     * @dev Define mappings to keep track of vehicles, their mileage records, and owners.
     */
    mapping(string => Vehicle) private _vehicles;
    mapping(string => MileageRecord[]) private _mileageRecords;
    mapping(string => OwnersRecord[]) private _ownersRecords;

    /**
     * Default constructor, does nothing apart passing the parameter to Owned's constructor
     * @param deployers Initial deployers array
     */
    constructor(address[] memory deployers) Owned(deployers) {}

    /**
     * Function to add a new vehicle
     * @param licensePlate The licence plate of the vehicle
     * @param mileage The initial mileage of the vehicle
     */
    function addVehicle(string memory licensePlate, uint256 mileage) public {
        require(
            _vehicles[licensePlate].owner == address(0),
            "Vehicle already exists"
        );
        require(
            !_safeMode,
            "Contract is in read-only mode for security reasons."
        );

        _vehicles[licensePlate] = Vehicle(licensePlate, msg.sender, mileage);
        _mileageRecords[licensePlate].push(
            MileageRecord(mileage, block.timestamp)
        );
        _ownersRecords[licensePlate].push(
            OwnersRecord(msg.sender, block.timestamp)
        );
    }

    /**
     * Function to update the mileage of the vehicle
     * @param licensePlate The licence plate of the vehicle
     * @param mileage The new mileage of the vehicle
     */
    function updateMileage(string memory licensePlate, uint256 mileage) public {
        require(
            _vehicles[licensePlate].owner == msg.sender,
            "You do not own this vehicle"
        );
        require(
            mileage > _vehicles[licensePlate].mileage,
            "New mileage must be greater than current mileage"
        );
        require(
            !_safeMode,
            "Contract is in read-only mode for security reasons."
        );

        _vehicles[licensePlate].mileage = mileage;
        _mileageRecords[licensePlate].push(
            MileageRecord(mileage, block.timestamp)
        );
    }

    /**
     * Function to change the owner of a vehicle
     * @param licensePlate The licence plate of the veichle
     * @param newOwner The new owner of the vehicle
     */
    function changeOwner(string memory licensePlate, address newOwner) public {
        require(
            _vehicles[licensePlate].owner != address(0),
            "Vehicle not found"
        );
        require(
            !_safeMode,
            "Contract is in read-only mode for security reasons."
        );

        _vehicles[licensePlate].owner = newOwner;
        _ownersRecords[licensePlate].push(
            OwnersRecord(newOwner, block.timestamp)
        );
    }

    /**
     * Function to get the owner and the latest mileage of a vehicle
     * @param licensePlate The licence plate of the vehicle
     * @return The searched vehicle struct
     */
    function getVehicle(
        string memory licensePlate
    ) public view returns (Vehicle memory) {
        require(
            _vehicles[licensePlate].owner != address(0),
            "Vehicle not found"
        );

        return _vehicles[licensePlate];
    }

    /**
     * Function to get the mileage records of a vehicle
     * @param licensePlate The licence plate of the vehicle
     * @return The mileage records of a vehicle
     */
    function getMileageRecord(
        string memory licensePlate
    ) public view returns (MileageRecord[] memory) {
        require(
            _vehicles[licensePlate].owner != address(0),
            "Vehicle not found"
        );

        return _mileageRecords[licensePlate];
    }

    /**
     * Function to get the owners records of a vehicle
     * @param licensePlate The licence plate of the vehicle
     * @return The owners records of the vehicle
     */
    function getOwnersRecords(
        string memory licensePlate
    ) public view returns (OwnersRecord[] memory) {
        require(
            _vehicles[licensePlate].owner != address(0),
            "Vehicle not found"
        );

        return _ownersRecords[licensePlate];
    }
}
