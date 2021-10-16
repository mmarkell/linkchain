import { Link, Nft } from '.prisma/client';
import { LinkType } from '@prisma/client';
import Image from 'next/image';
type Props = {
  item: Link;
};

const iconMap: { [key in LinkType]: JSX.Element } = {
  FACEBOOK: null,
  INSTAGRAM: null,
  OTHER: null,
  SNAPCHAT: null,
  TIKTOK: null,
  TWITCH: null,
  TWITTER: (
    <Image src="/twitter_blue.png" width={40} height={40} alt="Twitter" />
  ),
  YOUTUBE: null,
};

export const LinkItem = (props: Props) => {
  const { item } = props;
  return (
    <a
      rel="noopener noreferrer"
      href={
        item.url.startsWith('www') || item.url.startsWith('http')
          ? item.url
          : `https://${item.url}`
      }
      target="_blank"
      style={{
        display: 'block',
        transition:
          'box-shadow 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s, color 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s, border-color 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s, transform 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s, background-color 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s',
        border: '2px solid red',
        backgroundColor: 'black',
        position: 'relative',
        margin: 'auto',
        marginBottom: 10,
        cursor: 'pointer',
        height: 50,
        width: '30%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          left: 4,
          width: 46,
          height: 46,
        }}
      >
        {iconMap[item.type]}
      </div>
      <span
        style={{
          position: 'relative',
          lineHeight: 3,
          width: '100%',
          fontFamily: 'Space Grotesk',
          color: 'white',
        }}
      >
        {item.title}
      </span>
    </a>
  );
};
