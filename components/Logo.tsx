import React from 'react';
import Link from 'next/link';
import { Loading } from './Loading';

const Logo = () => {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <Link href="/">
        <a
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginLeft: 20,
            marginTop: 10,
            marginRight: 20,
            color: 'black',
          }}
        >
          LinkChain
        </a>
      </Link>
      <Loading />
    </div>
  );
};

export default Logo;
