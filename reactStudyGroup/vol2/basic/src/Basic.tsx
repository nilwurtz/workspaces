import React from "react";

const Normal = () => {
  return <div>This is Normal Component</div>;
};

const WithClass = () => {
  return <div className="sample">Sample</div>;
};

const NoChildren = () => {
  return <div />;
};

export const BasicParent: React.FC = () => {
  return (
    <>
      <Normal />
      <WithClass />
      <NoChildren />
    </>
  );
};
