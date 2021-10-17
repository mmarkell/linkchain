import { LinkType } from '.prisma/client';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import { OnboardingPropsType } from './ConnectToMetamask';
import { SocialInput } from './SocialInput';

import crypto from 'crypto';

type SocialAccount = { title: string; link: string; id: string };
type SocialAccounts = SocialAccount[];

const urlRegex = new RegExp(
  '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
);

const isUrl = (val: string) => urlRegex.test(val);

const validateSocialAccounts = (socialAccounts: SocialAccounts) => {
  return !Object.keys(socialAccounts) // returns true if an account is not a valid URL
    .map((key) => socialAccounts[key])
    .filter((elem) => elem)
    .some((elem: SocialAccount) => hasError(elem));
};

const hasError = (link: SocialAccount) => !isUrl(link.link);

export const LinkSocials = (
  props: OnboardingPropsType & { existingLinks?: SocialAccounts },
) => {
  const { account } = useWeb3React();
  const { onComplete, existingLinks } = props;

  const [socialAccounts, setSocialAccounts] = useState<SocialAccounts>(
    existingLinks ?? [],
  );

  const [error, setError] = useState('');

  const [loading, setLoading] = useLoading();

  const addElement = useCallback(() => {
    setSocialAccounts((curr) => [
      ...curr,
      { title: '', link: '', id: crypto.randomBytes(20).toString('hex') },
    ]);
  }, [setSocialAccounts]);

  const removeElement = useCallback(
    (id: string) => {
      setSocialAccounts((curr) => curr.filter((elem) => elem.id !== id));
    },
    [setSocialAccounts],
  );

  const updateElement = useCallback(
    (id: string, title: string, link: string) => {
      setSocialAccounts((curr) =>
        curr.map((elem) => (elem.id === id ? { ...elem, title, link } : elem)),
      );
    },
    [setSocialAccounts],
  );

  const handleSubmit = useCallback(() => {
    if (!account) return;
    if (!validateSocialAccounts(socialAccounts)) {
      setError('Please double check your links!');
      return;
    }

    setLoading(true);

    fetch('api/saveSocials', {
      method: 'POST',
      body: JSON.stringify({
        socialAccounts: socialAccounts,
        address: account,
      }),
    })
      .then(() => setLoading(false))
      .then(onComplete);
  }, [account, socialAccounts, setLoading, onComplete]);

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '90vh',
        fontFamily: 'Space Grotesk',
        marginTop: '10%',
      }}
    >
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {!existingLinks && <h1>Create your linkchain!</h1>}

        <div
          style={{
            display: 'flex',
          }}
        >
          <div
            onClick={addElement}
            style={{
              marginBottom: 10,
              cursor: 'pointer',
              backgroundColor: 'black',
              color: 'white',
              width: 150,
              height: '3rem',
              lineHeight: '3rem',
            }}
          >
            Add new link
          </div>
          <div
            onClick={handleSubmit}
            style={{
              marginBottom: 10,
              cursor: 'pointer',
              marginLeft: 20,
              backgroundColor: '#1F4893',
              color: 'white',
              width: 150,
              height: '3rem',
              lineHeight: '3rem',
            }}
          >
            Finish
          </div>
        </div>
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {error && (
          <div style={{ color: 'red', fontFamily: 'Space Grotesk' }}>
            {error}
          </div>
        )}
        {socialAccounts.map((link) => (
          <SocialInput
            key={link.id}
            title={link.title}
            link={link.link}
            onEdit={(title: string, _link: string) =>
              updateElement(link.id, title, _link)
            }
            onDelete={() => removeElement(link.id)}
            error={hasError(link) ? 'Not a valid URL' : ''}
          />
        ))}
      </div>
    </div>
  );
};
