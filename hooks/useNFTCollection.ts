import type { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';

export default function useNFTCollection(address: string) {
  const { library, chainId } = useWeb3React<Web3Provider>();
  const [collection, setCollection] = useState<string[]>([]);

  useEffect(() => {
    if (library && typeof address === 'string') {
      let stale = false;

      library
        .lookupAddress(address)
        .then((name) => {
          if (!stale && typeof name === 'string') {
            setCollection([name]);
          } else {
            setCollection(['abc', '123']);
          }
        })
        .catch(() => {});

      return () => {
        stale = true;
        setCollection([]);
      };
    }
  }, [library, address, chainId]);

  return collection;
}
