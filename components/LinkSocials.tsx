import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import { OnboardingPropsType } from './ConnectToMetamask';

const isTwitterLink = (link: string) =>
  /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/.test(
    link,
  );

export const LinkSocials = (props: OnboardingPropsType) => {
  const { account } = useWeb3React();
  const { onComplete } = props;

  const [twitterHandle, setTwitterHandle] = useState('');
  const [error, setError] = useState('');

  const { user } = useAuth();
  const [loading, setLoading] = useLoading();

  useEffect(() => {
    if (Boolean(user?.links?.length > 0)) {
      onComplete();
    }
  }, [onComplete, user]);

  const handleSubmit = useCallback(() => {
    if (!account) return;
    if (!isTwitterLink(twitterHandle)) {
      setError('Enter a valid twitter profile link');
      return;
    }

    setLoading(true);

    fetch('api/saveSocials', {
      method: 'POST',
      body: JSON.stringify({
        twitterHandle: twitterHandle,
        address: account,
      }),
    })
      .then(() => setLoading(false))
      .then(onComplete);
  }, [account, twitterHandle, setLoading, onComplete]);

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <div>
      <h1>Please link your socials</h1>
      <h3> Twitter </h3>
      <input
        style={{
          width: '20%',
        }}
        type="text"
        autoComplete="false"
        name="hidden"
        id="twitter"
        placeholder={twitterHandle ?? 'https://twitter.com/yourhandle'}
        value={twitterHandle}
        onChange={(evt) => setTwitterHandle(evt.target.value)}
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
  );
};
