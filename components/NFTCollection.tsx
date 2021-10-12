import Image from 'next/image';
import { TokenTransaction } from '../pages/api/getTokensByAddress';

type Props = {
  nfts: TokenTransaction[];
  alias?: string;
  isOnboarding?: boolean;
  address?: string;
  onSaveProfile?: () => void;
};

const NFTCollection = (props: Props) => {
  const { nfts, alias, isOnboarding, address, onSaveProfile } = props;

  const handleMakeProfile = (nft: TokenTransaction) => {
    fetch('/api/setProfilePicture', {
      body: JSON.stringify({
        address,
        imageUrl: nft.imageUrl,
      }),
      method: 'POST',
    }).then(onSaveProfile);
  };

  return (
    <div
      style={{
        overflowY: 'auto',
        backgroundColor: '#231942',
      }}
    >
      {isOnboarding && nfts?.length > 0 ? (
        <h1>Which NFT would you like to use for a profile picture?</h1>
      ) : isOnboarding ? (
        <h1>Buy an NFT to get started :)</h1>
      ) : null}
      {nfts.map((item, i) => (
        <div
          key={`${item.tokenName}-${i}`}
          className={isOnboarding ? 'clickable card' : 'card'}
          onClick={() => handleMakeProfile(item)}
        >
          <Image
            loading="lazy"
            alt={item.tokenName}
            src={item.imageUrl}
            width={200}
            height={200}
            placeholder="blur"
            blurDataURL="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==)"
          />
          {alias && (
            <a
              href={`https://twitter.com/intent/tweet?text=I just verified my ownership of ${encodeURIComponent(
                item.tokenName,
              )} on LinkChain!&url=https://linkchain.com/${alias}&via=linkchain`}
              target="_blank"
              rel="noreferrer"
              className="social-card"
              title="Share to Twitter"
            >
              <Image
                src="/twitter_blue.png"
                width={25}
                height={25}
                alt="Share to Twitter"
              />
            </a>
          )}
        </div>
      ))}
      <style jsx>{`
        .clickable {
          cursor: pointer;
        }

        .social-card {
          display: none;
          z-index: 10;
          position: absolute;
          bottom: 10px;
          left: 10px;
          cursor: pointer;
        }

        .card {
          position: relative;
          display: inline-block;
          margin: 10px;
          width: 200px;
          height: 200px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .card::after {
          content: '';
          border-radius: 5px;
          position: absolute;
          z-index: -1;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          opacity: 0;
          -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .card:hover {
          -webkit-transform: scale(1.1, 1.1);
          transform: scale(1.1, 1.1);
        }

        .card:hover > .social-card {
          display: block;
        }

        .card:hover::after {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default NFTCollection;
