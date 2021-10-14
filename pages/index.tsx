import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import Account from '../components/Account';
import Logo from '../components/Logo';
import useAuth from '../hooks/useAuth';
import useEagerConnect from '../hooks/useEagerConnect';

function Home() {
  const triedToEagerConnect = useEagerConnect();
  const { user } = useAuth();
  const router = useRouter();

  const unsure = triedToEagerConnect === false;

  const needsOnboarding =
    !user || !user.profileNFT || !(user.links?.length > 0);

  const handleClick = useCallback(() => {
    if (unsure) return;
    if (needsOnboarding) {
      router.push('/signup');
    } else {
      router.push(`/${user?.alias}`);
    }
  }, [needsOnboarding, router, unsure, user?.alias]);

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
            background: '#617F8F',
            border: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '1.4rem',
            padding: '6px 20px',
            transition: 'all .3s ease-in-out',
            borderRadius: 10,
            color: '#DFCC74',
            textShadow: '0 0 10px #FFF01F',
            boxShadow: '0 0 10px #BE95C4',
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
            {unsure ? '' : needsOnboarding ? 'sign up' : 'edit your profile'}
          </div>
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
}

export default Home;
