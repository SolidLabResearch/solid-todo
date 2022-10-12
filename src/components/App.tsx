import React from "react";
import { useEffect, useState } from "react";
import { UrlString } from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { useSession } from "@inrupt/solid-ui-react";
import Login from "./Login";
import TaskList from "./TaskList";
import { queryPodUrl } from "../logic/query";

const App = () => {
  const [file, setFile] = useState<string>("");
  const [podUrl, setPodUrl] = useState<URL>(
    new URL("https://example.org/podURL")
  );
  const [webId, setWebId] = useState<URL>(new URL("https://example.org/webID"));
  const { session } = useSession();

  useEffect(() => {
    console.log("before useEffectHook: " + session.info.isLoggedIn);
    if (!session.info.isLoggedIn) return;
    console.log("in useEffectHook");

    if (!session.info.webId) return;
    const webIdUrl: URL = new URL(session.info.webId);
    setWebId(webIdUrl);

    void (async () => {
      console.log("starting async");
      queryPodUrl(webIdUrl)
        .then((podUrl: URL) => {
          console.log("success: " + podUrl);
          setPodUrl(podUrl);
        })
        .catch((reason: any) => console.log(reason));

      /* const containerUri: any =
  *   (podUrl as string) + ("private/todosnew/" as string);
  * console.log("Login.tsx :: containerUri is " + containerUri);

  * const file: any =
  *   (containerUri.split("Data")[0] as string) + ("todos.ttl" as string);
  * // const file: any = (containerUri.split('Data')[0] as string)
  * console.log("Login.tsx :: file is " + file);
  * setFile(file);
   */
      /* setWebId(session.info.webId ?? oidcIssuer); */
      //return file; // QUESTION? Why return this? Doesn't useEffect only run cleanup _functions_?
    })();
  }, [session, session.info.isLoggedIn]); // only re-run the effect of session/loggedIn changes

  return session.info.isLoggedIn ? (
    <React.StrictMode>
      <TaskList webId={webId.href} file={file} session={session} />
    </React.StrictMode>
  ) : (
    <Login
      session={session}
      setWebId={setWebId}
      setFile={setFile}
    />
  );
};

export default App;
