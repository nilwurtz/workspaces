import React, { useEffect, useState } from "react";

const InfLoop: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, [count]);

  return <div>{count}</div>;
};

export const LoopParent = () => {
  return (
    <>
      <InfLoop />
    </>
  );
};
