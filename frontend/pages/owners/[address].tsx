import Container from "@/components/layout/container";
import Layout from "@/components/layout/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import useSWR from "swr";
import Link from "next/link";
import UpdateMileageModal from "@/components/modals/updateMileageModal";
import AddVehicleModal from "@/components/modals/addVehicleModal";
import { chainsMap, defaultChain } from "@/constants/chains";

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

  const [licensePlateToUpdate, setLicensePlateToUpdate] = useState("");
  const [mileageToUpdate, setMileageToUpdate] = useState(0);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  const { chainId: chainIdHex } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : defaultChain;
  const networkName = chainsMap.get(chainId);

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const url = `${baseUrl}getVehiclesByOwner?network=${networkName}&address=${address}`;
  const { data, error } = useSWR(url, fetcher);

  useEffect(() => {
    if (isWeb3Enabled) {
    }
  }, []);

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
              {isWeb3Enabled &&
              account?.toLowerCase() == address?.toString().toLowerCase() ? (
                <>
                  <button
                    className="text-xl pb-1 pt-6 font-bold"
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
                </>
              ) : null}
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
                            setShowMileageModal(true);
                            setLicensePlateToUpdate(vehicle.licensePlate);
                            setMileageToUpdate(vehicle.mileage);
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
          </div>
        )}
      </Container>
    </Layout>
  );
}
