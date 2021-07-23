import axios from "axios";
import React, { useEffect, useState } from "react";

const FetchOnRender: React.FC = () => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/1")
      .then((res) => setData(res.data));
  }, []);

  return <div>{data ? JSON.stringify(data) : "axios.geting..."}</div>;
};

const FetchNoDep: React.FC = () => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/5")
      .then((res) => setData(res.data));
  }, []);

  return <div>{data ? JSON.stringify(data) : "axios.geting..."}</div>;
};

const FetchOnClick: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (click && !data) {
      axios
        .get("https://jsonplaceholder.typicode.com/todos/2")
        .then((res) => setData(res.data));
    }
  }, [click]);

  return (
    <div>
      {data ? JSON.stringify(data) : "Before axios.get"}
      <button onClick={() => setClick((prev) => !prev)}>Fetch!</button>
    </div>
  );
};

const FetchClickCb: React.FC = () => {
  const [data, setData] = useState<any | null>(null);

  const cb = () => {
    if (!data) {
      axios
        .get("https://jsonplaceholder.typicode.com/todos/2")
        .then((res) => setData(res.data));
    }
  };

  return (
    <div>
      {data ? JSON.stringify(data) : "Before axios.get"}
      <button onClick={cb}>Fetch!</button>
    </div>
  );
};

export const FetchParent = () => {
  return (
    <>
      <FetchOnRender />
      <FetchNoDep />
      <FetchOnClick />
      <FetchClickCb />
    </>
  );
};
