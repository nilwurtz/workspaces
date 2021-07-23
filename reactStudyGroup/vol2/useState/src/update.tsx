import React, { useState } from "react";

type User = {
  name: string;
  age: number | null;
};

const ObjState: React.FC = () => {
  const [user, setUser] = useState<User>({ name: "", age: null });
  return (
    <div>
      <div>Name: {user.name}</div>
      <div>Age: {user.age}</div>
      <button onClick={() => setUser({ name: "Akita", age: 30 })}>
        Change
      </button>
    </div>
  );
};

const ArrayState: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  return (
    <div>
      <div>Numbers: {numbers.join(" ")}</div>
      <button onClick={() => setNumbers([...numbers, numbers.length])}>
        append
      </button>
    </div>
  );
};

const MultiState: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  return (
    <div>
      <div>Name state: {name}</div>
      <div>Country state:{country}</div>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Country:
        <input value={country} onChange={(e) => setCountry(e.target.value)} />
      </label>
    </div>
  );
};

const Sample: React.FC = () => {
  const [firstName, setFirstName] = useState("Rudi");
  const [lastName, setLastName] = useState("Yardley");
  return <button onClick={() => setFirstName("Fred")}>Fred</button>;
};

const CheckRender: React.FC = () => {
  const [count, setCount] = useState(0);
  console.log("rendered.");
  return (
    <div>
      {count}
      <button onClick={() => setCount(0)}>PUSH</button>
    </div>
  );
};

const CantUpdate: React.FC = () => {
  const [state, setState] = useState({ name: "bob" });
  const updateFunc = () => {
    state["name"] = "andy";
    setState(state);
  };
  return (
    <div>
      <div>name: {state.name}</div>
      <button onClick={updateFunc}>push!</button>
    </div>
  );
};

export const UpdateParent = () => {
  return (
    <>
      <CantUpdate />
      <ObjState />
      <MultiState />
      <Sample />
      <ArrayState />
      <CheckRender />
    </>
  );
};
