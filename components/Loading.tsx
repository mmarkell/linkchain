import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';

export const Loading = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      url !== router.asPath && setLoading(true);
    };
    const handleComplete = (url: string) => {
      url === router.asPath && setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return (
    loading && (
      <div
        style={{
          position: 'absolute',
          top: '1%',
          left: '12.5%',
        }}
      >
        <PacmanLoader color="#fff" />
      </div>
    )
  );
};
