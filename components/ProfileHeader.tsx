import { Nft } from '.prisma/client';
import Image from 'next/image';
type Props = {
  profileNFT: Nft;
  alias: string;
  address: string;
};
import { formatEtherscanLink } from '../util';

export const ProfileHeader = (props: Props) => {
  const { profileNFT, alias, address } = props;
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '1rem',
      }}
    >
      <a
        href={formatEtherscanLink('Account', [1, address])}
        target="_blank"
        style={{
          // profile picture
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'inline-block',
          cursor: 'pointer',
        }}
        rel="noreferrer"
      >
        <Image
          width="100%"
          height="100%"
          alt="Profile Picture"
          src={profileNFT.imageUrl}
        />
      </a>
      <h2
        style={{
          display: 'block',
          color: 'white',
        }}
      >
        {alias}
      </h2>
    </div>
  );
};
