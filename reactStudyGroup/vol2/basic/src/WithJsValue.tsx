// JS の値を反映する
import React from "react";

const WithJsValue = () => {
  const jsValueStr = "hogehoge";
  const jsValueNum = 10000;
  return (
    <div className={jsValueStr}>
      <div>{jsValueStr}</div>
      <div>{jsValueStr.toUpperCase()}</div>
      <div>{jsValueNum}</div>
      <div>{jsValueNum / 10}</div>
    </div>
  );
};

const WithBool = () => {
  const jsValueBool = true;
  return <div>{jsValueBool}</div>;
};

const EscapeChild = () => {
  const htmlStr = "<strong>Strong text</strong>";
  return <div>{htmlStr}</div>;
};

const WithoutEscape = () => {
  const htmlStr = "<strong>Strong text</strong>";
  return <div dangerouslySetInnerHTML={{ __html: htmlStr }}></div>;
};

const WithComment = () => {
  return (
    <div>
      <p>text{/* this is comment */}</p>
    </div>
  );
};

const Conditional = () => {
  const showHello = true;
  return <div>{showHello ? "Hello!" : "..."}</div>;
};

const ConditionalAttr = () => {
  const isBig = true;
  return (
    <div className={isBig ? "big" : "small"}>
      <p>sample text...</p>
    </div>
  );
};

const TrueOnlyNull = () => {
  const isDisplay = true;
  return isDisplay ? <div>True only!</div> : null;
};

const TrueOnly = () => {
  const isDisplay = true;
  return isDisplay && <div>True only!</div>;
};

const BracketPair = () => {
  return (
    <div>
      {"hoge"}
      {"fuga"}
      {4000}
    </div>
  );
};

const UseFunc = () => {
  const createFunc = (text: string) => <div>{text}</div>;
  return <div>{createFunc("created by createFunc")}</div>;
};

const ArrayChildren = () => {
  const components = [
    <div>aaa</div>,
    <div>bbb</div>,
    <div>ccc</div>,
    <div>ddd</div>,
  ];
  return <div>{components}</div>;
};

const ArrayChildrenWithKey = () => {
  const components = [
    <div key={1}>aaa</div>,
    <div key={2}>bbb</div>,
    <div key={3}>ccc</div>,
    <div key={4}>ddd</div>,
  ];
  return <div>{components}</div>;
};

const UseMap = () => {
  const nameList = ["A", "B", "C", "D"];
  return (
    <ul>
      {nameList.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
};

const UseMapId = () => {
  const nameList = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "B" },
    { id: 4, name: "D" },
  ];
  return (
    <ul>
      {nameList.map((obj) => (
        <li key={obj.id}>{obj.name}</li>
      ))}
    </ul>
  );
};

const UseMapIndex = () => {
  // アンチパターン！
  const notUniqueList = ["A", "B", "B", "D"];
  return (
    <ul>
      {notUniqueList.map((name, index) => (
        <li key={index}>{name}</li>
      ))}
    </ul>
  );
};

const UseLambda = () => {
  // アンチパターン！（できるというだけの話）
  return (
    <div>
      {(() => {
        const message = "from Lambda";
        return <div>{message}</div>;
      })()}
    </div>
  );
};

export const WithJsValueParent: React.FC = () => {
  return (
    <>
      <WithJsValue />
      <WithBool />
      <EscapeChild />
      <WithoutEscape />
      <WithComment />
      <Conditional />
      <ConditionalAttr />
      <TrueOnlyNull />
      <TrueOnly />
      <BracketPair />
      <UseFunc />
      <ArrayChildren />
      <ArrayChildrenWithKey />
      <UseMapIndex />
      <UseMapId />
      <UseMap />
      <UseLambda />
    </>
  );
};
