import React, { ButtonHTMLAttributes } from "react";

const NoProps: React.FC = () => {
  return <div></div>;
};

const WithChildren: React.FC = (props) => {
  return <div>{props.children}</div>;
};

type Props = {
  text: string;
};

const WithProps: React.FC<Props> = (props) => {
  return <div>{props.text}</div>;
};

const WithPropsParent: React.FC = () => {
  return (
    <div>
      <WithProps text="text from parent" />
    </div>
  );
};

type PropsWithDefault = {
  text?: string;
  headline: string;
};

const WithDefaultProps: React.FC<PropsWithDefault> = ({
  text = "default text",
  headline,
}) => {
  return (
    <div>
      <h1>{headline}</h1>
      <p>{text}</p>
    </div>
  );
};

const WithDefaultPropsAlter: React.FC<PropsWithDefault> = (props) => {
  return (
    <div>
      <h1>{props.headline}</h1>
      <p>{props.text ? props.text : "default text"}</p>
    </div>
  );
};

type OverrideProps = ButtonHTMLAttributes<HTMLButtonElement>;

const OverrideButton: React.FC<OverrideProps> = (props) => {
  const style: React.CSSProperties = { borderRadius: "2px" };
  return (
    <button style={style} {...props}>
      {props.children}
    </button>
  );
};

type TypeRequiredProps = {
  type: "submit" | "reset" | "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

const TypeRequiredButton: React.FC<TypeRequiredProps> = (props) => {
  return (
    <button {...props} type={props.type}>
      {props.children}
    </button>
  );
};

export const TypesParent = () => {
  return (
    <>
      <NoProps />
      <WithChildren />
      <WithProps text={"text"} />
      <WithPropsParent />
      <WithDefaultProps headline="Headline text" />
      <WithDefaultPropsAlter headline="Headline text" />
      <OverrideButton type={"button"} />
      <TypeRequiredButton type={"button"} />
    </>
  );
};
