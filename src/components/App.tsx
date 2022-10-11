import { UrlString } from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import {
  LoginButton,
  LogoutButton,
  Text,
  useSession,
  CombinedDataProvider,
} from "@inrupt/solid-ui-react";
import { useState } from "react";
import Login from "./Login";
import TaskList from "./TaskList";

interface IAppProps {
  weburl?: UrlString;
  ses?: Session;
}

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [file, setFile] = useState("");
  const [podUrl, setPodUrl] = useState("");
  const [webId, setWebId] = useState("");
  const { session } = useSession();

  return loggedIn ? (
    <TaskList webId={webId} file={file} session={session} />
  ) : (
    <Login session={session} setWebId={setWebId} setFile={setFile} setPodUrl={setPodUrl} />
  );
};

export default App;
