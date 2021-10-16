import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import Account from '../components/Account';
import Logo from '../components/Logo';
import OnboardingFlow from '../components/OnboardingFlow';
import useAuth from '../hooks/useAuth';
import useEagerConnect from '../hooks/useEagerConnect';

const Signup = () => {
  const triedToEagerConnect = useEagerConnect();
  const { user } = useAuth();
  const { active, account } = useWeb3React<Web3Provider>();
  const router = useRouter();
  const needsOnboarding =
    !active ||
    !account ||
    !user ||
    !user.profileNFT ||
    !(user.links?.length > 0);

  const handleClick = useCallback(() => {
    router.push(`/${user?.alias}`);
  }, [router, user]);

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
        {needsOnboarding ? (
          <OnboardingFlow />
        ) : (
          <div
            style={{
              background: '#617F8F',
              border: 'none',
              fontFamily: 'Space Grotesk',
              fontSize: '1.4rem',
              padding: '6px 20px',
              transition: 'all .3s ease-in-out',
              borderRadius: 10,
              color: 'black',
              textShadow: '0 0 10px red',
              boxShadow: '0 0 10px red',
              width: '20%',
              height: '20%',
              position: 'absolute',
              top: '25%',
              left: '40%',
              cursor: 'pointer',
              display: 'table',
            }}
          >
            <div
              style={{
                display: 'table-cell',
                verticalAlign: 'middle',
              }}
              onClick={handleClick}
            >
              Go to your profile!
            </div>
          </div>
        )}
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

export default Signup;
