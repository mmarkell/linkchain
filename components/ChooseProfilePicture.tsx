import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import useNFTCollection from '../hooks/useNFTCollection';
import { OnboardingPropsType } from './ConnectToMetamask';
import NFTCollection from './NFTCollection';

export const ChooseProfilePicture = (props: OnboardingPropsType) => {
  const { account } = useWeb3React();
  const { collection, collectionLoaded } = useNFTCollection(account);
  const { onComplete } = props;
  const { user } = useAuth();
  const [loading, setLoading] = useLoading();

  useEffect(() => {
    if (Boolean(user?.profileNFT?.imageUrl)) {
      onComplete();
    }
  }, [onComplete, user]);

  if (!collectionLoaded) return null;
  return (
    <NFTCollection
      nfts={collection}
      isOnboarding
      address={account}
      onSaveProfile={onComplete}
      userId={user?.id}
    />
  );
};
