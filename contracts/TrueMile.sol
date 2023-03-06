// SPDX-License-Identifier: GNU
pragma solidity ^0.8.9;

 
contract TrueMile {
    struct Car {
        string licensePlate;
        address owner;
        uint256 mileage;
    }
 
    mapping(string => Car) private carsByLicensePlate; //mappa che associa ad ogni targa un oggetto macchina
    mapping(string => uint256[]) private mileageRecords; // mappa che associa ad ogni targa il suo registro di km registrati
    mapping(string => address[]) private ownersByLicensePlate; //mappa che associa a una automobile la lista dei suioi proprietari nel tempo
    mapping(address => Car[]) private carsByOwner; //mappa che associa ad un proprietario una lista di macchine possedute
 
    function addCar(string memory licensePlate, uint256 mileage) public {
        require(carsByLicensePlate[licensePlate].owner == address(0), "Car already exists");
        Car memory newCar = Car(licensePlate, msg.sender, mileage);
        carsByLicensePlate[licensePlate] = newCar;
        mileageRecords[licensePlate].push(mileage);
        ownersByLicensePlate[licensePlate].push(msg.sender);
        carsByOwner[msg.sender].push(newCar);
    }
 
    function updateMileage(string memory licensePlate, uint256 mileage) public {
        require(
            carsByLicensePlate[licensePlate].owner == msg.sender,
            "You do not own this car"
        );
        require(
            mileage > carsByLicensePlate[licensePlate].mileage,
            "New mileage must be greater than current mileage"
        );
        carsByLicensePlate[licensePlate].mileage = mileage;
        mileageRecords[licensePlate].push(mileage);
    }
 
    function getCarByLicencePlate(
        string memory licensePlate
    ) public view returns (string memory, address, uint256) {
        require(carsByLicensePlate[licensePlate].owner != address(0), "Car not found");
        return (
            carsByLicensePlate[licensePlate].licensePlate,
            carsByLicensePlate[licensePlate].owner,
            carsByLicensePlate[licensePlate].mileage
        );
    }
 
    function getLatestMileage(
        string memory licensePlate
    ) public view returns (uint256) {
        require(carsByLicensePlate[licensePlate].owner != address(0), "Car not found");
        uint256[] memory records = mileageRecords[licensePlate];
        if (records.length == 0) {
            return carsByLicensePlate[licensePlate].mileage;
        } else {
            return records[records.length - 1];
        }
    }
 
    function getMileageRecord(
        string memory licensePlate
    ) public view returns (uint256[] memory) {
        require(carsByLicensePlate[licensePlate].owner != address(0), "Car not found");
        return mileageRecords[licensePlate];
    }
 
    function changeOwner(string memory licensePlate, address newOwner) public {
        require(carsByLicensePlate[licensePlate].owner != address(0), "Car not found");
        carsByLicensePlate[licensePlate].owner = newOwner;
        ownersByLicensePlate[licensePlate].push(newOwner);
    }
 
    function getOwners(
        string memory licensePlate
    ) public view returns (address[] memory) {
        require(carsByLicensePlate[licensePlate].owner != address(0), "Car not found");
        return ownersByLicensePlate[licensePlate];
    }
 
    function getCarsByOwner(address owner) public view returns (Car[] memory) {
        return carsByOwner[owner];
    }
}