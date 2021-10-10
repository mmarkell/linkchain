import { GetServerSideProps } from 'next';
import { prisma } from '../db';
import Image from 'next/image';
import Link from 'next/link';
import { getTokensByAddress } from './api/getTokensByAddress';
type Props = {
  nftUrls: string[];
  socialUrls: string[];
};

const Account = (props: Props) => {
  const { nftUrls, socialUrls } = props;
  return (
    <>
      <div>
        <p>User NFTs</p>
        {nftUrls.map((item, i) => (
          <div key={`${item}-${i}`}>
            <Image alt={item} src={item} width={100} height={100} />
          </div>
        ))}
      </div>
      <div>
        <p>Social URLs</p>
        {socialUrls.map((item, i) => (
          <Link href={item} key={`${item}-${i}`}>
            {item}
          </Link>
        ))}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { params } = context;
  const alias = params.alias;
  if (typeof alias !== 'string') {
    return {
      props: {
        nftUrls: [],
        socialUrls: [],
      },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        alias: alias,
      },
      rejectOnNotFound: true,
    });

    const tokens = await getTokensByAddress(user.address);
    console.log(tokens);
    return {
      props: {
        nftUrls: tokens.result.filter((r) => r.imageUrl).map((r) => r.imageUrl),
        socialUrls: user.socialUrls,
      }, // will be passed to the page component as props
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        nftUrls: [],
        socialUrls: [],
      },
    };
  }
};

export default Account;
