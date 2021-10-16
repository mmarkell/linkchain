import MetaMaskOnboarding from '@metamask/onboarding';
import { useWeb3React } from '@web3-react/core';
import { UserRejectedRequestError } from '@web3-react/injected-connector';
import { useCallback, useEffect, useRef } from 'react';
import { injected } from '../connectors';

export type OnboardingPropsType = {
  onComplete?: () => void;
};

export const ConnectToMetamask = (props: OnboardingPropsType) => {
  const { active, error, activate, account, setError } = useWeb3React();
  const { onComplete } = props;

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>();

  useEffect(() => {
    if (Boolean(account)) {
      onComplete();
    }
  }, [account, onComplete]);

  useEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
  }, []);

  useEffect(() => {
    if (active || error) {
      onboarding.current?.stopOnboarding();
    }
  }, [active, error]);

  const handleClick = useCallback(() => {
    const hasMetaMaskOrWeb3Available =
      MetaMaskOnboarding.isMetaMaskInstalled() ||
      (window as any)?.ethereum ||
      (window as any)?.web3;
    if (hasMetaMaskOrWeb3Available) {
      activate(injected, undefined, true).catch((error) => {
        // ignore the error if it's a user rejected request
        if (error instanceof UserRejectedRequestError) {
        } else {
          setError(error);
        }
      });
    } else {
      onboarding.current?.startOnboarding();
    }
  }, [activate, setError]);

  return (
    <div>
      {Boolean(account) ? (
        <div
          style={{
            border: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '1.4rem',
            padding: '6px 20px',
            transition: 'all .3s ease-in-out',
            borderRadius: 10,
            backgroundColor: 'black',
            color: 'white',
          }}
        >
          Connected!
        </div>
      ) : (
        <button
          style={{
            border: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '1.4rem',
            padding: '6px 20px',
            transition: 'all .3s ease-in-out',
            cursor: 'pointer',
            borderRadius: 10,
            backgroundColor: 'black',
            color: 'white',
          }}
          onClick={handleClick}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};
