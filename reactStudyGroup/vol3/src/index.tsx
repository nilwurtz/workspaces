import React from "react";
import ReactDOM from "react-dom";

import { AsyncParent } from "./components/Async";
import { BasicParent } from "./components/Basic";
import { CleanUpParent } from "./components/CleanUp";
import { FetchParent } from "./components/Fetch";
import { LoopParent } from "./components/Loop";
import { WorkParent } from "./components/Work";
import { WithHooksParent } from "./components/WithHooks";

const App = () => {
  return (
    <div>
      <div>
        <BasicParent />
        <CleanUpParent />
        <FetchParent />
        {/* <LoopParent /> */}
        <AsyncParent />
        <WorkParent />
        <WithHooksParent />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
