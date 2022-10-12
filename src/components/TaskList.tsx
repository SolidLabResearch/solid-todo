import { useEffect, useState } from "react";
import { TheArr } from "../logic/model";
import {
  LoginButton,
  LogoutButton,
  Text,
  useSession,
  CombinedDataProvider,
} from "@inrupt/solid-ui-react";
import TodoList from "./TodoList";
import InputField from "./InputField";

const TaskList = (props) => {
  const [todos, setTodos] = useState<TheArr[]>([]);

  return (
    <div>
      <h1>TaskList</h1>
      <div>
        <div className="flex flex-row">
          <p className="mr-4">You are logged in as:</p>
          <Text
            properties={[
              "http://www.w3.org/2006/vcard/ns#fn",
              "http://xmlns.com/foaf/0.1/name",
            ]}
          />
        </div>

        <LogoutButton
          onError={function noRefCheck() {}}
          onLogout={function noRefCheck() {}}
        />
      </div>
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
