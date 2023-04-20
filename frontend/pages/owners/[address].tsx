import Container from "@/components/container";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import useSWR from "swr";
import Link from "next/link";

interface Owner {
  address: string;
  name: string;
  surname: string;
}
interface Vehicle {
  licensePlate: string;
  mileage: number;
  owner: string;
}

const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

export default function OwnerPage() {
  const router = useRouter();
  const { address } = router.query;
  const { isWeb3Enabled, account } = useMoralis();
  const deploymentJSON = require("../../constants/deployments/sepolia/MileChain.json");
  const abi = deploymentJSON.abi;
  const contractAddress = deploymentJSON.address;

  const { chainId: chainIdHex } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : 11155111; // sepolia as default network

  const networkName = chainId == 11155111 ? "sepolia" : "sepolia";
  const url = `https://milechain.netlify.app/.netlify/functions/getVehiclesByOwner?network=${networkName}&address=${address}`;
  const { data, error } = useSWR(url, fetcher);
  const [newMileage, setNewMileage] = useState(0);
  const [licensePlateToUpdate, setLicensePlateToUpdate] = useState("");
  const [mileageToUpdate, setMileageToUpdate] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isWeb3Enabled) {
    }
  }, []);

  const {
    runContractFunction: updateMileage,
    data: updateMileageResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "updateMileage",
    params: { licensePlate: licensePlateToUpdate, mileage: newMileage },
  });

  const handleSuccess = async (tx: any) => {
    try {
      await tx.wait(1);
      alert("Mileage updated successfully!");
      console.log("Mileage updated successfully on blockchain");
      await fetch(
        `https://milechain.netlify.app/.netlify/functions/updateVehicle?network=sepolia&licensePlate=${licensePlateToUpdate}`
      )
        .then((res) => res.json())
        .then((data) => {
          alert("DB Updated!");
          console.log("Server response: " + data.message);
        });
    } catch (e) {
      console.log(e);
    }

    setShowModal(false);
  };

  const handleClick = async () => {
    console.log("lp: " + licensePlateToUpdate);
    console.log("new mileage: " + newMileage);
    await updateMileage({
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  return (
    <Layout>
      <Container>
        <h1 className="text-4xl font-bold text-center pt-6 border-b-2 pb-1 border-accent w-fit m-auto">
          {address}
        </h1>
        {!data ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Failed to load</div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <h1>Vehicles</h1>
              {data.vehicles.map((vehicle: Vehicle) => {
                return (
                  <div
                    className="flex flex-row gap-20 items-center"
                    key={vehicle.licensePlate}
                  >
                    <Link href={`/vehicles/${vehicle.licensePlate}`}>
                      <div className="text-2xl font-bold text-center pt-6 border-b-2 pb-1 border-accent w-fit m-auto">
                        {vehicle.licensePlate}
                      </div>
                    </Link>
                    <p className="text-2xl font-bold text-center pt-6 pb-1 border-accent w-fit m-auto">
                      Mileage: {vehicle.mileage}
                    </p>

                    {isWeb3Enabled &&
                    account?.toLowerCase() == vehicle.owner.toLowerCase() ? (
                      <div>
                        <button
                          className="text-xl pb-1 pt-6 font-bold"
                          onClick={() => {
                            setShowModal(true);
                            setLicensePlateToUpdate(vehicle.licensePlate);
                            setMileageToUpdate(vehicle.mileage);
                          }}
                        >
                          Update mileage
                        </button>

                        {showModal ? (
                          <>
                            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dark outline-none focus:outline-none">
                                  {/*header*/}
                                  <div className="flex items-start justify-center p-5 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                      Update Mileage
                                    </h3>
                                  </div>
                                  {/*body*/}
                                  <div className="relative p-6 pt-2 flex-row justify-center">
                                    <h2 className="text-center mb-3 text-xl font-bold">
                                      {licensePlateToUpdate}
                                    </h2>
                                    <p className="text-center mb-12">
                                      Current mileage: {mileageToUpdate}km
                                    </p>
                                    <input
                                      type="number"
                                      placeholder="Insert new mileage here..."
                                      onChange={(e) => {
                                        setNewMileage(parseInt(e.target.value));
                                      }}
                                      className="block bg-transparent text-primary placeholder-primary focus:border-accent active:border-accent border-accent rounded"
                                    />
                                  </div>
                                  {/*footer*/}
                                  <div className="flex items-center justify-end p-6 rounded-b">
                                    <button
                                      className="text-red-500 font-bold uppercase px-6 py-2 text-sm mr-1 mb-1"
                                      type="button"
                                      onClick={() => setShowModal(false)}
                                    >
                                      Close
                                    </button>
                                    <button
                                      className="bg-accent text-dark font-bold uppercase text-sm px-6 py-3 rounded-lg mr-1 mb-1 "
                                      type="button"
                                      onClick={handleClick}
                                      disabled={isLoading || isFetching}
                                    >
                                      Update
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                          </>
                        ) : null}
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </Layout>
  );
}
