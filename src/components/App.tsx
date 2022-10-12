import React from "react";
import { useEffect, useState } from "react";
import { useSession, CombinedDataProvider } from "@inrupt/solid-ui-react";
import Login from "./Login";
import TaskList from "./TaskList";
import Header from "./Header";
import { queryPodUrl } from "../logic/query";

/**
 *  Login logs into a session
	The session allows us to get the storage locations on the pod.
	We need those to display the todo file(s) in the TaskList
 */

const App = () => {
  const [file, setFile] = useState<string>("");
  const [webId, setWebId] = useState<URL>(
    new URL("https://example.org/webID/")
  );
  const { session } = useSession();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

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

          const containerUri: string = podUrl.href + "private/todosnew/";
          console.log("containerUri is " + containerUri);

          const file: any =
            (containerUri.split("Data")[0] as string) + ("todos.ttl" as string);
          console.log("file is " + file);
          setFile(file);
          setLoggedIn(true);
        })
        .catch((reason: any) => console.log(reason));
      //return file; // QUESTION? Why return this? Doesn't useEffect only run cleanup _functions_?
    })();
  }, [session, session.info.isLoggedIn]); // only re-run the effect of session/loggedIn changes

  return loggedIn ? (
    <React.StrictMode>
		  {/* For some reason CombinedDataProvider _needs_ to be in this class and cant be put into TaskList.. Probably because of the Session and Async fetch? */}
      <CombinedDataProvider datasetUrl={webId.href} thingUrl={webId.href}>
		  <Header/>
        <TaskList file={file} session={session} />
      </CombinedDataProvider>
    </React.StrictMode>
  ) : (
    <Login session={session} setWebId={setWebId} setFile={setFile} />
  );
};

export default App;
