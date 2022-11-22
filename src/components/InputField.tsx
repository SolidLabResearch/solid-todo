import { useRef, useState } from 'react'
import { TodoItem } from '../logic/model'
import { update } from '../logic/engine'

const InputField = ({ todos, setTodos, file, session }: any): any => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [todo, setTodo] = useState<string>('')

  // Inserts new todo item to the pod.
  const addTodo = async (todo: string): Promise<any> => {
    const id = Date.now()
    const createdDate: string = new Date(Date.now()) as unknown as string
    const status: string = 'false'
    const query = `
      PREFIX todo: <http://example.org/todolist/> 
      
      INSERT DATA{
      <#${id}> a todo:Task ;
        todo:title "${todo}" ;
        todo:status "${status}" ;
        todo:dateCreated "${createdDate}" ;
        todo:createdBy "${session.info.webId as string}" ;
        todo:isPartOf <#default> .
      }
    `

    update(query, { sources: [file], baseIRI: file }, session)
      .then(() => { confirm('New task  added to your pod!') })
      .catch((error) => { alert(`Inserting new task failed: ${String(error.message)}`) })

    const newTodo: TodoItem = { id, text: todo, status: status === 'true', dateCreated: createdDate, createdBy: session.info.webId }
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
