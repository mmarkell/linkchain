import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useNFTCollection from '../hooks/useNFTCollection';
import { OnboardingPropsType } from './ConnectToMetamask';
import NFTCollection from './NFTCollection';

export const ChooseProfilePicture = (props: OnboardingPropsType) => {
  const { account } = useWeb3React();
  const { collection } = useNFTCollection(account);
  const { onComplete } = props;
  const { user } = useAuth();
  useEffect(() => {
    if (Boolean(user?.profileImageUrl)) {
      onComplete();
    }
  }, [onComplete, user]);
  return (
    <NFTCollection
      nfts={collection}
      isOnboarding
      address={account}
      onSaveProfile={onComplete}
    />
  );
};
