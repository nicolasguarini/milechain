import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'flowbite';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  )
}
