"use strict";
import React from "react"
import ReactDom from "react-dom"

const Page = () => {
  return (
    <>
      <h1>Hello World</h1>
      <input placeholder="Enter your name!" />
    </>
  );
};

ReactDom.render(<Page />, document.getElementById("root"));
