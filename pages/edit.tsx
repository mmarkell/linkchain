import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import React from 'react';
import Account from '../components/Account';
import { LinkSocials } from '../components/LinkSocials';
import Logo from '../components/Logo';
import NFTCollection from '../components/NFTCollection';
import useAuth from '../hooks/useAuth';
import useEagerConnect from '../hooks/useEagerConnect';
import useNFTCollection from '../hooks/useNFTCollection';
import crypto from 'crypto';

const Edit = () => {
  const triedToEagerConnect = useEagerConnect();
  const { user, reloadUser } = useAuth();
  const { account, active } = useWeb3React<Web3Provider>();

  const { collection, collectionLoaded } = useNFTCollection(account);

  return (
    <div>
      <Head>
        <title>LinkChain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Logo />
          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        {user && collection && (
          <NFTCollection
            userId={user.id}
            selectedNFT={user?.profileNFT}
            isOnboarding={true}
            address={user.address}
            alias={user.alias}
            nfts={collection}
            onSaveProfile={() => console.log('Saved new NFT!')}
          />
        )}
        <br />
        <br />
        {user && user.links && (
          <LinkSocials
            existingLinks={user.links.map((_link) => ({
              link: _link.url,
              title: _link.title,
              id: crypto.randomBytes(20).toString('hex'),
            }))}
          />
        )}
      </main>

      <style jsx>{`
        nav {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          visibility: visible;
          opacity: 1;
          transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
          transition: opacity 1.5s cubic-bezier(0.5, 0, 0, 1) 0.2s,
            transform 1.5s cubic-bezier(0.5, 0, 0, 1) 0.2s;
          background-color: #617f8f;
        }
        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Edit;
