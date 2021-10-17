import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import { OnboardingPropsType } from './ConnectToMetamask';

export const OnboardingAccountCreation = (props: OnboardingPropsType) => {
  const { onComplete } = props;
  const [username, setUsername] = useState('');
  const { account } = useWeb3React();
  const [error, setError] = useState('');

  const { user } = useAuth();
  const [loading, setLoading] = useLoading();

  useEffect(() => {
    if (Boolean(user)) {
      onComplete();
    }
  }, [onComplete, user]);

  const handleSubmit = useCallback(() => {
    setLoading(true);
    fetch(`api/validateUsername?username=${username}`)
      .then((r) => r.json())
      .then(({ isUsernameValid }: { isUsernameValid: boolean }) => {
        if (!isUsernameValid) {
          setError('Sorry, that username is taken');
        } else if (username?.length >= 0 && username.length <= 3) {
          setError('Username must be more than 3 letters');
        } else {
          fetch('api/createAccount', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              address: account,
            }),
          })
            .then(() => {
              setLoading(false);
            })
            .then(() => {
              onComplete();
            });
        }
      });
  }, [setLoading, username, account, onComplete]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Space Grotesk',
        minHeight: '90vh',
        alignItems: 'center',
      }}
    >
      <h2>Choose your username </h2>
      <div
        style={{
          display: 'flex',
          WebkitBoxAlign: 'center',
          fontFamily: 'Space Grotesk',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Space Grotesk',
            width: 16,
            top: 16,
            marginRight: 2,
          }}
        >
          <p
            style={{
              lineHeight: 1.5,
              color: 'rgb(10, 11, 13)',
              fontWeight: 700,
              fontSize: 14,
              fontFamily: 'Space Grotesk',
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
            fontFamily: 'Space Grotesk',
            border: 'none',
            padding: '0px 12px 0px 2px',
            font: 'inherit',
            appearance: 'none',
            borderRadius: 8,
            opacity: 1,
            color: 'rgb(10, 11, 13)',
            height: 50,
          }}
        />
      </div>
      {error && (
        <div
          style={{
            color: 'red',
          }}
        >
          {error}
        </div>
      )}
      <button
        style={{
          marginTop: '2rem',
          backgroundColor: '#1F4893',
          bottom: '20%',
          position: 'absolute',
          width: 250,
          maxWidth: '60%',
          color: 'white',
          fontFamily: 'Space Grotesk',
          height: 100,
          maxHeight: '10%',
          fontSize: '2rem',
        }}
        onClick={handleSubmit}
      >
        Continue
      </button>
    </div>
  );
};
