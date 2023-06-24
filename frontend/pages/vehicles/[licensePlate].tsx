import Container from "@/components/layout/container";
import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import ChangeOwnerModal from "@/components/modals/changeOwnerModal";
import InvalidNetwork from "@/components/invalidNetwork";
import Chart from "@/components/chart";
import Spinner from "@/components/spinner";
import UpdateMileageModal from "@/components/modals/updateMileageModal";
import { Vehicle, Record, MileageRecord, OwnersRecord } from "@/utils/types";
import Head from "next/head";
import Link from "next/link";

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
  const [showChangeOwner, setShowChangeOwner] = useState(false);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [licensePlateToUpdate, setLicensePlateToUpdate] = useState("");
  const [mileageToUpdate, setMileageToUpdate] = useState(0);
  const [mileages, setMileages] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [records, setRecords] = useState<Record[]>([]);

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

  const { runContractFunction: getOwnersRecords } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "getOwnersRecords",
    params: { licensePlate },
  });

  async function updateUI() {
    const vehicle = (await getVehicle()) as Vehicle;
    const mileageRecords = (await getMileageRecords()) as MileageRecord[];
    const ownersRecords = (await getOwnersRecords()) as OwnersRecord[];

    const mileages = mileageRecords.map(
      (mileageRecord) => mileageRecord.mileage
    );
    const timestamps = mileageRecords.map(
      (mileageRecord) => mileageRecord.timestamp
    );

    setMileages(mileages);
    setTimestamps(timestamps);
    setVehicle(vehicle);

    const combinedRecords: Record[] = [...mileageRecords, ...ownersRecords];
    const sortedRecords = combinedRecords.sort(
      (a, b) => a.timestamp - b.timestamp
    );
    setRecords(sortedRecords);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <Layout>
      <Head>
        <title>{licensePlate} | milechain</title>
      </Head>
      <Container>
        {isWeb3Enabled ? (
          <div className="pt-20">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-4xl font-bold border-b-2 pb-1 border-accent w-fit m-auto">
                  {licensePlate}
                </h1>
              </div>
              <div>
                <h2 className="text-2xl md:text-right text-center">
                  Current Mileage: {vehicle?.mileage.toString()} km
                </h2>
                <h2 className="text-md md:text-2xl md:text-right text-center">
                  Owned by:{" "}
                  <span className="underline">
                    <Link href={`/owners/${vehicle?.owner.toString()}`}>
                      {vehicle?.owner.toString().slice(0, 8)}...
                      {vehicle?.owner
                        .toString()
                        .slice(vehicle?.owner.toString().length - 4)}
                    </Link>
                  </span>
                </h2>
              </div>
            </div>

            {contractAddress && licensePlate && vehicle ? (
              <div>
                {isLoading || isFetching ? (
                  <Spinner />
                ) : (
                  <div>
                    {account?.toLowerCase() ==
                    vehicle?.owner.toString().toLowerCase() ? (
                      <div className="flex flex-row justify-center gap-10 my-10">
                        <button
                          className="border block border-accent px-9 py-2 rounded-full "
                          onClick={() => {
                            setShowChangeOwner(true);
                          }}
                        >
                          Change owner
                        </button>

                        <button
                          className="border block border-accent px-9 py-2 rounded-full "
                          onClick={() => {
                            setLicensePlateToUpdate(licensePlate.toString());
                            setMileageToUpdate(
                              parseInt(vehicle.mileage.toString())
                            );
                            setShowMileageModal(true);
                          }}
                        >
                          Update Mileage
                        </button>

                        <ChangeOwnerModal
                          showModal={showChangeOwner}
                          setShowModal={setShowChangeOwner}
                          licensePlate={licensePlate!.toString()}
                        />

                        <UpdateMileageModal
                          showModal={showMileageModal}
                          setShowModal={setShowMileageModal}
                          licensePlateToUpdate={licensePlateToUpdate}
                          setLicensePlateToUpdate={setLicensePlateToUpdate}
                          mileageToUpdate={mileageToUpdate}
                          setMileageToUpdate={setMileageToUpdate}
                        />
                      </div>
                    ) : null}

                    <div className="w-full md:max-w-4xl m-auto mt-14">
                      <Chart mileages={mileages} timestamps={timestamps} />
                    </div>

                    <div className="mt-16">
                      <h1 className="text-4xl font-bold border-b-2 pb-1 border-accent w-fit m-auto">
                        Vehicle Timeline
                      </h1>

                      <ol className="relative border-l border-primary-darker max-w-4xl m-auto mt-8 mb-8">
                        {records?.map((record: Record) => {
                          if ("mileage" in record) {
                            return (
                              <li className="mb-10 ml-4" key={record.timestamp}>
                                <div className="absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 bg-primary-darker"></div>
                                <time className="mb-1 text-sm font-normal leading-none opacity-60">
                                  {new Date(
                                    record.timestamp * 1000
                                  ).toLocaleString("it")}
                                </time>
                                <h3 className="text-xl font-bold">
                                  {record.mileage.toString()} km
                                </h3>
                                <p className="mb-4 text-base font-normal opacity-70">
                                  The mileage of this vehicle was updated to{" "}
                                  {record.mileage.toString()}km at{" "}
                                  {new Date(
                                    record.timestamp * 1000
                                  ).toLocaleString("it")}
                                </p>
                              </li>
                            );
                          } else {
                            return (
                              <li
                                className="mb-10 ml-4"
                                key={record.timestamp + 1}
                              >
                                <div className="absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 bg-primary-darker"></div>
                                <time className="mb-1 text-sm font-normal leading-none opacity-60">
                                  {new Date(
                                    record.timestamp * 1000
                                  ).toLocaleString("it")}
                                </time>
                                <h3 className="text-xl font-bold">
                                  Owner changed to
                                  <Link
                                    href={`/owners/${record.owner.toString()}`}
                                    className="underline"
                                  >
                                    {" "}
                                    {record.owner.toString().slice(0, 5)}...
                                    {record.owner
                                      .toString()
                                      .slice(
                                        record.owner.toString().length - 2
                                      )}
                                  </Link>
                                </h3>
                                <p className="mb-4 text-base font-normal opacity-70">
                                  This vehicles ownership changed to{" "}
                                  <Link
                                    href={`/owners/${record.owner.toString()}`}
                                    className="underline"
                                  >
                                    {record.owner.toString().slice(0, 5)}...
                                    {record.owner
                                      .toString()
                                      .slice(
                                        record.owner.toString().length - 2
                                      )}{" "}
                                  </Link>
                                  at{" "}
                                  {new Date(
                                    record.timestamp * 1000
                                  ).toLocaleString("it")}
                                </p>
                              </li>
                            );
                          }
                        })}
                      </ol>
                    </div>
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
