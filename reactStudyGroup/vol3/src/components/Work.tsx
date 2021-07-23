import React, { useEffect, useState } from "react";

const ChangeTitleTemplate: React.FC = () => {
  const [input, setInput] = useState("");
  return <input value={input} onChange={(e) => setInput(e.target.value)} />;
};

const ChangeTitle: React.FC = () => {
  const [input, setInput] = useState("");

  useEffect(() => {
    document.title = input;
  }, [input]);

  return <input value={input} onChange={(e) => setInput(e.target.value)} />;
};

export const WorkParent = () => {
  return (
    <>
      <ChangeTitleTemplate />
      <ChangeTitle />
    </>
  );
};
