import Layout from "@/components/layout/layout";
import SearchBar from "@/components/searchBar";

export default function Home() {
  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-center container m-auto">
        <h1 className={`text-4xl font-bold text-center max-w-5xl mb-3`}>
          DApp for registering vehicles mileages and ownership history on
          Ethereum blockchain.
        </h1>
        <p className="text-primary-darker opacity-50 mb-10">
          Built with Solidity, Alchemy, IPFS and other hot technologies :)
        </p>

        {/* <input type="text" className='bg-darker border-2 rounded-full border-primary-darker border-opacity-50 w-full max-w-md px-5 py-3 mb-3 font-bold placeholder-primary-darker placeholder-opacity-50' placeholder='Start browsing license plates...'/> */}
        <SearchBar />
      </main>
    </Layout>
  );
}
