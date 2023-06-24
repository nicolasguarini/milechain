import Container from "@/components/layout/container";
import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import useSWR from "swr";
import Link from "next/link";
import UpdateMileageModal from "@/components/modals/updateMileageModal";
import AddVehicleModal from "@/components/modals/addVehicleModal";
import UpdateOwnerDataModal from "@/components/modals/updateOwnerDataModal";
import { chainsMap, defaultChain } from "@/constants/chains";
import InvalidNetwork from "@/components/invalidNetwork";
import { Vehicle } from "@/utils/types";
import Head from "next/head";

const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

export default function OwnerPage() {
  const router = useRouter();
  const { address } = router.query;
  const { isWeb3Enabled, account } = useMoralis();

  const [licensePlateToUpdate, setLicensePlateToUpdate] = useState("");
  const [mileageToUpdate, setMileageToUpdate] = useState(0);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showUpdateOwnerDataModal, setShowUpdateOwnerDataModal] =
    useState(false);
  const [addressOwner, setAddressOwner] = useState("");

  const { chainId: chainIdHex } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : defaultChain;
  const networkName = chainsMap.get(chainId);

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const url = `${baseUrl}getVehiclesByOwner?chainId=${chainId}&address=${address}`;
  const { data, error } = useSWR(url, fetcher);

  const urlOwner = `${baseUrl}getOwner?chainId=${chainId}&address=${address}`;
  const { data: dataOwner, error: errorOwner } = useSWR(urlOwner, fetcher);

  const username: string | null = dataOwner?.user?.name;
  const bio: string | null = dataOwner?.user?.bio;

  useEffect(() => {
    if (isWeb3Enabled) {
    }
  }, [isWeb3Enabled]);

  if (networkName === undefined) {
    return (
      <Layout>
        <Container>
          <InvalidNetwork />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>
          {address?.slice(0, 5)}...
          {address?.slice(address?.length - 2)} | milechain
        </title>
      </Head>
      <Container>
        {!data ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Failed to load</div>
        ) : (
          <div className="">
            <div className="flex flex-col md:flex-row justify-between mb-16">
              <div className="flex flex-col content-start">
                <div className="text-left w-fit">
                  {username ? (
                    <h1 className="text-4xl font-bold text-left pt-6 border-b-2 w-fit border-accent m-auto">
                      {username}
                    </h1>
                  ) : (
                    <h1 className="text-2xl font-bold text-left pt-2 border-b-2  w-fit border-accent m-auto">
                      {address}
                    </h1>
                  )}
                </div>

                {bio ? (
                  <p className="text-xl p-0 m-0 font-medium text-center pt-3 pb-1 border-accent w-fit">
                    {bio}
                  </p>
                ) : null}
              </div>

              <div>
                <div>
                  {username ? (
                    <h3 className="text-sm md:text-xl max-w-full font-bold text-center pt-6 pb-1 m-auto underline">
                      <a href={`/owners/${address}`}>{address}</a>
                    </h3>
                  ) : null}
                </div>
                {isWeb3Enabled &&
                account?.toLowerCase() == address?.toString().toLowerCase() ? (
                  <div className="flex flex-row gap-6 justify-center md:justify-end pt-3">
                    <button
                      className="border block border-accent px-9 py-2 rounded-full"
                      onClick={() => {
                        setShowAddVehicleModal(true);
                      }}
                    >
                      Add Vehicle
                    </button>

                    <AddVehicleModal
                      showModal={showAddVehicleModal}
                      setShowModal={setShowAddVehicleModal}
                    />
                    <button
                      className="border block border-accent px-9 py-2 rounded-full"
                      onClick={() => {
                        setShowUpdateOwnerDataModal(true);
                        setAddressOwner(address!.toString());
                      }}
                    >
                      Update data
                    </button>
                    <UpdateOwnerDataModal
                      addressOwner={addressOwner}
                      setAddressOwner={setAddressOwner}
                      showModal={showUpdateOwnerDataModal}
                      setShowModal={setShowUpdateOwnerDataModal}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            {data?.vehicles ? (
              <div className="max-w-2xl m-auto">
                <div className="text-center mb-4">
                  <h1 className="text-4xl font-bold border-b-2 pb-1 border-accent w-fit m-auto">
                    Vehicles
                  </h1>
                </div>

                {data?.vehicles?.map((vehicle: Vehicle) => {
                  return (
                    <div
                      className="flex flex-col md:flex-row md:gap-20 items-center mb-3 justify-between"
                      key={vehicle.licensePlate}
                    >
                      <Link href={`/vehicles/${vehicle.licensePlate}`}>
                        <div className="text-2xl font-bold text-center pt-6 border-b-2   pb-0 border-accent w-fit ">
                          {vehicle.licensePlate}
                        </div>
                      </Link>
                      <p className="text-xl font-medium text-center pt-6 pb-1 border-accent w-fit ">
                        {vehicle.mileage} km
                      </p>

                      {isWeb3Enabled &&
                      account?.toLowerCase() == vehicle.owner.toLowerCase() ? (
                        <div className="mt-3 mb-6">
                          <button
                            className="border block border-accent px-9 py-2 rounded-full"
                            onClick={() => {
                              setLicensePlateToUpdate(vehicle.licensePlate);
                              setMileageToUpdate(vehicle.mileage);
                              setShowMileageModal(true);
                            }}
                          >
                            Update mileage
                          </button>

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
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </Container>
    </Layout>
  );
}
