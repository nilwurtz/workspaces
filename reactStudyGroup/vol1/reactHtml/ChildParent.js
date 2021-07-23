import React from "react"

const Child = (props) => {
  // props = {text: "Hello!!"}
  return (
    <div>Parent says... {props.text}</div>
  )
}

const Parent = () => {
  return (
    <div>
      <Child text={"Hello!!"}/>
    </div>
  )
}



export default Parent