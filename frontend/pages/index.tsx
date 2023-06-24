import Layout from "@/components/layout/layout";
import SearchBar from "@/components/searchBar";
import Head from "next/head";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>milechain | dApp for registering vehicles lifecycle</title>
        <meta
          name="description"
          content="DApp for registering vehicles mileages and ownership history on Ethereum blockchain. Built with Solidity, Alchemy, IPFS and other hot technologies."
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center container m-auto">
        <h1 className="text-4xl font-bold text-center max-w-5xl mb-3">
          DApp for registering vehicles mileages and ownership history on
          Ethereum blockchain.
        </h1>
        <p className="text-primary-darker opacity-50 mb-10 text-center">
          Built with Solidity, Alchemy, IPFS and other hot technologies :)
        </p>

        <SearchBar />
      </main>
    </Layout>
  );
}
