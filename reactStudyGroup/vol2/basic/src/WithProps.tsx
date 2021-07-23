// propsを受け取るコンポーネントと
// 注入するコンポーネント

import React from "react";

type Props = {
  name: string;
};

const WithProps: React.FC<Props> = (props) => {
  return (
    <div>
      My name is ...<strong>{props.name}</strong>
    </div>
  );
};

const Parent: React.FC = () => {
  const myName = "Hayashi";
  return <WithProps name={myName} />;
};

export const WithPropsParent = () => {
  return (
    <>
      <Parent />
    </>
  );
};
