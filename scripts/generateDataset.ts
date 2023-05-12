import fs from "fs";

const NUM_VEHICLES = 1000;
const MIN_UPDATES = 2;
const MAX_UPDATES = 10;
const MIN_INCREMENT = 100;
const MAX_INCREMENT = 1000;

function generateLicensePlate() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let licensePlate = "";

  // Generate two random letters
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    licensePlate += letters.charAt(randomIndex);
  }

  // Generate three random numbers
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    licensePlate += numbers.charAt(randomIndex);
  }

  // Generate another two random letters
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    licensePlate += letters.charAt(randomIndex);
  }

  return licensePlate;
}

function generateMileageUpdates() {
  const numUpdates = Math.floor(Math.random() * MAX_UPDATES) + MIN_UPDATES; // Random number between 2 and 10
  const mileageUpdates = [];

  let mileage = 0;

  for (let i = 0; i < numUpdates; i++) {
    const increment = Math.floor(Math.random() * MAX_INCREMENT) + MIN_INCREMENT; // Random increment between 100 and 1000
    mileage += increment;
    mileageUpdates.push(mileage);
  }

  return mileageUpdates;
}

function generateVehicle() {
  const licensePlate = generateLicensePlate();
  const mileageUpdates = generateMileageUpdates();

  return {
    licensePlate,
    mileage: mileageUpdates[0],
    mileageUpdates,
  };
}

function generateDataset() {
  const dataset = [];

  for (let i = 0; i < NUM_VEHICLES; i++) {
    const vehicle = generateVehicle();
    dataset.push(vehicle);
  }

  return dataset;
}

const dataset = generateDataset();
const jsonData = JSON.stringify(dataset, null, 2);

fs.writeFile("dataset.json", jsonData, (err) => {
  if (err) {
    console.error("Error during file writing:", err);
    return;
  }

  console.log("Dataset generated and saved in dataset.json");
});
