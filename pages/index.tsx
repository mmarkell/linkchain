import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Account from '../components/Account';
import NFTCollection from '../components/NFTCollection';
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
          <Link href="/">
            <a>LinkChain</a>
          </Link>

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        <h1>Welcome to LinkChain</h1>

        {isConnected && <NFTCollection />}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }
        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
