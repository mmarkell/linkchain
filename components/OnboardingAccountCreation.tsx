import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useIsUsernameValid from '../hooks/useIsUsernameValid';
import { OnboardingPropsType } from './ConnectToMetamask';

export const OnboardingAccountCreation = (props: OnboardingPropsType) => {
  const { onComplete } = props;
  const [username, setUsername] = useState('');
  const { account } = useWeb3React();
  const { isValid, error } = useIsUsernameValid(username);
  const { user } = useAuth();

  useEffect(() => {
    if (Boolean(user)) {
      onComplete();
    }
  }, [onComplete, user]);

  const handleSubmit = useCallback(() => {
    fetch('api/createAccount', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        address: account,
      }),
    }).then(() => {
      onComplete();
    });
  }, [account, onComplete, username]);

  return (
    <div>
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
          placeholder="Satoshi"
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
        {isValid && !error && (
          <button onClick={handleSubmit}>Create account</button>
        )}
      </div>
    </div>
  );
};
