import InvalidNetwork from "@/components/invalidNetwork";
import Container from "@/components/layout/container";
import Layout from "@/components/layout/layout";
import { chainsMap, defaultChain } from "@/constants/chains";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function Search() {
  const { chainId: chainIdHex } = useMoralis();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const [data, setData]: any[] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const chainId: number = chainIdHex ? parseInt(chainIdHex) : defaultChain;
  const networkName = chainsMap.get(chainId);

  useEffect(() => {
    setLoading(true);
    if (!router.isReady) return;

    const queryParams = `chainId=${chainId}&query=${router.query.content}`;
    const url =
      router.query.type === "vehicles"
        ? `${baseUrl}searchVehicles?${queryParams}`
        : `${baseUrl}searchOwners?${queryParams}`;

    fetch(url, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (router.query.type == "vehicles") {
          setData(data.vehicles);
        } else {
          setData(data.owners);
        }
      });
    setLoading(false);
  }, [
    router.isReady,
    baseUrl,
    chainId,
    router.query.content,
    router.query.type,
  ]);

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
        <title>Search: {router.query.content} | milechain</title>
      </Head>
      <Container>
        <div className="w-full mb-10">
          <h1 className="text-center text-4xl font-bold p-5">
            Search: {router.query.content}
          </h1>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="">
            {router.query.type == "vehicles"
              ? data?.map((vehicle: any) => {
                  return (
                    <div
                      className=" border-b-2 border-primary border-opacity-50 pb-6 mt-6"
                      key={vehicle.licensePlate}
                    >
                      <div className="flex flex-row justify-between">
                        <div>
                          <h1 className="text-4xl font-bold border-b-2 pb-1 border-accent w-fit m-auto">
                            <Link href={`/vehicles/${vehicle.licensePlate}`}>
                              {vehicle.licensePlate}
                            </Link>
                          </h1>
                        </div>
                        <div>
                          <p className="text-xl text-right">
                            Current Mileage: {vehicle.mileage} km
                          </p>
                          <p className="text-xl text-right border-b-2">
                            <Link href={`/owners/${vehicle.owner}`}>
                              Owned by:
                              {vehicle.owner.substring(0, 6) +
                                "..." +
                                vehicle.owner.substring(
                                  vehicle.owner.length - 5,
                                  vehicle.owner.length
                                )}
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              : data?.map((owner: any) => {
                  return (
                    <div
                      className=" border-b-2 border-primary border-opacity-50 pb-6 mt-6"
                      key={owner.address}
                    >
                      <div className="flex flex-row justify-between">
                        <div>
                          <h1 className="text-4xl font-bold border-b-2 pb-1 border-accent w-fit m-auto">
                            <Link href={`/owners/${owner.address}`}>
                              {owner.name}
                            </Link>
                          </h1>
                        </div>
                        <div>
                          <p className="text-xl text-right border-b-2 mt-3">
                            <Link href={`/owners/${owner.address}`}>
                              Owned by:
                              {owner.address.substring(0, 6) +
                                "..." +
                                owner.address.substring(
                                  owner.address.length - 5,
                                  owner.address.length
                                )}
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
      </Container>
    </Layout>
  );
}

/*
  <div className="flex flex-row justify-between">
                      <div>
                        <h1 className="text-4xl font-bold border-b-2 pb-1 border-accent w-fit m-auto">
                          <Link href={`/owners/${owner.address}`}>
                            {owner.name}
                          </Link>
                        </h1>
                      </div>
                      <div>
                        <p className="text-xl text-right border-b-2">
                          <Link href={`/owners/${vehicle.owner}`}>
                          Owned by:{owner.address.substring(0,6)+"..."+owner.address.substring(owner.address.length-5,owner.address.length)}
                          </Link>
                        </p>
                      </div>
                    </div>
*/
