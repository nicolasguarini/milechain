import Container from "@/components/container";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import useSWR from "swr";
import Link from "next/link";

interface Owner{
    address: string,
    name: string,
    surname: string,
}
interface Vehicle {
    licensePlate: string,
    mileage: number,
    owner: string
}

const fetcher = (apiURL: string) => fetch(apiURL).then(res => res.json());

export default function OwnerPage(){
    const router = useRouter();
    const { address } = router.query;
    const { isWeb3Enabled } = useMoralis();
    const deploymentJSON = require("../../constants/deployments/sepolia/MileChain.json");
    const abi = deploymentJSON.abi;
    const contractAddress = deploymentJSON.address;

    const [owner, setOwner] = useState<Owner>();

    //prendere le informazioni dal database
    const { chainId: chainIdHex } = useMoralis();
    const chainId = chainIdHex ? parseInt(chainIdHex) : 11155111; // sepolia as default network

    const networkName = chainId == 11155111 ? "sepolia" : "sepolia" 
    const url = `https://milechain.netlify.app/.netlify/functions/getVehiclesByOwner?network=${networkName}&address=${address}`;
    const { data, error } = useSWR(url, fetcher);
    console.log(data)
    if (!data) return <p>Loading...</p>
    if (error) return <p>Failed to load</p>
  
    return <Layout>
            <Container>
                <h1 className="text-4xl font-bold text-center pt-6 border-b-2 pb-1 border-accent w-fit m-auto">{address}</h1>
                {isWeb3Enabled ? (
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center">
                           {
                                 data.vehicles.map((vehicle: Vehicle) => {
                                    return <div className="flex flex-row gap-20 items-center">
                                        <Link href={`/vehicles/${vehicle.licensePlate}`}>
                                            <div className="text-2xl font-bold text-center pt-6 border-b-2 pb-1 border-accent w-fit m-auto">{vehicle.licensePlate}</div>
                                        </Link>
                                        <p className="text-2xl font-bold text-center pt-6 pb-1 border-accent w-fit m-auto">Mileage: {vehicle.mileage}</p>
                                    </div>
                                })
                           }
                        </div>
                    </div>  
                ) : (
                    <p>Please enable Web3</p>
                )}
            </Container>
    </Layout>

}