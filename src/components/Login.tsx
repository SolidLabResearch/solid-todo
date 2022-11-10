import { useEffect, useState } from 'react'
import { LoginButton, LogoutButton, useSession, CombinedDataProvider } from '@inrupt/solid-ui-react'
import InputField from './InputField'
import { QueryEngine } from '@comunica/query-sparql'
import { TodoItem } from '../logic/model'
import TodoList from './TodoList'

const authOptions = {
  clientName: 'Solid Todo App'
}

const Login: React.FC = (): JSX.Element => {
  const { session } = useSession()
  const [oidcIssuer, setOidcIssuer] = useState('')
  const [userName, setUserName] = useState('')
  const [file, setFile] = useState('')
  const [todos, setTodos] = useState<TodoItem[]>([])

  useEffect(() => {
    if (!session.info.isLoggedIn) return

    // Setting the location for storing all the todo items.
    void (async () => {
      const myEngine = new QueryEngine()
      const bindingsStream = await myEngine.queryBindings(`SELECT ?o WHERE {
           ?s <http://www.w3.org/ns/pim/space#storage> ?o.
          }`, {
        sources: [`${session.info.webId as string}`]
      })
      const bindings = await bindingsStream.toArray()

      // By default, our base starts from the webId containing folder
      // TODO make this better
      let baseUrl = (new URL('./', (session.info.webId as string))).toString()
      try {
        baseUrl = bindings[0].get('o').value
      } catch (e) {
      // apparently we can't do that
      }
      const containerUri: any = baseUrl + ('private/todos/' as string)
      const file: any = (containerUri.split('Data')[0] as string) + ('todos.ttl' as string)
      setFile(file)
      // setFile('http://localhost:3000/private/todos/todos.ttl')
      return file
    })()
  }, [session, session.info.isLoggedIn])

  // To get the oidcIssuer for the user webId input
  async function validate(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const webIdInputValue: string = event.target.value
    const engineForOidc = new QueryEngine()

    const bindingsStream = await engineForOidc.queryBindings(
      `PREFIX solid: <http://www.w3.org/ns/solid/terms#>

      SELECT ?o WHERE {
        ?s <http://www.w3.org/ns/solid/terms#oidcIssuer> ?o .
      }`, { sources: [`${webIdInputValue}`] }
    ).catch((reason: any) => console.log(reason))

    const bindings = await bindingsStream.toArray()
    bindings[0]?.get('o').value as unknown as boolean ? setOidcIssuer(bindings[0].get('o').value) : alert('This webId is not found in Open ID Connect discovery!!')
  }

  // To get the name in the webId profile of the user
  async function getName(webID): Promise<any> {
    const engineForOidc = new QueryEngine()

    const getUserName = await engineForOidc.queryBindings(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>

      SELECT ?s ?o WHERE {
        ?s rdf:type foaf:Person .
        ?s (foaf:givenName|foaf:name) ?o .
      }`, { sources: [`${webID as string}`] }
    )
    const bindingsForName = await getUserName.toArray()
    // if(bindingsForName[0] ?? '')setUserName(bindingsForName[0].get('o').value)
    // else setUserName('No name found!!!')
    bindingsForName[0]?.get('o').value as unknown as boolean ? setUserName(bindingsForName[0].get('o').value) : setUserName('No name found!!!')
    return userName
  }
  const webID = session.info.webId ?? oidcIssuer
  if (session.info.isLoggedIn) {
    void getName(webID)
    return (
      <div>
        <CombinedDataProvider
          datasetUrl={webID}
          thingUrl={webID}
        >
          <div>
            <div className='flex flex-row'>
              <p className='mr-4'>You are logged in as: {userName} </p>
            </div>

            <LogoutButton
              onError={function noRefCheck() {}}
              onLogout={function noRefCheck() {}}
            />
          </div>
          <InputField todos={todos} setTodos={setTodos} file={file} session={session}/>
          <TodoList todos={todos} setTodos={setTodos} file={file} session={session} />

        </CombinedDataProvider>
      </div>
    )
  } else {
    return (
      <div>
        <div className="grid grid-cols-3 gap-2">
          <p className='col-span-3'>You are not logged in.</p>
          <p className='col-span-3'>Login with webID:</p>
          <input
            className="oidc-issuer-input col-span-2"
            type="text"
            name="oidcIssuer"
            placeholder="webID"
            defaultValue={oidcIssuer}
            onChange ={(event) => validate(event) as unknown}
          />
          <LoginButton
            oidcIssuer={oidcIssuer}
            redirectUrl={window.location.href}
            authOptions={authOptions}
          />
        </div>
      </div>
    )
  }
}

export default Login
