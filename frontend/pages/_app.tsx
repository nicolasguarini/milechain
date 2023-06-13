import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "flowbite";
import { MoralisProvider } from "react-moralis";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <link rel="icon" href="/logo-milechain.png" sizes="any" />
      <Component {...pageProps} />
    </MoralisProvider>
  );
}
