import Head from "next/head";
import Layout from "@/components/layout/layout";


export default function Contacts() {
    return (
        <Layout>
        <Head>
            <title>milechain | Contacts</title>
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center container m-auto">
            <h1 className="text-4xl font-bold text-center max-w-5xl mb-3">
            Contacts
            </h1>
            <div className="flex flex-row m-16">
            <div className="flex flex-item flex-col content-start">
                <div className="text-left w-fit">
                <h1 className="text-4xl font-bold text-left pt-6 border-b-2 w-fit border-accent m-auto">
                    Lorenzo 
                </h1>
                </div>
            </div>
            <div className="flex flex-item flex-col content-start">
                <div className="text-left w-fit">
                <h1 className="text-4xl font-bold text-left pt-6 border-b-2 w-fit border-accent m-auto">
                    Nicolas 
                </h1>
                </div>
            </div>
            </div>
        </main>
        </Layout>
    );
    }
