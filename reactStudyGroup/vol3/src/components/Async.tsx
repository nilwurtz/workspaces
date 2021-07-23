import axios from "axios";
import React, { useEffect, useState } from "react";

// const WithAsync: React.FC = () => {
//   const [data, setData] = useState<any | null>(null);

//   useEffect(async () => {
//     const url = "https://jsonplaceholder.typicode.com/todos/10";
//     const res = await axios.get(url);
//     const data = res.data;
//     setData(data);
//   }, []);

//   return <div>{JSON.stringify(data)}</div>;
// };

const WithAsyncValid: React.FC = () => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const url = "https://jsonplaceholder.typicode.com/todos/10";
      const res = await axios.get(url);
      const data = res.data;
      setData(data);
    })();
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

const WithThen: React.FC = () => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const url = "https://jsonplaceholder.typicode.com/todos/11";
    axios.get(url).then((res) => setData(res.data));
  }, []);

  return <div>{JSON.stringify(data)}</div>;
};

export const AsyncParent = () => {
  return (
    <>
      <WithAsyncValid />
      <WithThen />
    </>
  );
};
