import MetaMaskOnboarding from '@metamask/onboarding';
import { useWeb3React } from '@web3-react/core';
import { UserRejectedRequestError } from '@web3-react/injected-connector';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { injected } from '../connectors';
import useENSName from '../hooks/useENSName';
import { formatEtherscanLink, shortenHex } from '../util';
import Link from 'next/link';
import Image, { ImageProps } from 'next/image';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/dist/client/router';

type Props = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: Props) => {
  const { chainId, account } = useWeb3React();

  const ENSName = useENSName(account);

  if (typeof account !== 'string') return null;

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <a
        style={{
          background: '#01030d',
          border: 'none',
          fontFamily: 'Space Grotesk',
          fontSize: '1.4rem',
          color: '#fff',
          padding: '6px 20px',
          marginRight: 10,
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
      {/* <div
        style={{
          marginRight: 20,
          marginTop: 10,
          cursor: 'pointer',
        }}
      > */}
      {/* {user?.alias && (
          <Link href={`/${user?.alias}`} passHref>
            <ForwardedImage
              src="/profile_icon.png"
              alt="User Profile"
              width={20}
              height={20}
            />
          </Link>
        )} */}
      {/* </div> */}
    </div>
  );
};

const ForwardedImage = forwardRef(function ForwardedImage(
  props: ImageProps,
  ref,
) {
  return <Image {...props} alt={props.alt} />;
});

export default Account;
