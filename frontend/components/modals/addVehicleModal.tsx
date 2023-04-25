import { chainsMap } from "@/constants/chains";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddVehicleModal(props: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : 0;
  const networkName: string = chainsMap.get(chainId)!;
  const contractAddress: string = require("../../constants/addresses.json")[
    chainId.toString()
  ];
  const abi = require("../../constants/abi.json");

  const [licensePlate, setLicensePlate] = useState("");
  const [mileage, setMileage] = useState(0);

  useEffect(() => {
    if (isWeb3Enabled) {
    }
  }, []);

  const {
    runContractFunction: addVehicle,
    data: addVehicleResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "addVehicle",
    params: { licensePlate: licensePlate, mileage: mileage },
  });

  const handleSuccess = async (tx: any) => {
    try {
      await tx.wait(1);
      alert("Vehicle added successfully!");
      console.log("Vehicle added successfully on blockchain");
      await fetch(
        `${baseUrl}updateVehicle?network=${networkName}&licensePlate=${licensePlate}`
      )
        .then((res) => res.json())
        .then((data) => {
          alert("DB Updated!");
          console.log("Server response: " + data.message);
        });
    } catch (e) {
      console.log(e);
    }

    props.setShowModal(false);
  };

  const handleError = async (error: any) => {
    alert("Error: " + error.toString());
  };

  const handleClick = async () => {
    console.log("lp: " + licensePlate);
    console.log("mileage: " + mileage);

    await addVehicle({
      onSuccess: handleSuccess,
      onError: handleError,
    });
  };

  return (
    <>
      {props.showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dark outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-center p-5 rounded-t">
                  <h3 className="text-3xl font-semibold">Add new vehicle</h3>
                </div>
                {/*body*/}
                <div className="relative p-6 pt-2 flex-row justify-center">
                  {/* TODO: inputs */}
                  <input
                    type="text"
                    placeholder="Insert the license plate here..."
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="block w-full bg-transparent mb-5 text-primary placeholder-primary focus:border-accent active:border-accent border-accent rounded"
                  />

                  <input
                    type="number"
                    placeholder="Insert the initial mileage..."
                    onChange={(e) => setMileage(parseInt(e.target.value))}
                    className="block bg-transparent w-full text-primary placeholder-primary focus:border-accent active:border-accent border-accent rounded"
                  />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 rounded-b">
                  <button
                    className="text-red-500 font-bold uppercase px-6 py-2 text-sm mr-1 mb-1"
                    type="button"
                    onClick={() => props.setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-accent text-dark font-bold uppercase text-sm px-6 py-3 rounded-lg mr-1 mb-1 "
                    type="button"
                    onClick={handleClick}
                    disabled={isLoading || isFetching}
                  >
                    Add Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
