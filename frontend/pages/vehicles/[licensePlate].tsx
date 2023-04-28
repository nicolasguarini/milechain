import Container from "@/components/layout/container";
import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import ChangeOwnerModal from "@/components/modals/changeOwnerModal";
import InvalidNetwork from "@/components/invalidNetwork";
import Chart from "@/components/chart";

interface Vehicle {
  licensePlate: string;
  mileage: number;
  owner: string;
}

interface MileageRecord {
  mileage: number;
  timestamp: number;
}

export default function VehiclePage() {
  const router = useRouter();
  const { licensePlate } = router.query!;
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId: number = chainIdHex ? parseInt(chainIdHex) : 0;
  const contractAddress: string = require("../../constants/addresses.json")[
    chainId
  ];
  const abi = require("../../constants/abi.json");

  const [vehicle, setVehicle] = useState<Vehicle>();
  const [mileageRecords, setMileageRecords] = useState<MileageRecord[]>([]);
  const [showChangeOwner, setShowChangeOwner] = useState(false);
  const [mileages, setMileages] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);

  const {
    runContractFunction: getVehicle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getVehicle",
    params: { licensePlate },
  });

  const { runContractFunction: getMileageRecords } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getMileageRecords",
    params: { licensePlate },
  });

  async function updateUI() {
    const vehicle = (await getVehicle()) as Vehicle;
    const mileageRecords = (await getMileageRecords()) as MileageRecord[];
    const mileages= mileageRecords.map((mileageRecord) => mileageRecord.mileage);
    const timestamps= mileageRecords.map((mileageRecord) => mileageRecord.timestamp );
    console.log(mileages);
    console.log(timestamps);
    setMileages(mileages);
    setTimestamps(timestamps);
    setVehicle(vehicle);
    setMileageRecords(mileageRecords);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <Layout>
      <Container>
        <h1 className="text-4xl font-bold text-center pt-6 border-b-2 pb-1 border-accent w-fit m-auto">
          {licensePlate}
        </h1>

        {isWeb3Enabled ? (
          <div className="mt-12 flex flex-row justify-center">
            {contractAddress ? (
              <div>
                {isLoading || isFetching ? (
                  <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                  <div>
                    {account?.toLowerCase() ==
                    vehicle?.owner.toString().toLowerCase() ? (
                      <>
                        <button
                          className="text-xl pb-1 pt-6 font-bold"
                          onClick={() => {
                            setShowChangeOwner(true);
                          }}
                        >
                          Change owner
                        </button>

                        <ChangeOwnerModal
                          showModal={showChangeOwner}
                          setShowModal={setShowChangeOwner}
                          licensePlate={licensePlate!.toString()}
                        />
                      </>
                    ) : null}
                    <h1 className="text-3xl font-bold">
                      LICENSE PLATE: {vehicle?.licensePlate}
                    </h1>
                    <h2 className="text-2xl">
                      MILEAGE: {vehicle?.mileage.toString()}
                    </h2>
                    <h2 className="text-2xl">
                      OWNER: {vehicle?.owner.toString()}
                    </h2>
                    <Chart mileages={mileages} timestamps={timestamps}/>
                    <h1 className="text-3xl font-bold">MILEAGE RECORDS:</h1>
                    {mileageRecords?.map((mileageRecord: MileageRecord) => {
                      return (
                        <div key={mileageRecord.timestamp.toString()}>
                          <h2 className="text-2xl">
                            MILEAGE: {mileageRecord.mileage.toString()}
                          </h2>
                          <h2 className="text-2xl">
                            TIMESTAMP:{" "}
                            {new Date(
                              mileageRecord.timestamp * 1000
                            ).toLocaleString("it")}
                          </h2>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <InvalidNetwork />
            )}
          </div>
        ) : (
          <div
            className="flex p-4 mb-4 mt-12 text-sm text-red-500 border border-red-500 rounded-lg bg-dark"
            role="alert"
          >
            <svg
              aria-hidden="true"
              className="flex-shrink-0 inline w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Info</span>
            <div>
              You have to connect your wallet to see blockchain information!
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
}
