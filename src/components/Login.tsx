import { useEffect, useState } from 'react'
import { LoginButton, LogoutButton, Text, useSession, CombinedDataProvider } from '@inrupt/solid-ui-react'
// import { getSolidDataset, getUrlAll, getThing } from '@inrupt/solid-client'
// import { ITodo } from '../logic/model'
import { findOidcIssuer } from '../logic/query'
// import { getOrCreateTodoList, getTodoListViaQuery } from '../logic/utils'
import InputField from './InputField'
// import TodoList from './TodoList'
import { QueryEngine } from '@comunica/query-sparql'
// import Storage from './Storage'
import { TheArr } from '../logic/model'
import { fetch } from '@inrupt/solid-client-authn-browser'

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

  const [todos, setTodos] = useState<TheArr[]>([])

  const [podUrl, setPodUrl] = useState('')

  useEffect(() => {
    if (!session.info.isLoggedIn) return

    void (async () => {
      const myEngine = new QueryEngine()
      const bindingsStream = await myEngine.queryBindings(`SELECT ?o WHERE {
           ?s <http://www.w3.org/ns/pim/space#storage> ?o.
          }`, {
        sources: [`${webID}`]
      })
      const bindings = await bindingsStream.toArray()

      const podUrl1 = bindings[0].get('o').value; // TODO: this will throw an error when `bindings` is empty. Make sure we catch this, and report this as a nice error to the user.
      setPodUrl(podUrl1)
      console.log(podUrl)
      // const location: any = 'public/todosnew/'
      const containerUri: any = podUrl1 as string + ('private/todosnew/' as string) // TODO: this will fail if pim:storage refers to a value that does not end with a `/`. We can fix this by delegating this operation to a lib such as `relative-to-absolute-iri`.
      console.log(containerUri)
      const file: any = (containerUri.split('Data')[0] as string) + ('todos.ttl' as string) // TODO: Not sure I understand why this Data split is happening. In any case, let's use `relative-to-absolute-iri` here as well.
      console.log(file)
      setFile(file)
      // TODO: The logic below for checking if a file exists, and creating one if not, should not be necessary anymore once using comunica for inserting data.
      const response = await fetch(file, {
        method: 'GET',
        headers: { 'Content-Type': 'text/turtle' },
        credentials: 'include'
      })
      const low = 300
      const high = 600
      if (low < response.status && response.status < high) {
        console.log('No place to store todos. Hence it will be created')
        const query = ''

        await fetch(file, {
          method: 'PUT',
          headers: { 'Content-Type': 'text/turtle' },
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
      }
      return file
    })()
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
        .catch((reason: any) => console.log(reason)) // TODO: let's use nice error dialogs instead of console.log statements :-)
    } catch (error: any) {
      console.log(error) // TODO: also here.
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
          <div>
            <div className='flex flex-row'>
              <p className='mr-4'>You are logged in as:</p>
              <Text properties={[
                'http://www.w3.org/2006/vcard/ns#fn',
                'http://xmlns.com/foaf/0.1/name'
              ]} />
            </div>

            <LogoutButton
              onError={function noRefCheck() {}}
              onLogout={function noRefCheck() {}}
            />
          </div>

          <InputField todos={todos} setTodos={setTodos} file={file} />

        </CombinedDataProvider>
      </div>
    )
  } else {
    // TODO: does this "providers" do anything? I don't see it anywhere in the UI. Should it be a dropdown?
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
