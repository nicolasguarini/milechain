import { chainsMap, defaultChain } from "@/constants/chains";
import { useMoralis } from "react-moralis";
import useSWR from "swr";

const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json());

export default function OwnersCount() {
  const { chainId: chainIdHex } = useMoralis();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
  const chainId = chainIdHex ? parseInt(chainIdHex) : defaultChain;
  const networkName = chainsMap.get(chainId);
  const url = `${baseUrl}getOwnersCount?chainId=${chainId}`;
  const { data, error } = useSWR(url, fetcher);

  if (!data) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  if (networkName === undefined) return <p>Invalid network</p>;

  return <p>{data.count} owners</p>;
}
