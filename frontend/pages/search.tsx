import Container from "@/components/container";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Search(){
    const router = useRouter();
    const [data, setData]: any[] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(()=>{
        setLoading(true)
        if(!router.isReady) return;
        const url = `http://localhost:8888/.netlify/functions/searchVehicles?network=sepolia&query=${router.query.content}`

        fetch(url, {method: "GET"})
            .then((res) => res.json())
            .then((data) => {
                setData(data.vehicles)
                setLoading(false)
            });
    }, [router.isReady]);


    return (
        <Layout>
            <Container>
                <div className="w-full mb-10">
                    <h1 className="text-center text-4xl font-bold p-5">Search: {router.query.content}</h1>
                </div>

                {isLoading ? <div>Loading...</div> : (
                    <div className="">
                        {data.map((vehicle: any) => {
                            return (
                                <div className=" border-b-2 border-primary border-opacity-50 pb-6">
                                    <div className="text-xl font-bold py-4">{vehicle.licensePlate}</div>
                                    <div>Current mileage: {vehicle.mileage}</div>
                                    <div>Owner: {vehicle.owner}</div>
                                </div>
                            )
                        })}
                    
                    </div>
                )}
            </Container>
        </Layout>
    )
}