import { useEffect, useState } from 'react'
import { LoginButton, LogoutButton, useSession, CombinedDataProvider } from '@inrupt/solid-ui-react'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import InputField from './InputField'
import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { QueryStringContext } from '@comunica/types'
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
    const webIdString = session.info.webId as string

    void (async () => {
      const myEngine = new QueryEngine()
      const bindingsStream = await myEngine.queryBindings(`SELECT ?storage WHERE {
           <${webIdString}> <http://www.w3.org/ns/pim/space#storage> ?storage .
          }`, {
        sources: [webIdString]
      })

      // By default, our base starts from the webId containing folder
      const bindings = await bindingsStream.toArray()
      const storage = bindings.at(0)?.get('storage')?.value
      const baseUrl = storage != null ? new URL(storage) : new URL('./', (session.info.webId as string))
      const containerUri = baseUrl.href + 'private/todos/'
      const file = (containerUri.split('Data')[0]) + ('todos' as string)
      setFile(file)

      try {
        const query = `
          PREFIX sodo: <http://example.org/todolist/>

          INSERT DATA {
            <#default> a sodo:TaskList ;
              sodo:title "DefaultTaskList" .
          }
        `

        const context: QueryStringContext = {
          sources: [file],
          baseIRI: file,
          [ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name]: session
        }

        await myEngine.queryVoid(query, context)
      } catch (error) {
        console.log(error) // TODO: add proper message in case relevant
      }

      return file
    })()
  }, [session, session.info.isLoggedIn])

  // To get the oidcIssuer for the user webId input
  async function validate(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const webId: string = event.target.value
    const engineForOidc = new QueryEngine()

    const bindingsStream = await engineForOidc.queryBindings(
      `PREFIX solid: <http://www.w3.org/ns/solid/terms#>

      SELECT ?oidcIssuer WHERE {
        <${webId}> <http://www.w3.org/ns/solid/terms#oidcIssuer> ?oidcIssuer .
      }`, { sources: [webId] }
    )

    const bindings = await bindingsStream.toArray()
    const oidcIssuer = bindings.at(0)?.get('oidcIssuer')?.value

    if (oidcIssuer != null) {
      setOidcIssuer(oidcIssuer)
    }
  }

  // To get the name in the webId profile of the user
  async function getName(webId: string): Promise<string> {
    const engineForOidc = new QueryEngine()

    const getUserName = await engineForOidc.queryBindings(`
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>

      SELECT ?name WHERE {
        <${webId}> a foaf:Person ;
          (foaf:givenName|foaf:name) ?name .
      }`, { sources: [webId] }
    )
    const bindingsForName = await getUserName.toArray()
    const name = bindingsForName.at(0)?.get('name')?.value
    return name ?? webID
  }

  const webID = session.info.webId ?? oidcIssuer

  if (session.info.isLoggedIn) {
    getName(webID).then((name) => setUserName(name)).catch(console.log)
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
