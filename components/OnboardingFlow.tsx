import { useWeb3React } from '@web3-react/core';
import { Router, useRouter } from 'next/dist/client/router';
import React, { useCallback, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useIsUsernameValid from '../hooks/useIsUsernameValid';
import useNFTCollection from '../hooks/useNFTCollection';
import NFTCollection from './NFTCollection';

const CONNECT_WALLET = 1;
const CHOOSE_USERNAME = 2;
const LINK_SOCIALS = 3;

const data = [
  { _id: CONNECT_WALLET, label: 'Connect your wallet' },
  { _id: CHOOSE_USERNAME, label: 'Choose your username' },
  { _id: LINK_SOCIALS, label: 'Link your socials!' },
];

const isTwitterLink = (link: string) =>
  /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/.test(
    link,
  );

const OnboardingFlow = () => {
  const { account } = useWeb3React();
  const [username, setUsername] = useState('');
  const { user, loaded } = useAuth();
  const { isValid, error } = useIsUsernameValid(username);
  const { collection, collectionLoaded } = useNFTCollection(account);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [createdAccount, setCreatedAccount] = useState(false);
  const [needsUploadProfilePicture, setNeedsUploadProfilePicture] =
    useState(false);

  const [needsLinkSocials, setNeedsLinkSocials] = useState(false);

  useEffect(() => {
    setCreatedAccount(Boolean(user));
  }, [user]);

  useEffect(() => {
    if (!loaded) return;
    if (!user) {
      setNeedsLinkSocials(true);
    } else {
      const hasSocials = user?.socialUrls?.length > 0;
      setNeedsLinkSocials(!hasSocials);
    }
  }, [user, user?.socialUrls, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (!user) {
      setNeedsUploadProfilePicture(true);
    } else {
      setNeedsUploadProfilePicture(!user?.profileImageUrl);
    }
  }, [user, user?.profileImageUrl, loaded]);

  const isMetamaskConnected = typeof account === 'string';
  const hasSelectedUsername = username && isValid && !error;
  const validatedTwitter = isTwitterLink(twitterHandle);

  const handleSubmit = useCallback(() => {
    fetch('api/createAccount', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        address: account,
      }),
    }).then(() => {
      setCreatedAccount(true);
    });
  }, [account, username]);

  const handleSubmitSocials = useCallback(() => {
    if (!account) return;
    fetch('api/saveSocials', {
      method: 'POST',
      body: JSON.stringify({
        twitterHandle: twitterHandle,
        address: account,
      }),
    }).then(() => setNeedsLinkSocials(false));
  }, [twitterHandle, account]);

  const notLoaded = !loaded;

  const waitingForCollection = Boolean(user) && !collectionLoaded;

  if (notLoaded) {
    return null;
  } else if (waitingForCollection) {
    return null;
  } else if (!createdAccount || !isMetamaskConnected) {
    return (
      <div
        style={{
          display: 'inline-block',
        }}
      >
        <input
          style={{
            pointerEvents: 'none',
          }}
          readOnly
          type="checkbox"
          data-key={CONNECT_WALLET} // 3
          checked={isMetamaskConnected} // 5
        />
        <label>Connect your wallet</label>
        <input
          style={{
            pointerEvents: 'none',
          }}
          readOnly
          type="checkbox"
          data-key={CHOOSE_USERNAME} // 3
          checked={hasSelectedUsername} // 5
        />
        <label>Choose your username</label>
        <input
          readOnly
          style={{
            pointerEvents: 'none',
          }}
          type="checkbox"
          data-key={LINK_SOCIALS} // 3
          checked={!needsLinkSocials} // 5
        />
        <label>Link your socials!</label>
        <br />
        {isMetamaskConnected && (
          <>
            <h2> Choose your username </h2>
            <div
              style={{
                display: 'flex',
                WebkitBoxAlign: 'center',
                alignItems: 'center',
                boxSizing: 'inherit',
                paddingRight: 4,
              }}
            >
              <div
                style={{
                  boxSizing: 'inherit',
                  display: 'flex',
                  width: 16,
                  top: 16,
                  marginRight: 4,
                }}
              >
                <p
                  style={{
                    lineHeight: 1.5,
                    padding: 0,
                    color: 'rgb(10, 11, 13)',
                    fontWeight: 700,
                    fontSize: 14,
                    pointerEvents: 'none',
                  }}
                >
                  LinkCha.in/
                </p>
              </div>
              <input
                type="text"
                autoComplete="false"
                name="hidden"
                id="username"
                required
                placeholder="username"
                value={username}
                onChange={(evt) => setUsername(evt.target.value)}
                style={{
                  fontSize: 14,
                  marginLeft: '3.75rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  boxSizing: 'inherit',
                  backgroundColor: 'transparent',
                  backgroundImage: 'none',
                  border: 'none',
                  boxShadow: 'none',
                  padding: '0px 12px 0px 2px',
                  font: 'inherit',
                  appearance: 'none',
                  borderRadius: 8,
                  opacity: 1,
                  color: 'rgb(10, 11, 13)',
                  width: '100%',
                  height: 44,
                }}
              />
              {error && (
                <div
                  style={{
                    color: 'red',
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          </>
        )}
        {hasSelectedUsername && (
          <button onClick={handleSubmit}>Create account</button>
        )}
      </div>
    );
  } else if (needsUploadProfilePicture) {
    return (
      <NFTCollection
        nfts={collection}
        isOnboarding
        address={account}
        onSaveProfile={() => setNeedsUploadProfilePicture(false)}
      />
    );
  } else if (needsLinkSocials) {
    return (
      <div>
        <h1>Please link your socials</h1>
        <h3> Twitter </h3>
        <input
          style={{
            width: '20%',
          }}
          onSubmit={handleSubmitSocials}
          type="text"
          autoComplete="false"
          name="hidden"
          id="twitter"
          placeholder={twitterHandle ?? 'https://twitter.com/yourhandle'}
          value={twitterHandle}
          onChange={(evt) => setTwitterHandle(evt.target.value)}
        />
        {validatedTwitter && (
          <button onClick={handleSubmitSocials}>Save</button>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default OnboardingFlow;
