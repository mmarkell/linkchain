import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app';
import getLibrary from '../getLibrary';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default App;
