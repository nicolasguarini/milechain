import Container from "@/components/layout/container";
import Layout from "@/components/layout/layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Search() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const [data, setData]: any[] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!router.isReady) return;
    const url =
      router.query.type == "Vehicles"
        ? `${baseUrl}searchVehicles?network=sepolia&query=${router.query.content}`
        : `${baseUrl}searchOwners?network=sepolia&query=${router.query.content}`;

    fetch(url, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (router.query.type == "Vehicles") {
          setData(data.vehicles);
        } else {
          setData(data.owners);
        }
      });
    setLoading(false);
  }, [router.isReady]);

  return (
    <Layout>
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
            {router.query.type == "Vehicles"
              ? data.map((vehicle: any) => {
                  return (
                    <div
                      className=" border-b-2 border-primary border-opacity-50 pb-6"
                      key={vehicle.licensePlate}
                    >
                      <Link href={`/vehicles/${vehicle.licensePlate}`}>
                        <div className="text-xl font-bold py-4">
                          {vehicle.licensePlate}
                        </div>
                        <div>Current mileage: {vehicle.mileage}</div>
                      </Link>
                      <Link href={`/owners/${vehicle.owner}`}>
                        <div>Owner: {vehicle.owner}</div>
                      </Link>
                    </div>
                  );
                })
              : data.map((owner: any) => {
                  return (
                    <div
                      className=" border-b-2 border-primary border-opacity-50 pb-6"
                      key={owner.address}
                    >
                      <Link href={`/owners/${owner.address}`}>
                        <div className="text-xl font-bold py-4">
                          {owner.address}
                        </div>
                        <div>Name: {owner.name}</div>
                        <div>Surname: {owner.surname}</div>
                      </Link>
                    </div>
                  );
                })}
          </div>
        )}
      </Container>
    </Layout>
  );
}
