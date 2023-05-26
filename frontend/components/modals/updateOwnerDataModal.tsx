import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ReactMoralisError, useMoralis, useWeb3Contract } from "react-moralis";
import Spinner from "../spinner";
import { Notify } from "notiflix";
import { createToken } from "../../utils/createToken";

interface Props {
  addressOwner: string;
  setAddressOwner: Dispatch<SetStateAction<string>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function UpdateOwnerDataModal(props: Props) {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : 0;
  const contractAddress = require("../../constants/addresses.json")[
    chainId.toString()
  ];
  const abi = require("../../constants/abi.json");

  const [newName, setNewName] = useState(String);
  const [newBio, setNewBio] = useState(String);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (isWeb3Enabled) return;
  }, [isWeb3Enabled]);

  const updateDataDb = async () => {
    const token = createToken(props.addressOwner);
    try {
      await fetch(
        `${baseUrl}updateOwnerData?chainId=${chainId}&name=${newName}&bio=${newBio}&address=${props.addressOwner}&token=${token}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          Notify.success("Database updated!");
          console.log("Server response: " + data);
        });
    } catch (e) {
      console.log(e);
    }
    setModalLoading(false);
    props.setShowModal(false);
  };
  const handleError = async (error: ReactMoralisError) => {
    setModalLoading(false);
    Notify.failure(error.message);
  };

  const handleClick = async () => {
    setModalLoading(true);
    updateDataDb();
  };

  return (
    <>
      {props.showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {modalLoading ? (
                <div className="p-14 bg-dark rounded-lg flex flex-col gap-3">
                  <h3 className="font-bold text-xl mb-8">Please wait...</h3>
                  <Spinner />
                </div>
              ) : (
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-dark outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-center p-5 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Update owner data
                    </h3>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 pt-2 justify-center">
                    <input
                      type="text"
                      placeholder="Insert new name here..."
                      onChange={(e) => {
                        setNewName(e.target.value);
                      }}
                      className="block bg-transparent text-primary placeholder-primary focus:border-accent active:border-accent border-accent rounded w-full mb-5"
                    />
                    <input
                      type="text"
                      placeholder="Insert new bio here..."
                      onChange={(e) => {
                        setNewBio(e.target.value);
                      }}
                      className="block bg-transparent text-primary placeholder-primary focus:border-accent active:border-accent border-accent rounded w-full"
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
                    >
                      Update
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
