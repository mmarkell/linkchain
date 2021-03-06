import { Link as SocialLinks, LinkType, Nft } from '.prisma/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import { LinkItem } from '../components/LinkItem';
import Logo from '../components/Logo';
import NFTCollection from '../components/NFTCollection';
import { ProfileHeader } from '../components/ProfileHeader';
import { prisma } from '../db';
import { getTokensByAddress, ReturnItem } from './api/getTokensByAddress';

type Props = {
  profileNFT: Nft;
  nfts: ReturnItem[];
  links: SocialLinks[];
  alias: string;
  address: string;
};

const UserPage = (props: Props) => {
  const { nfts, links, alias, profileNFT, address } = props;

  return (
    <>
      <Head>
        <title>LinkChain</title>
        <meta name="twitter:card" content="summary" />
        <meta property="og:url" content={`https://www.linkchain.me/${alias}`} />
        <meta property="og:title" content={`${alias}'s LinkChain!`} />
        <meta
          property="og:description"
          content={`See ${alias}'s verified NFTs and social links on LinkChain!`}
        />
        <meta property="og:image" content={profileNFT?.imageUrl} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav>
          <Logo />
        </nav>
      </header>
      <ProfileHeader profileNFT={profileNFT} alias={alias} address={address} />
      <div
        style={{
          textAlign: 'center',
        }}
      >
        {links.map((item, i) => (
          <LinkItem item={item} key={`link-${i}`} />
        ))}
      </div>
      <br />
      <br />
      <br />
      {nfts.length > 0 && (
        <h1
          style={{
            color: 'black',
            textAlign: 'center',
          }}
        >
          NFT Collection{' '}
          <Image src="/verified.png" width={25} height={25} alt="verified" />
        </h1>
      )}
      <NFTCollection nfts={nfts} />
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
          background-color: white;
        }
      `}</style>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { params } = context;
  const alias = params.alias;
  if (typeof alias !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        alias: alias,
      },
      include: {
        links: true,
        profileNFT: true,
      },
      rejectOnNotFound: true,
    });

    const { result } = await getTokensByAddress(user.address);
    return {
      revalidate: 120,
      props: {
        profileNFT: user.profileNFT,
        nfts: result,
        links: user.links ?? [],
        alias,
        address: user.address,
      }, // will be passed to the page component as props
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany({
    include: {
      links: true,
      profileNFT: true,
    },
  });
  const paths = users
    .filter((user) => user.alias && user.profileNFT?.imageUrl)
    .map((user) => {
      return {
        params: { alias: user.alias },
      };
    });
  return {
    paths,
    fallback: 'blocking',
  };
};

export default UserPage;
