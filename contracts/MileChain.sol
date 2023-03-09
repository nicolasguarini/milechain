// SPDX-License-Identifier: GNU
pragma solidity ^0.8.18;

contract MileChain {

    address private owner;
    bool private state;

    struct Car {
        string licensePlate;
        address owner;
        uint256 mileage;
    }

    mapping(string => Car) private cars;
    mapping(string => uint256[]) private mileageRecords;
    mapping(string => address[]) private ownersRecords;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);

     modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        state = true; 
        emit OwnerSet(address(0), owner);
    }

    function changeOwner(address newOwner) public isOwner {
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function setState(bool newState) public isOwner{
        state = newState;
    }

    function getState() public view returns(bool){
        return state;
    }

    function addCar(string memory licensePlate, uint256 mileage) public {
        require(cars[licensePlate].owner == address(0), "Car already exists");
        require(state, "Smartcontract offline");
        Car memory newCar = Car(licensePlate, msg.sender, mileage);
        cars[licensePlate] = newCar;
        mileageRecords[licensePlate].push(mileage);
        ownersRecords[licensePlate].push(msg.sender);
    }

    function updateMileage(string memory licensePlate, uint256 mileage) public {
        require(
            cars[licensePlate].owner == msg.sender,
            "You do not own this car"
        );
        require(
            mileage > cars[licensePlate].mileage,
            "New mileage must be greater than current mileage"
        );
        require(state, "Smartcontract offline");
        cars[licensePlate].mileage = mileage;
        mileageRecords[licensePlate].push(mileage);
    }

    function getCarByLicencePlate(
        string memory licensePlate
    ) public view returns (string memory, address, uint256) {
        require(cars[licensePlate].owner != address(0), "Car not found");
        require(state, "Smartcontract offline");
        return (
            cars[licensePlate].licensePlate,
            cars[licensePlate].owner,
            cars[licensePlate].mileage
        );
    }

    function getLatestMileage(
        string memory licensePlate
    ) public view returns (uint256) {
        require(cars[licensePlate].owner != address(0), "Car not found");
        require(state, "Smartcontract offline");
        uint256[] memory records = mileageRecords[licensePlate];
        if (records.length == 0) {
            return cars[licensePlate].mileage;
        } else {
            return records[records.length - 1];
        }
    }

    function getMileageRecord(
        string memory licensePlate
    ) public view returns (uint256[] memory) {
        require(cars[licensePlate].owner != address(0), "Car not found");
        require(state, "Smartcontract offline");
        return mileageRecords[licensePlate];
    }

    function changeOwner(string memory licensePlate, address newOwner) public {
        require(cars[licensePlate].owner != address(0), "Car not found");
        require(state, "Smartcontract offline");
        cars[licensePlate].owner = newOwner;
        ownersRecords[licensePlate].push(newOwner);
    }

    function getOwners(
        string memory licensePlate
    ) public view returns (address[] memory) {
        require(cars[licensePlate].owner != address(0), "Car not found");
        require(state, "Smartcontract offline");
        return ownersRecords[licensePlate];
    }
}
