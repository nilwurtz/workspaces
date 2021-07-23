import { createContext, useCallback, useState } from 'react';

// set context type
export type AlignContext = {
  align: boolean;
  setCurrentAlign: (currentAlign: boolean) => void;
};

// context default value
const DEFAULT_ALIGN_CONTEXT: AlignContext = {
  align: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentAlign: () => {},
};

// context
export const alignContext = createContext<AlignContext>(DEFAULT_ALIGN_CONTEXT);

// custom Hook
export const useAlign = (): AlignContext => {
  const [align, setAlign] = useState(false);
  const setCurrentAlign = useCallback((current: boolean): void => {
    setAlign(current);
  }, []);

  return {
    align,
    setCurrentAlign,
  };
};
