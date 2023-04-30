import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";

interface Props {
  licensePlateToUpdate: string;
  setLicensePlateToUpdate: Dispatch<SetStateAction<string>>;
  mileageToUpdate: number;
  setMileageToUpdate: Dispatch<SetStateAction<number>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function UpdateMileageModal(props: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : 0;
  const contractAddress = require("../../constants/addresses.json")[
    chainId.toString()
  ];
  const abi = require("../../constants/abi.json");

  const [newMileage, setNewMileage] = useState(0);

  useEffect(() => {
    if (isWeb3Enabled) return;
  }, [isWeb3Enabled]);

  const {
    runContractFunction: updateMileage,
    data: updateMileageResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "updateMileage",
    params: { licensePlate: props.licensePlateToUpdate, mileage: newMileage },
  });

  const handleSuccess = async (tx: any) => {
    try {
      await tx.wait(1);
      alert("Mileage updated successfully!");
      console.log("Mileage updated successfully on blockchain");
      await fetch(
        `${baseUrl}updateVehicle?chainId=${chainId}&licensePlate=${props.licensePlateToUpdate}`
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
    console.log("lp: " + props.licensePlateToUpdate);
    console.log("new mileage: " + newMileage);
    await updateMileage({
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
                  <h3 className="text-3xl font-semibold">Update Mileage</h3>
                </div>
                {/*body*/}
                <div className="relative p-6 pt-2 flex-row justify-center">
                  <h2 className="text-center mb-3 text-xl font-bold">
                    {props.licensePlateToUpdate}
                  </h2>
                  <p className="text-center mb-12">
                    Current mileage: {props.mileageToUpdate}km
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
                    Update
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
