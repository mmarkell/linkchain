import { useEffect, useState } from 'react';
import { getTokensByAddress } from '../pages/api/getTokensByAddress';

export default function useNFTCollection(address: string) {
  const [collection, setCollection] = useState<string[]>([]);

  useEffect(() => {
    getTokensByAddress(address).then((tokens) => {
      setCollection(
        tokens.result?.filter((r) => r.imageUrl)?.map((r) => r.imageUrl),
      );
    });
    return () => {
      setCollection([]);
    };
  }, [address]);

  return collection;
}
