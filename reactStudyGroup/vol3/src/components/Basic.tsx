import React, { useEffect, useState } from "react";

const Sample: React.FC = () => {
  const [count, setCount] = useState(0);

  // state, propsのうちいずれかが更新される度に
  // useEffectに渡された関数が走る
  useEffect(() => {
    console.log(`You clicked ${count} times`);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
};

const WithDeps: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`You clicked ${count} times`);
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
};

const OnMountOnly: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`Initial State: ${count}`);
  }, []);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
};

const MultipleEffect: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`Initial State: ${count}`);
  }, []);

  useEffect(() => {
    console.log(`You clicked ${count} times`);
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
};

export const BasicParent: React.FC = () => {
  return (
    <>
      <Sample />
      <WithDeps />
      <OnMountOnly />
      <MultipleEffect />
    </>
  );
};
