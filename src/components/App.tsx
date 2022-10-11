import { UrlString } from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { useState } from "react";
import Login from "./Login";
import TaskList from "./TaskList";

interface IAppProps {
  weburl?: UrlString;
  ses?: Session;
}

const App : React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <TaskList /> : <Login />;
};

export default App;
