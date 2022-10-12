import { useState } from "react";
import { TheArr } from "../logic/model";
import TodoList from "./TodoList";
import InputField from "./InputField";

const TaskList = (props) => {
  const [todos, setTodos] = useState<TheArr[]>([]);

  return (
    <div>
      <InputField
        todos={todos}
        setTodos={setTodos}
        file={props.file}
        session={props.session}
      />
      <TodoList
        todos={todos}
        setTodos={setTodos}
        file={props.file}
        session={props.session}
      />
    </div>
  );
};
export default TaskList;
