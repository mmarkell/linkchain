import React from 'react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/">
      <a
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#DFCC74',
          marginLeft: 20,
          marginTop: 10,
          textShadow: '0 0 10px #FFF01F',
        }}
      >
        LinkChain
      </a>
    </Link>
  );
};

export default Logo;
