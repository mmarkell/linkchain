import { Nft } from '.prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useLoading } from '../hooks/useLoading';
import { ReturnItem } from '../pages/api/getTokensByAddress';
import { SetProfilePictureCommand } from '../pages/api/setProfilePicture';

type Props = {
  nfts: ReturnItem[];
  alias?: string;
  isOnboarding?: boolean;
  address?: string;
  userId?: number;
  onSaveProfile?: () => void;
  selectedNFT?: Nft;
};

const NFTCollection = (props: Props) => {
  const {
    nfts,
    alias,
    isOnboarding,
    address,
    onSaveProfile,
    userId,
    selectedNFT,
  } = props;

  const [chosenImage, setChosenImage] = useState<string>(selectedNFT?.imageUrl);
  const [loading, setLoading] = useLoading();

  const handleSkip = useCallback(() => {
    onSaveProfile();
  }, [onSaveProfile]);

  const handleClick = useCallback(
    (nft: ReturnItem) => {
      if (isOnboarding) {
        if (!userId || !address) return;
        setChosenImage(nft.imageUrl);
        const body: SetProfilePictureCommand = {
          userAddress: address,
          nftArgs: {
            ...nft,
          },
        };
        setLoading(true);
        fetch('/api/setProfilePicture', {
          body: JSON.stringify(body),
          method: 'POST',
        })
          .then(() => setLoading(false))
          .then(onSaveProfile);
      } else {
        const link = nft.tokenID
          ? `https://etherscan.io/token/${nft.address}?a=${nft.tokenID}`
          : `https://etherscan.io/token/${nft.address}`;

        if (typeof window !== 'undefined') {
          window.open(link, '_blank').focus();
        }
      }
    },
    [address, isOnboarding, onSaveProfile, setLoading, userId],
  );

  const groupedNFTs: { [key: string]: ReturnItem[] } = useMemo(() => {
    return nfts.reduce((prev, curr) => {
      const group = curr.tokenName;
      if (!prev[group]) prev[group] = [];
      prev[group].push(curr);
      return prev;
    }, {});
  }, [nfts]);

  let style = {};
  if (isOnboarding) {
    style = { maxHeight: '100%' };
  } else {
    style = { overflowY: 'auto', textAlign: 'center' };
  }

  return (
    <div style={style}>
      {isOnboarding && nfts?.length > 0 ? (
        <div
          style={{
            maxWidth: '80%',
            margin: 'auto',
            display: 'flex',
          }}
        >
          <h1>Which NFT would you like to use for a profile picture?</h1>
        </div>
      ) : isOnboarding ? (
        <div
          style={{
            maxWidth: '80%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '90vh',
          }}
        >
          <h1>Connect to an account with NFTs!</h1>
          <div
            style={{
              backgroundColor: '#1F4893',
              border: 'none',
              fontFamily: 'Space Grotesk',
              fontSize: '1.4rem',
              padding: '60px 20px',
              transition: 'all .3s ease-in-out',
              borderRadius: 10,
              color: 'white',
              maxWidth: '80%',
              width: 500,
              height: '30%',
              cursor: 'pointer',
              margin: 'auto',
              marginTop: '2rem',
            }}
            onClick={handleSkip}
          >
            Skip to your LinkChain
          </div>
        </div>
      ) : null}
      <br />
      {Object.keys(groupedNFTs).map((key) => (
        <div key={key}>
          <h2> {key} </h2>
          {groupedNFTs[key].map((item, i) => (
            <div
              key={`${item.tokenName}-${i}`}
              className={'clickable card'}
              onClick={() => handleClick(item)}
            >
              <div style={{ margin: 10 }}>
                {item.tokenName} {item.tokenID ? `#${item.tokenID}` : ''}
              </div>
              <Image
                loading="lazy"
                alt={item.tokenName}
                src={item.imageUrl}
                width={200}
                height={200}
                placeholder="blur"
                blurDataURL="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==)"
              />
              {chosenImage === item.imageUrl && (
                <a
                  href={`https://twitter.com/intent/tweet?text=I just verified my ownership of ${encodeURIComponent(
                    item.tokenName,
                  )} ${encodeURIComponent(
                    item.tokenID,
                  )} on LinkChain!&url=https://linkchain.com/${alias}&via=linkchain`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-card"
                  title="Share to Twitter"
                >
                  <Image
                    src="/verified.png"
                    width={25}
                    height={25}
                    alt="Verified Profile Picture"
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      ))}

      <style jsx>{`
        .clickable {
          cursor: pointer;
        }

        .social-card {
          displa: block;
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

        .card:hover::after {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default NFTCollection;
