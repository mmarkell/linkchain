import { useEffect, useState } from 'react';
import { TokenTransaction } from '../pages/api/getTokensByAddress';

export default function useNFTCollection(address: string) {
  const [collection, setCollection] = useState<TokenTransaction[]>([]);
  const [collectionLoaded, setCollectionLoaded] = useState(false);

  useEffect(() => {
    if (!address) {
      setCollection([]);
    } else {
      fetch(`/api/getTokensByAddress?address=${address}`)
        .then((r) => r.json())
        .then(({ result }: { result: TokenTransaction[] }) => {
          setCollection(result);
          setCollectionLoaded(true);
        });
    }
    return () => {
      setCollection([]);
    };
  }, [address]);

  return { collection, collectionLoaded };
}
