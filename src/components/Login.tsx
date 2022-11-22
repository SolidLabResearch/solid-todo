import { useEffect, useState } from 'react'
import { type ITask } from '../logic/model'
import { session } from '../logic/session'
import { findName, findStorage, handleLogin, handleLogout, registerDefaultTaskList } from '../logic/utils'

import InputField from './InputField'
import TodoList from './TodoList'

const Login: React.FC = () => {
  const [webId, setWebId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [taskLocation, setTaskLocation] = useState<string>('')
  const [todos, setTodos] = useState<ITask[]>([])

  useEffect(() => {
    if (!session.info.isLoggedIn) return

    // Setting the location for storing all the todo items.
    const sessionWebId = session.info.webId as string

    void (async () => {
      const name = await findName(sessionWebId)
      setUserName(name)

      // By default, our base starts from the webId containing folder
      const storage = await findStorage(sessionWebId)
      const baseUrl = storage != null ? new URL(storage) : new URL('./', sessionWebId)
      const containerUri = baseUrl.href + 'private/todos/'
      const defaultTaskLocation = (containerUri.split('Data')[0]) + ('todos' as string)
      setTaskLocation(defaultTaskLocation)
      await registerDefaultTaskList(defaultTaskLocation)
    })()
  }, [session, session.info.isLoggedIn])

  const loginEventHandler = (): void => {
    handleLogin(webId).catch(() => alert('Login failed!'))
  }

  const logoutEventHandler = (): void => {
    handleLogout().catch(() => alert('Logout failed!'))
  }

  if (session.info.isLoggedIn) {
    return (
      <div>
        <div>
          <div className='flex flex-row'>
            <p className='mr-4'>You are logged in as: {userName} </p>
          </div>
          <input type="submit" value="Logout" className="input__submit" onClick={logoutEventHandler}></input>
        </div>
        <InputField todos={todos} setTodos={setTodos} file={taskLocation} />
        <TodoList todos={todos} setTodos={setTodos} file={taskLocation} />
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
            value={webId}
            onChange={(event) => setWebId(event.target.value)}
          />
          <input type="submit" value="Login" className="input__submit" onClick={loginEventHandler}></input>
        </div>
      </div>
    )
  }
}

export default Login
