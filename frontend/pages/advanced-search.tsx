import Container from "@/components/layout/container";
import Layout from "@/components/layout/layout";
import { chainsMap, defaultChain } from "@/constants/chains";
import { Notify } from "notiflix";
import { FormEvent, useState } from "react";
import { useMoralis } from "react-moralis";

interface Vehicle {
  licensePlate: string;
  owner: string;
  mileage: number;
}

export default function AdvancedSearchPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const { chainId: chainIdHex } = useMoralis();
  const [licensePlate, setLicensePlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chainId: number = chainIdHex ? parseInt(chainIdHex) : defaultChain;
  const networkName = chainsMap.get(chainId);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = `${baseUrl}getVehicle?chainId=${chainId}&query=${licensePlate}`;

    fetch(url, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.message != undefined) {
          Notify.failure("Please connect to a valid network");
        } else {
          setVehicle(data.vehicle);
        }
      });
  };

  const handleCheckBlockchainClick = () => {
    const url = `${baseUrl}updateVehicle?chainId=${chainId}&licensePlate=${licensePlate}`;
    fetch(url, { method: "GET" })
      .then((res) => {
        console.log("Response code: " + res.status.toString());
        res.json().then((data) => {
          console.log(data.vehicle);
          if (data.vehicle != undefined && data.vehicle != null) {
            Notify.success(`Vehicle ${data.vehicle[0]} found on blockchain`);
            setVehicle({
              licensePlate: data.vehicle[0],
              owner: data.vehicle[1],
              mileage: data.vehicle[2],
            });
          } else {
            Notify.failure("Vehicle not found in blockchain");
          }
        });
      })
      .catch((err) => {
        Notify.failure(err);
      });
  };

  return (
    <Layout>
      <Container>
        <div className="flex flex-col items-center py-12">
          <h1 className="text-4xl font-bold my-3">Advanced Search</h1>
          <p className="my-6 text-center">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente
            totam quisquam minus. Consectetur veniam at necessitatibus
            cupiditate corporis, nemo illo, maxime, nostrum aliquid provident
            vero obcaecati ullam nesciunt id fuga?
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
          {vehicle ? (
            <div className="text-xl font-bold flex flex-row justify-between">
              <div>
                {vehicle.licensePlate} - {vehicle.mileage}km
              </div>

              <button
                className="block"
                onClick={() => Notify.success("Update Blockchain clicked")}
              >
                Update from blockchain
              </button>
            </div>
          ) : (
            <div className="text-xl font-bold">
              <h3>Vehicle Not Found in db</h3>
              <button className="block" onClick={handleCheckBlockchainClick}>
                Check on blockchain
              </button>
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
}
