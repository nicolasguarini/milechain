import { Worker } from "worker_threads";
import fs from "fs";

const NUM_THREADS = 4;
const DATASET_FILE = "dataset.json";

function runService(workerData: any) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./utils/worker.ts", { workerData });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function run() {
  const dataset = JSON.parse(fs.readFileSync(DATASET_FILE, "utf8"));
  const numVehicles = dataset.length;
  const vehiclesPerThread = Math.floor(numVehicles / NUM_THREADS);

  const workerPromises = [];
  for (let i = 0; i < NUM_THREADS; i++) {
    const startIdx = i * vehiclesPerThread;
    const endIdx = (i + 1) * vehiclesPerThread;
    const threadVehicles = dataset.slice(startIdx, endIdx);

    workerPromises.push(runService({ account: i, vehicles: threadVehicles }));
  }
  const start = Date.now();
  const thread_results = await Promise.all(workerPromises);
  const end = Date.now();
  console.log("Executed in " + Math.round(end - start) + "ms");
  console.log(thread_results);
}

run().catch((err) => console.error(err));
