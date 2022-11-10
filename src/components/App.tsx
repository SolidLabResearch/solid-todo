import { UrlString } from '@inrupt/solid-client'
import { Session } from '@inrupt/solid-client-authn-browser'
import Login from './Login'

interface IAppProps {
  weburl?: UrlString
  ses?: Session
}

const App: React.FC<IAppProps> = (): JSX.Element => {
  return (
    <Login />
  )
}

export default App
