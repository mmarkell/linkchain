import type { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import useNFTCollection from '../hooks/useNFTCollection';

const NFTCollection = () => {
  const { account } = useWeb3React<Web3Provider>();
  const collection = useNFTCollection(account);

  return (
    <div>
      {collection.map((item) => (
        <div key={item}> {item}</div>
      ))}
    </div>
  );
};

export default NFTCollection;
