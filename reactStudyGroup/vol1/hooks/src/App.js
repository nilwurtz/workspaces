import React from "react"

const Child = (props) => {
  return <div>Parent Says... {props.text}</div>
}

const Parent = () => {
  const [message, setMessage] = React.useState("I like React")
  return (
    <div>
     <Child text={message} />
     <button onClick={() => setMessage("I love React")}>PUSH</button>
    </div>
  );
}

export default Parent;
