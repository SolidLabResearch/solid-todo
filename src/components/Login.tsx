import { useState } from 'react'
import { handleLogin } from '../logic/utils'

const Login: React.FC = () => {
  const [webId, setWebId] = useState<string>('')

  const loginEventHandler = (event: React.MouseEvent): void => {
    event.preventDefault()
    handleLogin(webId).catch(() => alert('Login failed!'))
  }

  return (
    <form className="grid grid-cols-3 gap-2 mb-auto">
      <p className='col-span-3'>You are not logged in. Login with webID:</p>
      <input
        className="col-span-2 todo-input-text"
        type="text"
        placeholder="webID"
        value={webId}
        onChange={(event) => setWebId(event.target.value)}
      />
      <input type="submit" className="todo-input-button" value="Login" onClick={loginEventHandler}></input>
    </form>
  )
}

export default Login
