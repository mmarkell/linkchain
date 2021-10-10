import MetaMaskOnboarding from '@metamask/onboarding';
import { useWeb3React } from '@web3-react/core';
import { UserRejectedRequestError } from '@web3-react/injected-connector';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { injected } from '../connectors';
import useENSName from '../hooks/useENSName';
import { formatEtherscanLink, shortenHex } from '../util';

type Props = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: Props) => {
  const { active, error, activate, chainId, account, setError } =
    useWeb3React();

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>();

  useLayoutEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
  }, []);

  useEffect(() => {
    if (active || error) {
      onboarding.current?.stopOnboarding();
    }
  }, [active, error]);

  const ENSName = useENSName(account);

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

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== 'string') {
    return (
      <div>
        <button
          style={{
            background: '#01030d',
            border: 'none',
            fontFamily: 'Space Grotesk',
            fontSize: '1.4rem',
            color: '#fff',
            padding: '6px 20px',
            transition: 'all .3s ease-in-out',
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <a
      style={{
        background: '#01030d',
        border: 'none',
        fontFamily: 'Space Grotesk',
        fontSize: '1.4rem',
        color: '#fff',
        padding: '6px 20px',
        transition: 'all .3s ease-in-out',
        cursor: 'pointer',
      }}
      {...{
        href: formatEtherscanLink('Account', [chainId, account]),
        target: '_blank',
        rel: 'noopener noreferrer',
      }}
    >
      {ENSName || `${shortenHex(account, 4)}`}
    </a>
  );
};

export default Account;
