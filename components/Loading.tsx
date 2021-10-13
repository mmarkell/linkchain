import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DotLoader from 'react-spinners/DotLoader';
import useAuth from '../hooks/useAuth';

export const Loading = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { loaded } = useAuth();
  const { active } = useWeb3React<Web3Provider>();

  const unsure = !active || !loaded;

  useEffect(() => {
    if (unsure) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [unsure, setLoading]);

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

  return loading && <DotLoader color="#fff" />;
};
