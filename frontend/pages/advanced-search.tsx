import Container from "@/components/layout/container";
import Layout from "@/components/layout/layout";
import { chainsMap, defaultChain } from "@/constants/chains";
import { Notify } from "notiflix";
import { FormEvent, useState } from "react";
import { useMoralis } from "react-moralis";
import Link from "next/link";
import Spinner from "@/components/spinner";
import Head from "next/head";

interface Vehicle {
  licensePlate: string;
  owner: string;
  mileage: number;
}

export default function AdvancedSearchPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const { chainId: chainIdHex } = useMoralis();
  const [licensePlate, setLicensePlate] = useState("");
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const chainId: number = chainIdHex ? parseInt(chainIdHex) : defaultChain;
  const networkName = chainsMap.get(chainId);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoadingSearch(true);
    const url = `${baseUrl}getVehicle?chainId=${chainId}&query=${licensePlate}`;

    fetch(url, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.message != undefined) {
          Notify.failure("Please connect to a valid network");
        } else {
          setVehicle(data.vehicle);
          setIsLoadingSearch(false);
        }
      });

    setShowResults(true);
  };

  const handleCheckBlockchainClick = () => {
    if (!networkName) {
      Notify.failure("Please connect to a valid network!");
    } else {
      setIsLoadingUpdate(true);
      const url = `${baseUrl}updateVehicle?chainId=${chainId}&licensePlate=${licensePlate}`;
      fetch(url, { method: "GET" })
        .then((res) => {
          console.log("Response code: " + res.status.toString());
          res.json().then((data) => {
            Notify.info(data.message);
            setIsLoadingUpdate(false);
            if (data.vehicle != undefined && data.vehicle != null) {
              setVehicle({
                licensePlate: data.vehicle[0],
                owner: data.vehicle[1],
                mileage: data.vehicle[2],
              });
            }
          });
        })
        .catch((err) => {
          Notify.failure(err);
          setIsLoadingUpdate(false);
        });
    }
  };

  return (
    <Layout>
      <Head>
        <title>Advanced Search | milechain</title>
      </Head>
      <Container>
        <div className="flex flex-col items-center py-12">
          <h1 className="text-4xl font-bold my-3">Advanced Search</h1>
          <p className="my-6 text-center max-w-3xl">
            Advanced search allows you to search or update vehicle data by
            directly contacting the blockchain. If more updated data is found
            the database will be updated automatically.
          </p>
        </div>
        <form className="w-full mb-5" onSubmit={handleSubmit}>
          <div className="flex max-w-xl m-auto items-center">
            <div className="relative w-full">
              <input
                type="search"
                id="search-dropdown"
                className="block bg-darker text-primary p-2.5 pl-5 w-full placeholder-primary-darker font-bold z-20 text-sm focus:border-2 focus:border-primary rounded-l-full rounded-r-full border-l-1 border border-primary"
                placeholder="Insert a specific license plate..."
                required
                onChange={(e) => setLicensePlate(e.target.value)}
              />
              <button
                type="submit"
                className="absolute top-0 right-0 p-2.5 pr-5 text-sm font-medium text-white"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </form>

        <div>
          {isLoadingSearch ? (
            <div className="w-fit m-auto mt-5">
              <Spinner />
            </div>
          ) : (
            <>
              {vehicle ? (
                <div className="flex flex-row justify-between items-center pt-12">
                  <div className="items-center">
                    <h1 className="text-4xl font-bold border-b-2 pb-1 border-accent w-fit m-auto">
                      <Link href={`/vehicles/${vehicle.licensePlate}`}>
                        {vehicle.licensePlate}
                      </Link>
                    </h1>
                  </div>
                  <div className="flex flex-col items-right">
                    <p className="text-xl text-center">{vehicle.mileage} km</p>
                    <p className="text-xl text-right">
                      <Link href={`/owners/${vehicle.owner}`}>
                        Owned by{" "}
                        <span className="underline">
                          {vehicle.owner.substring(0, 6) +
                            "..." +
                            vehicle.owner.substring(
                              vehicle.owner.length - 5,
                              vehicle.owner.length
                            )}
                        </span>
                      </Link>
                    </p>
                  </div>
                  <div>
                    {isLoadingUpdate ? (
                      <div className="block w-60">
                        <Spinner />
                      </div>
                    ) : (
                      <button
                        className="border block border-accent px-9 py-2 rounded-full"
                        onClick={handleCheckBlockchainClick}
                      >
                        Update from blockchain
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {showResults ? (
                    <div className=" flex flex-col items-center">
                      <h3 className="text-xl font-bold pt-3">
                        Vehicle Not Found
                      </h3>
                      {isLoadingUpdate ? (
                        <span className="mt-7">
                          <Spinner />
                        </span>
                      ) : (
                        <button
                          className="border block border-accent px-9 py-2 rounded-full mt-6"
                          onClick={handleCheckBlockchainClick}
                        >
                          Check on blockchain
                        </button>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
}
