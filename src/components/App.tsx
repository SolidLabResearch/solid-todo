import { Session } from '@inrupt/solid-client-authn-browser'
import Login from './Login'

interface IAppProps {
  ses?: Session
}

const App: React.FC<IAppProps> = (): JSX.Element => {
  return (
    <Login />
  )
}

export default App
