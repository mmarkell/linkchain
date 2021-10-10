import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import React from 'react';
import Account from '../components/Account';
import Logo from '../components/Logo';
import NFTCollection from '../components/NFTCollection';
import OnboardingFlow from '../components/OnboardingFlow';
import useEagerConnect from '../hooks/useEagerConnect';

function Home() {
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === 'string' && !!library;

  return (
    <div>
      <Head>
        <title>LinkChain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Logo />
          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        <OnboardingFlow />
      </main>

      <style jsx>{`
        nav {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          visibility: visible;
          opacity: 1;
          transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
          transition: opacity 1.5s cubic-bezier(0.5, 0, 0, 1) 0.2s,
            transform 1.5s cubic-bezier(0.5, 0, 0, 1) 0.2s;
          background-color: grey;
        }
        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
