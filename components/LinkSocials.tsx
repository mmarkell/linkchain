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
    .some((elem: SocialAccount) => {
      return !isUrl(elem.link);
    });
};

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
      setError('Enter a valid twitter profile link');
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
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {!existingLinks && (
          <h1
            style={{
              top: 0,
            }}
          >
            Create your linkchain!
          </h1>
        )}

        <div
          onClick={addElement}
          style={{
            marginBottom: 10,
            cursor: 'pointer',
            backgroundColor: 'black',
            color: 'white',
            width: 200,
            height: 20,
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
            backgroundColor: 'black',
            color: 'white',
            width: 200,
            height: 20,
          }}
        >
          Save and continue
        </div>
      </div>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {socialAccounts.map((link) => (
          <SocialInput
            key={link.id}
            title={link.title}
            link={link.link}
            onEdit={(title: string, _link: string) =>
              updateElement(link.id, title, _link)
            }
            onDelete={() => removeElement(link.id)}
          />
        ))}
      </div>
    </div>
  );
};
