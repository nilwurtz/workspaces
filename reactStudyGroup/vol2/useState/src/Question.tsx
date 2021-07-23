import React, { useState } from "react";
import ReactDOM from "react-dom";

type ToDo = {
  id: number;
  text: string;
};

const ToDoApp: React.FC = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [inputState, setInputState] = useState<string>("");
  // todoへの追加、inputStateのリセット
  const addCallBack = () => {
    setTodos([...todos, { id: todos.length + 1, text: inputState }]);
    setInputState("");
  };

  return (
    <div>
      <h1>TODO</h1>
      <div>
        <input
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
        />
        <button onClick={addCallBack}>ADD</button>
      </div>
      <div>
        <ul>
          {todos.map((t) => (
            <li key={t.id}>{t.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ReactDOM.render(<ToDoApp />, document.getElementById("root"));

export const QuestionParent = () => {
  return (
    <>
      <ToDoApp />
    </>
  );
};
