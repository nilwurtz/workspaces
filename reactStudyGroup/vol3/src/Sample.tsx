import React, { useEffect } from "react";

const someEffect = () => console.log("effect");
const cleanUpFunc = () => console.log("creanup");
const deps = "hoge";

const Sample = () => {
  useEffect(() => {
    someEffect();
    return cleanUpFunc;
  }, [deps]);

  return <div />;
};

export const SampleParent = () => {
  return (
    <>
      <Sample />
    </>
  );
};
