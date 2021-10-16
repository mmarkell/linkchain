import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app';
import getLibrary from '../getLibrary';
import '../styles/globals.css';
import * as ga from '../lib/ga';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default App;
