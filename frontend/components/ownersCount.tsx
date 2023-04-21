import { useMoralis } from "react-moralis";
import useSWR from "swr";

const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

export default function OwnersCount() {
  const { chainId: chainIdHex } = useMoralis();
  const baseUrl = process.env.SERVER_BASE_URL;
  const chainId = chainIdHex ? parseInt(chainIdHex) : 11155111; // sepolia as default network

  const networkName = chainId == 11155111 ? "sepolia" : "sepolia";
  const url = `${baseUrl}getOwnersCount?network=${networkName}`;
  const { data, error } = useSWR(url, fetcher);

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;

  return <p>{data.count} owners</p>;
}
