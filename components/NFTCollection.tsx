import type { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import useNFTCollection from '../hooks/useNFTCollection';
import Image from 'next/image';

const NFTCollection = () => {
  const { account } = useWeb3React<Web3Provider>();
  const collection = useNFTCollection(account);

  return (
    <div>
      {collection.map((item, i) => (
        <div key={`${item}-${i}`}>
          <Image alt={item} src={item} width={100} height={100} />
        </div>
      ))}
    </div>
  );
};

export default NFTCollection;
