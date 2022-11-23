import { session } from '../logic/session'

import Login from './Login'
import TodoList from './TodoList'

const App: React.FC = () => {
  if (session.info.isLoggedIn) {
    return (<TodoList webId={session.info.webId as string} />)
  } else {
    return (<Login />)
  }
}

export default App
