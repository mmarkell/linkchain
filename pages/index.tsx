import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useEffect } from 'react';
import Account from '../components/Account';
import Logo from '../components/Logo';
import OnboardingFlow from '../components/OnboardingFlow';
import useAuth from '../hooks/useAuth';
import useEagerConnect from '../hooks/useEagerConnect';

function Home() {
  const triedToEagerConnect = useEagerConnect();
  const { user, loaded } = useAuth();
  const router = useRouter();

  const needsOnboarding =
    loaded && !Boolean(user?.socialUrls) && !Boolean(user?.profileImageUrl);

  useEffect(() => {
    if (!needsOnboarding) {
      router.push(`/${user?.alias}`);
    }
  }, [needsOnboarding, router, user]);
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
        {loaded &&
          !Boolean(user?.socialUrls) &&
          !Boolean(user?.profileImageUrl) && <OnboardingFlow />}
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
