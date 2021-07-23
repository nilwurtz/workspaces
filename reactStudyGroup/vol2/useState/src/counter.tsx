import React, { useState } from "react";

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <div>
        You clicked <strong>{count}</strong> times
      </div>
      <button onClick={() => setCount(count + 1)}>increment</button>
      <button onClick={() => setCount(0)}>reset</button>
    </div>
  );
};

export const CounterParent = () => {
  return (
    <>
      <Counter></Counter>
    </>
  );
};
