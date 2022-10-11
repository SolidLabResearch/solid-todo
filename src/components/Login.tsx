import { useEffect, useState } from "react";
import {
  LoginButton,
  LogoutButton,
  Text,
  useSession,
  CombinedDataProvider,
} from "@inrupt/solid-ui-react";
import { QueryEngine } from "@comunica/query-sparql";
import { TheArr } from "../logic/model";
import TodoList from "./TodoList";
import InputField from "./InputField";
import WebIdLogin from "./WebIdLogin";
import IdentityProviderLogin from "./IdentityProviderLogin";

const authOptions = {
  clientName: "Solid Todo App",
};

const Login = (props): JSX.Element => {
	const { session } = useSession();
  const [oidcIssuer, setOidcIssuer] = useState("http://localhost:3000");

  const [file, setFile] = useState("");

  const [todos, setTodos] = useState<TheArr[]>([]);

  const [podUrl, setPodUrl] = useState("");
  useEffect(() => {
    if (!session.info.isLoggedIn) return;

    void (async () => {
      const myEngine = new QueryEngine();
      const bindingsStream = await myEngine.queryBindings(
        `SELECT ?o WHERE {
           ?s <http://www.w3.org/ns/pim/space#storage> ?o.
          }`,
        {
          sources: [`${session.info.webId as string}`],
        }
      );
      const bindings = await bindingsStream.toArray();

      const podUrl1 = bindings[0].get("o").value;
      setPodUrl(podUrl1);
      console.log(podUrl);
      // const location: any = 'public/todosnew/'
      const containerUri: any =
        (podUrl1 as string) + ("private/todosnew/" as string);
      console.log(containerUri);
      const file: any =
        (containerUri.split("Data")[0] as string) + ("todos.ttl" as string);
      // const file: any = (containerUri.split('Data')[0] as string)
      console.log(file);
      setFile(file);
      return file;
    })();
  }, [session, session.info.isLoggedIn]);

  const webID = session.info.webId ?? oidcIssuer;

    return (
      <div>
        <div className="grid grid-cols-3 gap-2">
          <p className="col-span-3">You are not logged in.</p>
			 <WebIdLogin oidcIssuer={oidcIssuer} setOidcIssuer={setOidcIssuer}/>
			 <IdentityProviderLogin oidcIssuer={oidcIssuer} setOidcIssuer={setOidcIssuer}/>
          <LoginButton
            oidcIssuer={oidcIssuer}
            redirectUrl={window.location.href}
            authOptions={authOptions}
          />
        </div>
      </div>
    );
  }

export default Login;
