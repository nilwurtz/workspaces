import React, { useState } from "react";
import ReactDom from "react-dom";
import { CounterParent } from "./counter";
import { UpdateParent } from "./update";
import { TipsParent } from "./Tips";

const ToggleButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>{open ? "open" : "close"}</button>
      {open ? <div>OPEN!!!!!!</div> : <div>CLOSE!!!!</div>}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div id="__app">
      <ToggleButton />
      <CounterParent />
      <UpdateParent />
      <TipsParent />
    </div>
  );
};

ReactDom.render(<App />, document.getElementById("root"));
