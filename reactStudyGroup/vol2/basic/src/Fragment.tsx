// Fragment

import React from "react";

// const InvalidJSX = () => {
//   return (
//     <div>AAA</div>
//     <div>BBB</div>
//   )
// }

const ValidJSX = () => {
  return (
    <div>
      <div>AAA</div>
      <div>BBB</div>
    </div>
  );
};

const UseFragment = () => {
  return (
    <React.Fragment>
      <div>AAA</div>
      <div>BBB</div>
    </React.Fragment>
  );
};

const UseFragmentShortened = () => {
  return (
    <>
      <div>AAA</div>
      <div>BBB</div>
    </>
  );
};

export const ValidParent: React.FC = () => {
  return (
    <>
      <UseFragment />
      <ValidJSX />
      <UseFragmentShortened />
    </>
  );
};
