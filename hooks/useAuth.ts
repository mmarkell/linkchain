import type { Web3Provider } from '@ethersproject/providers';
import { User } from '@prisma/client';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';

type Response = {
  user: User;
  loaded: boolean;
};

export default function useAuth(): Response {
  const { account } = useWeb3React<Web3Provider>();
  const [user, setUser] = useState<User>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`api/getAccount?address=${account}`)
      .then((r) => r.json())
      .then(({ user }: { user: User }) => {
        setUser(user);
        setLoaded(true);
      });
    return () => {
      setUser(null);
    };
  }, [account, setLoaded, setUser]);
  return { user, loaded };
}
