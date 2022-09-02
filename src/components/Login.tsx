import { useEffect, useState } from 'react'
import { LoginButton, LogoutButton, Text, useSession, CombinedDataProvider } from '@inrupt/solid-ui-react'
// import { getSolidDataset, getUrlAll, getThing } from '@inrupt/solid-client'
// import { ITodo } from '../logic/model'
import { findOidcIssuer } from '../logic/query'
// import { getOrCreateTodoList, getTodoListViaQuery } from '../logic/utils'
import InputField from './InputField'
import TodoList from './TodoList'
import { QueryEngine } from '@comunica/query-sparql'

const authOptions = {
  clientName: 'Solid Todo App'
}

// const STORAGE_PREDICATE = 'http://www.w3.org/ns/pim/space#storage'

const keywordToProviderMap: Map<string, string> = new Map<string, string>([
  ['solidcommunity', 'https://solidcommunity.net/'],
  ['inrupt', 'https://inrupt.net/']
])

const Login: React.FC = (): JSX.Element => {
  const { session } = useSession()
  const [oidcIssuer, setOidcIssuer] = useState('http://localhost:3000')

  const [file, setFile] = useState('')

  // const [todos, setTodos] = useState<ITodo[]>(new Array<ITodo>())
  const [todos, setTodos] = useState<any>()

  useEffect(() => {
    if (!session.info.isLoggedIn) return

    (async () :Promise<void> => {    
      const myEngine = new QueryEngine()
      const bindingsStream = await myEngine.queryBindings(`SELECT ?o WHERE {
         ?s <http://www.w3.org/ns/pim/space#storage> ?o.
        }`, {
        sources: [`${webID}`]
      });
      const bindings = await bindingsStream.toArray()
  
      const podUrl = bindings[0].get('o').value
      const containerUri = podUrl + 'public/todosnew/'
      console.log(containerUri)
      const file = containerUri.split('Data')[0] + 'todos.ttl'
      console.log(file)
      setFile(file)   
      const response = await fetch(file, {
        method: 'GET',
        headers: {'Content-Type': 'text/turtle'},
        credentials: 'include'
      })
  
      if ( 300 < response.status && response.status < 500) {
        console.log('No place to store todos. Hence it will be created');
        const query = ``
  
        await fetch(file, {
          method: 'PUT',
          headers: {'Content-Type': 'text/turtle'},
          body: query,
          credentials: 'include'
        })
     // Below is used when using inrupt libs   
    // getTodoListViaQuery(session)
    //   .then((todos: ITodo[]) => { console.log(todos) })
    //   .catch((reason: any) => console.log(reason))
    // void (async () => {
    //   const profileDataset = await getSolidDataset(session.info.webId as any, {
    //     fetch: session.fetch as any
    //   })
    //   const profileThing = getThing(profileDataset, session.info.webId as any)
    //   const podsUrls = getUrlAll(profileThing as any, STORAGE_PREDICATE)
    //   console.log(podsUrls)
    //   const pod = podsUrls[0]
    //   const containerUri = `${pod}todos/`
    //   const list = await getOrCreateTodoList(containerUri, session.fetch)
    //   setTodos(list)
    //   // console.log(list)
    // })()
  }})()
  }, [session, session.info.isLoggedIn])

  function validate(event: React.ChangeEvent<HTMLInputElement>): void {
    const webIdInputValue: string = event.target.value

    console.log(webIdInputValue)

    for (const [keyword, provider] of keywordToProviderMap) {
      if (webIdInputValue.includes(keyword)) {
        setOidcIssuer(provider)
        break
      }
    }

    try {
      // fetching the OIDC issuer using a SPARQL query
      const webIdURL: URL = new URL(webIdInputValue)
      findOidcIssuer(webIdURL)
        .then((issuer: URL) => setOidcIssuer(issuer.href))
        .catch((reason: any) => console.log(reason))
    } catch (error: any) {
      console.log(error)
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setOidcIssuer(event.target.value)
  }

  const webID = session.info.webId ?? oidcIssuer

  if (session.info.isLoggedIn) {
    return (
      <div>
        <CombinedDataProvider
          datasetUrl={webID}
          thingUrl={webID}
        >
          <div className='flex flex-row'>
            <p className='mr-4'>You are logged in as:</p>
            <Text properties={[
              'http://www.w3.org/2006/vcard/ns#fn',
              'http://xmlns.com/foaf/0.1/name'
            ]} />
            <LogoutButton
              onError={function noRefCheck() {}}
              onLogout={function noRefCheck() {}}
            />
          </div>
          <section>
            <InputField todos={todos} setTodos={setTodos} file={file} />
            <TodoList todos={todos} setTodos={setTodos} />
          </section>
        </CombinedDataProvider>
      </div>
    )
  } else {
    return (
      <div>
        <datalist id="providers">
          <option value="https://solidcommunity.net/" />
          <option value="https://inrupt.net/" />
        </datalist>

        <div className="grid grid-cols-3 gap-2">
          <p className='col-span-3'>You are not logged in.</p>
          <p className='col-span-3'>Log in with identity provider:</p>
          <input
            className="oidc-issuer-input col-span-2"
            type="text"
            name="oidcIssuer"
            list="providers"
            value={oidcIssuer}
            onChange={handleChange}
          />
          <LoginButton
            oidcIssuer={oidcIssuer}
            redirectUrl={window.location.href}
            authOptions={authOptions}
          />
          <p className='col-span-3'>Login with webID:</p>
          <input
            className="oidc-issuer-input col-span-2"
            type="text"
            name="oidcIssuer"
            placeholder="webID"
            defaultValue={oidcIssuer}
            onChange = {validate}
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
