import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Logo from '../components/Logo';
import NFTCollection from '../components/NFTCollection';
import { prisma } from '../db';
import { getTokensByAddress, TokenTransaction } from './api/getTokensByAddress';

type Props = {
  nfts: TokenTransaction[];
  socialUrls: string[];
  alias: string;
};

const UserPage = (props: Props) => {
  const { nfts, socialUrls, alias } = props;

  return (
    <div
      style={{
        backgroundColor: '#231942',
        width: '100%',
        height: '100%',
        position: 'absolute',
      }}
    >
      <Head>
        <title>LinkChain</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav>
          <Logo />
        </nav>
      </header>
      <div>
        <p
          style={{
            color: '#DFCC74',
            textShadow: '0 0 10px #FFF01F',
          }}
        >
          Social URLs
        </p>
        {socialUrls.map((item, i) => (
          <div
            style={{
              color: '#DFCC74',
              textShadow: '0 0 10px #FFF01F',
            }}
            key={`${item}-${i}`}
          >
            <Link
              href={
                item.startsWith('www') || item.startsWith('http')
                  ? item
                  : `https://${item}`
              }
            >
              {item}
            </Link>
          </div>
        ))}
      </div>
      <h2
        style={{
          color: '#DFCC74',
          textShadow: '0 0 10px #FFF01F',
        }}
      >
        NFT Collection
      </h2>
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
          background-color: #617f8f;
        }
      `}</style>
    </div>
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
      rejectOnNotFound: true,
    });

    const { result } = await getTokensByAddress(user.address);
    return {
      revalidate: 120,
      props: {
        nfts: result,
        socialUrls: user.socialUrls,
        alias,
      }, // will be passed to the page component as props
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const users = await prisma.user.findMany();
  const paths = users.map((user) => {
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
