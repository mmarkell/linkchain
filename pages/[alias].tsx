import { GetServerSideProps } from 'next';
import { prisma } from './db';

type Props = {
  addresses: string[];
};

const Account = (props: Props) => {
  const { addresses } = props;
  return (
    <>
      <p>Addresses for user</p>
      {addresses.map((address) => (
        <p key={address}>{address}</p>
      ))}
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
        addresses: [],
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

    return {
      props: {
        addresses: user.addresses,
      }, // will be passed to the page component as props
    };
  } catch (e) {
    return {
      props: {
        addresses: [],
      },
    };
  }
};

export default Account;
