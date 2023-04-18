import Container from "@/components/container";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

export default function VehiclePage(){
    const router = useRouter();
    const { licensePlate } = router.query;
    const { isWeb3Enabled } = useMoralis();

    return <Layout>
        <Container>
            <h1 className="text-4xl font-bold text-center pt-6 border-b-2 pb-1 border-accent w-fit m-auto">{licensePlate}</h1>

            {isWeb3Enabled ? (
                <h1>Coming soon! {/* TODO: fetch data from blockchain */}</h1>
            ) : (
                <div className="flex p-4 mb-4 mt-12 text-sm text-red-500 border border-red-500 rounded-lg bg-dark" role="alert">
                    <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd">
                        </path>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                        You have to connect your wallet to see blockchain information!
                    </div>
                </div>
            )}
        </Container>
    </Layout>
}