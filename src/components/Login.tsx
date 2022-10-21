import { useEffect, useState } from 'react'
import { LoginButton, LogoutButton, Text, useSession, CombinedDataProvider } from '@inrupt/solid-ui-react'
import { findOidcIssuer } from '../logic/query'
import InputField from './InputField'
import { QueryEngine } from '@comunica/query-sparql'
import { TheArr } from '../logic/model'
import TodoList from './TodoList'

const authOptions = {
  clientName: 'Solid Todo App'
}

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
        sources: [`${session.info.webId as string}`]
      })
      const bindings = await bindingsStream.toArray()

      // By default, our base starts from the webId containing folder
      // TODO make this better
      let podUrl1 = (new URL('./', (session.info.webId as string))).toString()
      try {
        podUrl1 = bindings[0].get('o').value
      } catch (e) {
        // apparently we can't do that
      }
      setPodUrl(podUrl1)
      console.log(podUrl)
      // const location: any = 'public/todosnew/'
      const containerUri: any = podUrl1 + ('private/todosnew/' as string)
      console.log(containerUri)
      const file: any = (containerUri.split('Data')[0] as string) + ('todos.ttl' as string)
      // const file: any = (containerUri.split('Data')[0] as string)
      console.log(file)
      setFile(file)
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
          <InputField todos={todos} setTodos={setTodos} file={file} session={session}/>
          <TodoList todos={todos} setTodos={setTodos} file={file} session={session} />

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
