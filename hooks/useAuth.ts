import type { Web3Provider } from '@ethersproject/providers';
import { Prisma } from '@prisma/client';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';

const userWithRelations = Prisma.validator<Prisma.UserArgs>()({
  include: {
    links: true,
    profileNFT: true,
  },
});

type User = Prisma.UserGetPayload<typeof userWithRelations>;

type Response = {
  user: User;
  loaded: boolean;
  reloadUser: () => void;
};

export default function useAuth(): Response {
  const { account, active } = useWeb3React<Web3Provider>();
  const [user, setUser] = useState<User>(null);
  const [loaded, setLoaded] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const reloadUser = useCallback(() => {
    setIsDirty(true);
  }, []);

  useEffect(() => {
    if (active && !account) {
      /**
       * Metamask is connected to the site, but
       * the account has not been populated yet.
       */
      setLoaded(true);
    } else if (account) {
      fetch(`api/getAccount?address=${account}`)
        .then((r) => r.json())
        .then(({ user }: { user: User }) => {
          setUser(user);
          setLoaded(true);
        });
    }
    return () => {
      setUser(null);
      setIsDirty(false);
    };
  }, [account, active, setLoaded, setUser, isDirty]);
  return { user, loaded, reloadUser };
}
