import { useEffect, useState } from "react";
import {
  LoginButton,
  LogoutButton,
  Text,
  useSession,
  CombinedDataProvider,
} from "@inrupt/solid-ui-react";
import { QueryEngine } from "@comunica/query-sparql";
import WebIdLogin from "./WebIdLogin";
import IdentityProviderLogin from "./IdentityProviderLogin";

const authOptions = {
  clientName: "Solid Todo App",
};

const Login = (props): JSX.Element => {
  const { session } = useSession();
  const [oidcIssuer, setOidcIssuer] = useState("https://solidcommunity.net"); // TODO: change for release again
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

      const podUrl = bindings[0].get("o").value;
		console.log('Login.tsx :: podUrl is ' + podUrl);
      props.setPodUrl(podUrl);

      const containerUri: any =
        (podUrl as string) + ("private/todosnew/" as string);
      console.log('Login.tsx :: containerUri is ' + containerUri);

      const file: any =
        (containerUri.split("Data")[0] as string) + ("todos.ttl" as string);
		// const file: any = (containerUri.split('Data')[0] as string)
		console.log('Login.tsx :: file is ' + file);
		props.setFile(file);

      //return file; // QUESTION? Why return this?
    })();
  }, [session, session.info.isLoggedIn]);

  const webID = session.info.webId ?? oidcIssuer;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <p className="col-span-3">You are not logged in.</p>
        <WebIdLogin oidcIssuer={oidcIssuer} setOidcIssuer={setOidcIssuer} />
        <IdentityProviderLogin
          oidcIssuer={oidcIssuer}
          setOidcIssuer={setOidcIssuer}
        />
        <LoginButton
          oidcIssuer={oidcIssuer}
          redirectUrl={window.location.href}
          authOptions={authOptions}
        />
      </div>
    </div>
  );
};

export default Login;
