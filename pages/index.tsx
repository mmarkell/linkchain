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
      router.push('/edit');
    }
  }, [needsOnboarding, router, unsure]);

  const handleVisitPublicProfile = useCallback(() => {
    if (user && user.alias) {
      router.push(`/${user?.alias}`);
    }
  }, [router, user]);

  const goToDemo = useCallback(() => {
    router.push(`/michael`);
  }, [router]);

  return (
    <div>
      <Head>
        <title>LinkChain</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:card" content="summary" />
        <meta property="og:url" content="https://www.linkchain.me" />
        <meta property="og:title" content="LinkChain" />
        <meta
          property="og:description"
          content="Verify your NFTs across all your social media"
        />
        <meta
          property="og:image"
          content="https://ethereum.org/static/28214bb68eb5445dcb063a72535bc90c/3bf79/hero.png"
        />
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
            border: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '3.5rem',
            padding: '6px 20px',
            transition: 'all .3s ease-in-out',
            borderRadius: 10,
            width: '60%',
            margin: 'auto',
            marginTop: '2rem',
            color: 'black',
          }}
        >
          Prove your worth
        </div>
        <div
          style={{
            border: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '2rem',
            padding: '6px 20px',
            color: 'black',
            transition: 'all .3s ease-in-out',
            borderRadius: 10,
            width: '60%',
            margin: 'auto',
            marginTop: '2rem',
          }}
        >
          Verify your NFTs across all your social media
        </div>
        {!unsure && !needsOnboarding && (
          <div
            style={{
              backgroundColor: 'black',
              border: 'none',
              fontFamily: 'Space Grotesk',
              fontSize: '1.4rem',
              padding: '60px 20px',
              transition: 'all .3s ease-in-out',
              borderRadius: 10,
              color: 'white',
              width: '30%',
              height: '30%',
              cursor: 'pointer',
              margin: 'auto',
              marginTop: '2rem',
            }}
            onClick={handleVisitPublicProfile}
          >
            view your public profile
          </div>
        )}
        <div
          style={{
            backgroundColor: 'black',
            border: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '1.4rem',
            padding: '60px 20px',
            transition: 'all .3s ease-in-out',
            borderRadius: 10,
            color: 'white',
            width: '30%',
            height: '30%',
            cursor: 'pointer',
            margin: 'auto',
            marginTop: '2rem',
          }}
          onClick={handleClick}
        >
          {unsure ? '' : needsOnboarding ? 'sign up' : 'edit your profile'}
        </div>
        {needsOnboarding ||
          (unsure && (
            <div
              style={{
                backgroundColor: '#1F4893',
                border: 'none',
                fontFamily: 'Space Grotesk',
                fontSize: '1.4rem',
                padding: '60px 20px',
                transition: 'all .3s ease-in-out',
                borderRadius: 10,
                color: 'white',
                width: '30%',
                height: '30%',
                cursor: 'pointer',
                margin: 'auto',
                marginTop: '2rem',
              }}
              onClick={goToDemo}
            >
              See a demo!
            </div>
          ))}
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
          background-color: white;
        }
        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
