import React, { useState } from "react";

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div>
        You clicked <strong>{count}</strong> times
      </div>
      <button onClick={() => setCount((prev) => prev + 1)}>increment</button>
      <button onClick={() => setCount(0)}>reset</button>
    </div>
  );
};

const VeryHeabyLongCalc = (text: string) => text.toLowerCase();

const LateInitialize: React.FC<{ text: string }> = (props) => {
  const [state, setState] = useState(() => VeryHeabyLongCalc(props.text));

  return <div>{state}</div>;
};

export const TipsParent = () => {
  return (
    <>
      <Counter />
      <LateInitialize text="hoge" />
    </>
  );
};
