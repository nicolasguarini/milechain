import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ReactMoralisError, useMoralis, useWeb3Contract } from "react-moralis";
import Spinner from "../spinner";

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  licensePlate: string;
}

export default function ChangeOwnerModal(props: Props) {
  const deploymentJSON = require("../../constants/deployments/sepolia/MileChain.json");
  const abi = deploymentJSON.abi;
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : 0;
  const contractAddress = require("../../constants/addresses.json")[
    chainId.toString()
  ];

  const [newOwner, setNewOwner] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (isWeb3Enabled) return;
  }, [isWeb3Enabled]);

  const {
    runContractFunction: changeOwner,
    data: changeOwnerResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: contractAddress,
    functionName: "changeOwner",
    params: { licensePlate: props.licensePlate, newOwner: newOwner },
  });

  const handleSuccess = async (tx: any) => {
    try {
      await tx.wait(1);
      alert("Owner changed successfully!");
      console.log("Owner changed successfully on blockchain");
      await fetch(
        `${baseUrl}updateVehicle?chainId=${chainId}&licensePlate=${props.licensePlate}`
      )
        .then((res) => res.json())
        .then((data) => {
          alert("DB Updated!");
          console.log("Server response: " + data.message);
        });
    } catch (e) {
      console.log(e);
    }
    setModalLoading(false);
    props.setShowModal(false);
  };

  const handleError = async (error: ReactMoralisError) => {
    setModalLoading(false);
    alert("Error: " + error.message);
  };

  const handleClick = async () => {
    console.log("lp: " + props.licensePlate);
    console.log("newOwner: " + newOwner);
    setModalLoading(true);
    await changeOwner({
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
              {modalLoading ? (
                <div className="px-9 py-14 bg-dark rounded-lg flex flex-col gap-3">
                  <h3 className="font-bold text-xl mb-8">Please wait...</h3>
                  <Spinner />
                </div>
              ) : (
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dark outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-center p-5 rounded-t">
                    <h3 className="text-3xl font-semibold">Change owner</h3>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 pt-2 flex-row justify-center">
                    {/* TODO: inputs */}
                    <h2 className="text-center text-xl font-bold mb-5">
                      {props.licensePlate}
                    </h2>
                    <input
                      type="text"
                      placeholder="Insert the new owner..."
                      onChange={(e) => setNewOwner(e.target.value)}
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
                      change Owner
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
