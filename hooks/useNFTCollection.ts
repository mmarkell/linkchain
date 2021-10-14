import { useEffect, useState } from 'react';
import { ReturnItem } from '../pages/api/getTokensByAddress';

export default function useNFTCollection(address: string) {
  const [collection, setCollection] = useState<ReturnItem[]>([]);
  const [collectionLoaded, setCollectionLoaded] = useState(false);

  useEffect(() => {
    if (!address) {
      setCollection([]);
    } else {
      fetch(`/api/getTokensByAddress?address=${address}`)
        .then((r) => r.json())
        .then(({ result }: { result: ReturnItem[] }) => {
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
