import Head from 'next/head';
import React from 'react';
import Account from '../components/Account';
import Logo from '../components/Logo';
import useEagerConnect from '../hooks/useEagerConnect';

const Edit = () => {
  const triedToEagerConnect = useEagerConnect();

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
          background-color: #617f8f;
        }
        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Edit;
