import React from "react";

const JSXSample = () => {
  return (
    <div className="sample">
      <h1>Page Title</h1>
      <p>description...</p>
    </div>
  );
};

const Compiled = () => {
  return React.createElement("div", { className: "sample" }, [
    React.createElement("h1", null, "Page Title"),
    React.createElement("p", null, "description..."),
  ]);
};

export const JSXtoJSParent: React.FC = () => {
  return (
    <>
      <JSXSample />
      <Compiled />
    </>
  );
};
