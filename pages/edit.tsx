import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Account from '../components/Account';
import Logo from '../components/Logo';
import useAuth from '../hooks/useAuth';
import useEagerConnect from '../hooks/useEagerConnect';

const Edit = () => {
  const triedToEagerConnect = useEagerConnect();
  const { active, account } = useWeb3React<Web3Provider>();
  const { user, reloadUser } = useAuth();

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
        <div
          style={{
            color: 'white',
          }}
        >
          Ability to edit your profile is coming soon :)
        </div>
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
          background-color: #231942;
        }
        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Edit;
