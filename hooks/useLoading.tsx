import { Dispatch, SetStateAction, useState } from 'react';

export const useLoading = (): [Boolean, Dispatch<SetStateAction<Boolean>>] => {
  const [loading, setLoading] = useState(false);
  return [loading, setLoading];
};
