import React, { useEffect, useState } from "react";
import axios from "axios";

const WithOutHooks: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const url = "https://jsonplaceholder.typicode.com/todos/20";
    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch(() => setIsError(true));
  }, []);

  return <div>{isError ? "Fetch Error!!!" : JSON.stringify(data)}</div>;
};

const useFetchTodo = () => {
  const [data, setData] = useState<any | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const url = "https://jsonplaceholder.typicode.com/todos/20";
    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch(() => setIsError(true));
  }, []);

  return [data, isError] as const;
};

const WithHooks: React.FC = () => {
  const [data, isError] = useFetchTodo();
  return <div>{isError ? "Fetch Error!!!" : JSON.stringify(data)}</div>;
};

const useFetchTodoWithId = (id: string) => {
  const [data, setData] = useState<any | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const url = `https://jsonplaceholder.typicode.com/todos/${id}`;
    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch(() => setIsError(true));
  }, [id]);

  return [data, isError] as const;
};

const FetchSingleTodo: React.FC = () => {
  const [data, isError] = useFetchTodoWithId("3");
  return <div>{isError ? "Fetch Error!!!" : JSON.stringify(data)}</div>;
};

const useTodo = (id: string) => {
  const [data, setData] = useState<any | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
    if (id !== "") {
      const url = `https://jsonplaceholder.typicode.com/todos/${id}`;
      axios
        .get(url)
        .then((res) => setData(res.data))
        .catch(() => setIsError(true));
    }
  }, [id]);

  return [data, isError] as const;
};

const ShowSingleTodo: React.FC = () => {
  const [input, setInput] = useState("");
  const [data, isError] = useTodo(input);
  return (
    <div>
      <p>Input Todo ID.</p>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      {isError ? "No Such Data!!!" : JSON.stringify(data)}
    </div>
  );
};

export const WithHooksParent = () => {
  return (
    <>
      <WithOutHooks />
      <WithHooks />
      <FetchSingleTodo />
      <ShowSingleTodo />
    </>
  );
};
