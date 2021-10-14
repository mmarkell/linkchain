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
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          marginBottom: 16,
          transition:
            'box-shadow 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s, color 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s, border-color 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s, transform 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s, background-color 0.25s cubic-bezier(0.08, 0.59, 0.29, 0.99) 0s',
          border: '2px solid rgb(255, 255, 255)',
          backgroundColor: 'rgb(255, 255, 255)',
          color: 'rgb(61, 59, 60)',
          position: 'relative',
          height: 50,
          width: '30%',
          margin: 'auto',
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
          }}
        >
          {item.type}{' '}
        </span>
      </div>
    </a>
  );
};
