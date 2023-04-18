import Container from "@/components/container";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

export default function Search(){
    const router = useRouter();
    return (
        <Layout>
            <Container>
                <div className="w-full mb-10">
                    <h1 className="text-center text-4xl font-bold p-5">Search: {router.query.content}</h1>
                </div>
                <div className="">
                    <div className=" border-b-2 border-primary border-opacity-50 pb-6">
                        <div className="text-xl font-bold py-4">DW454DW</div>
                        <div>Current mileage: 1000km</div>
                        <div>Owner: 0x23423049380</div>
                        <div>Last update: 10/04/2023</div>
                    </div>

                    <div className=" border-b-2 border-primary border-opacity-50 pb-6">
                        <div className="text-xl font-bold py-4">DW454DW</div>
                        <div>Current mileage: 1000km</div>
                        <div>Owner: 0x23423049380</div>
                        <div>Last update: 10/04/2023</div>
                    </div>

                    <div className=" border-b-2 border-primary border-opacity-50 pb-6">
                        <div className="text-xl font-bold py-4">DW454DW</div>
                        <div>Current mileage: 1000km</div>
                        <div>Owner: 0x23423049380</div>
                        <div>Last update: 10/04/2023</div>
                    </div>

                    <div className=" border-b-2 border-primary border-opacity-50 pb-6">
                        <div className="text-xl font-bold py-4">DW454DW</div>
                        <div>Current mileage: 1000km</div>
                        <div>Owner: 0x23423049380</div>
                        <div>Last update: 10/04/2023</div>
                    </div>

                    <div className=" border-b-2 border-primary border-opacity-50 pb-6">
                        <div className="text-xl font-bold py-4">DW454DW</div>
                        <div>Current mileage: 1000km</div>
                        <div>Owner: 0x23423049380</div>
                        <div>Last update: 10/04/2023</div>
                    </div>
                </div>
            </Container>
        </Layout>
    )
}