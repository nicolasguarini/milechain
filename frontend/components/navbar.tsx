import Link from "next/link"
import logo from "../public/milechain.svg"

export default function Navbar(){
    return <nav className="bg-darker fixed w-full z-20 top-0 left-0 font-medium">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link href="/" className="flex items-center">
                <img src="/milechain.png" className="h-8 mr-3" alt="MileChain Logo" />
            </Link>
        
            <div className="flex md:order-2">
                <button type="button" className="border border-accent px-8 py-2 rounded-full font-bold">Connect Wallet</button>
                <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                </button>
            </div>

            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                <ul className="flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0">
                    <li>
                        <a href="#" className="block py-2 pl-3 pr-4 md:p-0" aria-current="page">Home</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pl-3 pr-4 md:p-0">About</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pl-3 pr-4 md:p-0">View on Etherscan</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pl-3 pr-4 md:p-0">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
};