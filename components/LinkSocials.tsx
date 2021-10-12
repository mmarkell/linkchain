import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { OnboardingPropsType } from './ConnectToMetamask';

const isTwitterLink = (link: string) =>
  /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/.test(
    link,
  );

export const LinkSocials = (props: OnboardingPropsType) => {
  const { account } = useWeb3React();
  const { onComplete } = props;

  const [twitterHandle, setTwitterHandle] = useState('');

  const validatedTwitter = isTwitterLink(twitterHandle);
  const { user } = useAuth();

  useEffect(() => {
    if (Boolean(user?.socialUrls?.length > 0)) {
      onComplete();
    }
  }, [onComplete, user]);

  const handleSubmitSocials = useCallback(() => {
    if (!account) return;
    fetch('api/saveSocials', {
      method: 'POST',
      body: JSON.stringify({
        twitterHandle: twitterHandle,
        address: account,
      }),
    }).then(onComplete);
  }, [account, twitterHandle, onComplete]);

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
      {validatedTwitter && <button onClick={handleSubmitSocials}>Save</button>}
    </div>
  );
};
