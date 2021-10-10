import { useEffect, useState } from 'react';

export default function useIsUsernameValid(username: string) {
  const [isValid, setIsValid] = useState<boolean>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`api/validateUsername?username=${username}`)
      .then((r) => r.json())
      .then(({ isUsernameValid }: { isUsernameValid: boolean }) => {
        setIsValid(isUsernameValid);
        if (!isUsernameValid) {
          setError('Sorry, that username is taken');
        } else if (username?.length >= 1 && username.length <= 3) {
          setError('Username must be more than 3 letters');
        } else {
          setError('');
        }
      });
    return () => {
      setIsValid(null);
    };
  }, [setIsValid, username, setError]);

  return { isValid, error };
}
