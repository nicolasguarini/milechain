import { useRouter } from "next/router";
import OwnersCount from "./ownersCount";
import VehiclesCount from "./vehiclesCount";
import { useState } from "react";
import "flowbite";
import { capitalize } from "@/utils/capitalize";
import { useMoralis } from "react-moralis";
import { chainsMap, defaultChain } from "@/constants/chains";
import Link from "next/link";

export default function SearchBar() {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = chainIdHex ? parseInt(chainIdHex) : defaultChain;
  const networkName = chainsMap.get(chainId);
  const [input, setInput] = useState("");
  const [type, setType] = useState("vehicles");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (networkName !== undefined) {
      router.push(`/search?type=${type}&content=${input}`);
    } else {
      alert("Invalid network!");
    }
  };

  return (
    <div className="container max-w-2xl mb-4">
      <form className="w-full mb-5" onSubmit={handleSubmit}>
        <div className="flex">
          <button
            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border border-primary border-r-0 rounded-l-full"
            type="button"
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
          >
            {capitalize(type)}
            <svg
              className="w-4 h-4 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              onChange={(e) => {
                setInput(e.target.value);
              }}
              className="block bg-darker text-primary p-2.5 w-full placeholder-primary-darker font-bold z-20 text-sm focus:border-2 focus:border-primary rounded-r-full border-l-1 border border-primary"
              placeholder="Start browsing license plates.."
              required
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
        {showDropdown ? (
          <div className="z-100 absolute bg-dark text-primary divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul
              className="py-2 text-sm text-gray-200"
              aria-labelledby="dropdown-button"
            >
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setType("vehicles");
                    setShowDropdown(false);
                  }}
                  className="inline-flex text-primary w-full px-4 py-2 "
                >
                  Vehicles
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setType("owners");
                    setShowDropdown(false);
                  }}
                  className="inline-flex w-full text-primary px-4 py-2"
                >
                  Owners
                </button>
              </li>
            </ul>
          </div>
        ) : null}
      </form>
      <div className="flex flex-row w-full  justify-between text-primary-darker text-sm m-auto">
        <VehiclesCount />
        <OwnersCount />
      </div>
      <div className="flex flex-row w-full mt-2 underline justify-center">
        <Link href="/advanced-search">Advanced Search</Link>
      </div>
    </div>
  );
}
