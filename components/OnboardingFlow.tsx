import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/dist/client/router';
import { useCallback, useState } from 'react';
import useIsUsernameValid from '../hooks/useIsUsernameValid';

const CONNECT_WALLET = 1;
const CHOOSE_USERNAME = 2;
const LINK_SOCIALS = 3;

const data = [
  { _id: CONNECT_WALLET, label: 'Connect your wallet' },
  { _id: CHOOSE_USERNAME, label: 'Choose your username' },
  { _id: LINK_SOCIALS, label: 'Link your socials!' },
];

const OnboardingFlow = () => {
  const { account } = useWeb3React();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const { isValid, error } = useIsUsernameValid(username);

  const isMetamaskConnected = typeof account === 'string';
  const hasSelectedUsername = username && isValid && !error;
  const hasLinkedSocials = false;

  const handleSubmit = useCallback(() => {
    fetch('api/createAccount', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        address: account,
      }),
    })
      .then((val) => val.json())
      .then(({ success }: { success: boolean }) => {
        if (success) {
          router.push(`/${username}`);
        }
      });
  }, [account, router, username]);

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
        checked={hasLinkedSocials} // 5
      />
      <label>Link your socials!</label>
      <br />
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
      {hasSelectedUsername && (
        <button onClick={handleSubmit}>Create account</button>
      )}
    </div>
  );
};

export default OnboardingFlow;
