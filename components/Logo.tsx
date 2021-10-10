import React from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
      <a
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          color: '#fff',
          marginLeft: 20,
        }}
      >
        LinkChain
      </a>
    </Link>
  );
};

export default Logo;
