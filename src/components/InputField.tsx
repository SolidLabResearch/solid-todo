import { useRef, useState } from 'react'
import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { QueryStringContext } from '@comunica/types'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import { TodoItem } from '../logic/model'

const InputField = ({ todos, setTodos, file, session }: any): any => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [todo, setTodo] = useState<string>('')

  // Inserts new todo item to the pod.
  const addTodo = async (todo: string): Promise<any> => {
    const myEngine = new QueryEngine()
    const context: QueryStringContext = {
      sources: [file],
      lenient: true,
      baseIRI: file,
      [ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name]: session
    }
    const id = Date.now()
    const createdDate: string = new Date(Date.now()) as unknown as string
    const status: string = 'false'

    await myEngine.queryVoid(`
      PREFIX sodo: <http://example.org/todolist/> 
      
      INSERT DATA{
      <#${id}> a sodo:Task;
      sodo:title "${todo}";
      sodo:status "${status}";
      sodo:dateCreated "${createdDate}";
      sodo:createdBy "${session.info.webId as string}";
      sodo:isPartOf <#${id}> .
      }`, context)
      .then(() => { confirm('New task  added to your pod!') })
      .catch((error) => { alert(`Inserting new task failed: ${String(error.message)}`) })
    const newTodo: TodoItem = { id, text: todo, status: status === 'true', dateCreated: createdDate, createdBy: session.info.webId, taskList: 'Default Task' }
    setTodos([...todos, newTodo])

    window.location.reload()
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    void addTodo(todo)
    setTodo('')
  }

  return (
    <><form className='my-4 flex flex-row w-full' id='input' onSubmit={(e) => {
      handleAdd(e)
      inputRef.current?.blur()
    } }>
      <input
        ref={inputRef}
        type="input"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder='Enter a to-do'
        className='rounded-full py-2 px-4 border-white flex-grow' />
      <button className='rounded-full py-2 px-3 ml-4 border transition-colors border-white hover:bg-foreground hover:text-white' type='submit'>GO</button>
    </form>
    </>

  )
}

export default InputField
