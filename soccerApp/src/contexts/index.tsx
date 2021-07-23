import React, { useCallback, useState } from 'react';

type PageContext = {
  field: "half" | "full";
  update: () => void;
};

export const initialPageContext: PageContext = {
  field: "half",
  update: () => null,
};
export const pageContext = React.createContext(initialPageContext);

export const useIndexContext = (): PageContext => {
  const [field, setField] = useState<"half" | "full">("half");
  const toggleField = useCallback(() => {
    if (field === "half") setField("full");
    else if (field === "full") setField("half");
  }, [field]);
  return {
    field,
    update: toggleField,
  };
};
