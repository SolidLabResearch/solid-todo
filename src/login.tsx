import { useEffect }  from "react";
import { LoginButton, LogoutButton, Text, useSession, CombinedDataProvider } from "@inrupt/solid-ui-react";
import { getSolidDataset, getUrlAll, getThing } from "@inrupt/solid-client";
import { useState } from "react";
import InputField from "./Components/InputField";
import TodoList from "./Components/TodoList";
import GetOrCreateTodoList from './utils';
//import { QueryEngine } from "@comunica/query-sparql";
//import { QueryEngine } from "@comunica/query-sparql/lib/QueryEngine";

//import { Bindings, BindingsStream, QueryStringContext } from "@comunica/types"

//const engine: QueryEngine = new QueryEngine()

const authOptions = {
    clientName: "Solid Todo App",
  };

const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage";

const solidExp: RegExp = /solidcommunity/
const inruptExp: RegExp = /inrupt/

function Login() {

const { session } = useSession();
const [oidcIssuer, setOidcIssuer] = useState("");
 
const [todos, setTodos] = useState();

useEffect(() => {
  if (!session || !session.info.isLoggedIn) return;
  (async () => {
    const profileDataset = await getSolidDataset(session.info.webId as any, {
      fetch: session.fetch as any,
    });
    const profileThing = getThing(profileDataset, session.info.webId as any);
    const podsUrls = getUrlAll(profileThing as any, STORAGE_PREDICATE);
    const pod = podsUrls[0];
    const containerUri = `${pod}todos/`;
    const list = await GetOrCreateTodoList(containerUri, session.fetch);
    setTodos(list as any);
  })();
}, [session, session.info.isLoggedIn]);

async function validate (event) {
  var xyz = event.target.value

  console.log(xyz)

  
//    const bindingsStream = await engine.queryBindings(`SELECT ?o WHERE {?s <http://www.w3.org/ns/solid/terms#oidcIssuer> ?o.}`, {sources: [`${xyz}`],});
//    const bindings = await bindingsStream.toArray();
//    return(bindings[0].get('object').value);
//   // console.log(bindings[0].o.value)
  
  
// }
  if( solidExp.test(xyz) ){
    setOidcIssuer("https://solidcommunity.net/");
  }

  if( inruptExp.test(xyz) ){
    setOidcIssuer("https://inrupt.net/")
  }
}

  const handleChange = (event: any) => {
    setOidcIssuer(event.target.value);
  };

  var webID = session.info.webId as any

  return (
    <div className="heading">
      {session.info.isLoggedIn ? (
        <CombinedDataProvider
          datasetUrl={webID} 
          thingUrl={webID}
        >
          <div className="message logged-in">
            <span>You are logged in as: </span>
            <Text properties={[
                "http://www.w3.org/2006/vcard/ns#fn",
                "http://xmlns.com/foaf/0.1/name",
              ]} />
              <LogoutButton 
                onError={function noRefCheck(){}}
                onLogout={function noRefCheck(){}}              
              />
          </div>  
          <section>
          <InputField todos={todos} setTodos={setTodos}  />
          <TodoList todos={todos} setTodos={setTodos} />
          </section>
        </CombinedDataProvider>
      ) : (
        <div className="message">
          <span>You are not logged in. </span>
        <br></br>
	      <span>
            Log in with:
            <input
              className="oidc-issuer-input "
              type="text"
              name="oidcIssuer"
              list="providers"
              value={oidcIssuer}
              onChange={handleChange}
            />
          <datalist id="providers">
            <option value="https://solidcommunity.net/" />
            <option value="https://inrupt.net/" />
          </datalist>
          </span>
		  <LoginButton
		     oidcIssuer={oidcIssuer}
		     redirectUrl={window.location.href}
		     authOptions={authOptions}
		   />

        <br></br>
<span>
        Login with webID:
        <input 
        className="oidc-issuer-input "
          type="text"
          name="oidcIssuer"
          placeholder="webID"
          defaultValue={oidcIssuer}
          onChange = {validate}
        />
        </span>

        <LoginButton
		     oidcIssuer={oidcIssuer}
		     redirectUrl={window.location.href}
		     authOptions={authOptions}
		   />
      </div>
      )}
    </div>
  );
}

export default Login;