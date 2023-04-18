import Container from "@/components/container";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

export default function VehiclePage(){
    const router = useRouter();
    const { licensePlate } = router.query;

    return <Layout>
        <Container>
            <h1 className="text-4xl font-bold text-center pt-6 border-b-2 pb-1 border-accent w-fit m-auto">{licensePlate}</h1>

            {/* TODO: fetch data from blockchain */}
        </Container>
    </Layout>
}