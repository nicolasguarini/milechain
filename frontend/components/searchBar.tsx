import { useRouter } from "next/router";
import OwnersCount from "./ownersCount";
import VehiclesCount from "./vehiclesCount";
import { useState } from "react";
import "flowbite";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [type, setType] = useState("vehicles");
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push(`/search?type=${type}&content=${input}`);
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
  };

  return (
    <div className="container max-w-2xl mb-4">
      <form className="w-full mb-5" onSubmit={handleSubmit}>
        <div className="flex">
          <button
            id="dropdown-button"
            data-dropdown-toggle="dropdown"
            className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border border-primary border-r-0 rounded-l-full"
            type="button"
          >
            {type}
            <svg
              aria-hidden="true"
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
          <div
            id="dropdown"
            className="z-10 hidden bg-dark text-primary divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdown-button"
            >
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setType("vehicles");
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
                  }}
                  className="inline-flex w-full text-primary px-4 py-2"
                >
                  Owners
                </button>
              </li>
            </ul>
          </div>
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
      </form>
      <div className="flex flex-row w-full  justify-between text-primary-darker opacity-50 text-sm m-auto">
        <VehiclesCount />
        <OwnersCount />
      </div>
    </div>
  );
}
