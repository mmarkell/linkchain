import { useRouter } from 'next/dist/client/router';
import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import useAuth from '../hooks/useAuth';

type PropsType = PropsWithChildren<{}>;
export const OnboardingElements = (props: PropsType) => {
  const { children } = props;

  const [progressIndex, setProgressIndex] = useState(0);
  const { user, reloadUser } = useAuth();
  const router = useRouter();

  if (user?.links?.length > 0 && user?.alias) {
    router.push(`/${user?.alias}`);
  }

  const onComplete = useCallback(
    (item: number) => {
      return () => {
        setProgressIndex(item + 1);
        reloadUser();
      };
    },
    [reloadUser],
  );

  const childrenWithProps = useMemo(() => {
    return React.Children.map(children, (child, i) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { onComplete: onComplete(i) });
      }
      return child;
    });
  }, [children, onComplete]);

  const items = React.Children.toArray(childrenWithProps);
  const item = items[progressIndex];

  if (items.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <div
        style={{
          width: 'calc(100% - 20px)',
          maxWidth: 800,
          height: 'calc(100% - 20px)',
          maxHeight: '80%',
          margin: 20,
          minHeight: 300,
          borderRadius: 25,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        {item}
      </div>
    </div>
  );
};
