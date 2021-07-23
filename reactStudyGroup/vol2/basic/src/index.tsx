import React from "react";
import ReactDom from "react-dom";
import { BasicParent } from "./Basic";
import { ValidParent } from "./Fragment";
import { JSXtoJSParent } from "./JSXtoJS";
import { TypesParent } from "./Types";
import { WithJsValueParent } from "./WithJsValue";

const App: React.FC = () => {
  return (
    <div id="__app">
      <BasicParent />
      <ValidParent />
      <WithJsValueParent />
      <JSXtoJSParent />
      <TypesParent />
    </div>
  );
};

ReactDom.render(<App />, document.getElementById("root"));
