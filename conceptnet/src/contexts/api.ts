import { ConceptNetAPI } from 'api';
import { createContext, useCallback, useState } from 'react';

// set context type
export type APIContext = {
  data: ConceptNetAPI | null;
  setCurrentData: (currentData: ConceptNetAPI | null) => void;
};

// context default value
const DEFAULT_API_CONTEXT: APIContext = {
  data: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentData: () => {},
};

// context
export const apiContext = createContext<APIContext>(DEFAULT_API_CONTEXT);

// custom Hook
export const useAPI = (): APIContext => {
  const [data, setData] = useState<ConceptNetAPI | null>(null);
  const setCurrentData = useCallback((current: ConceptNetAPI | null): void => {
    setData(current);
  }, []);

  return {
    data,
    setCurrentData,
  };
};
