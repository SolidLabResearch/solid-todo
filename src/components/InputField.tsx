import { useRef, useState } from 'react'
// import { useSession } from '@inrupt/solid-ui-react'
import { fetch } from '@inrupt/solid-client-authn-browser';
// import { addDatetime, addStringNoLocale, addUrl, createThing, getSourceUrl, saveSolidDatasetAt, setThing } from '@inrupt/solid-client'

// interface IInputFieldProps {
//   todos: any
//   setTodos: any
// }

const InputField = ({ todos, setTodos, file }: any):JSX.Element => {
  // const { session } = useSession()
  const inputRef = useRef<HTMLInputElement>(null)

  const [todo, setTodo] = useState<string>('')

  // const TEXT_PREDICATE = 'http://schema.org/text'
  // const CREATED_PREDICATE = 'http://schema.org/dateCreated'
  // const TODO_VALUE = 'http://schema.org/TextDigitalDocument'
  // const TODO_PROPERTY = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'

  const addTodo = async (text: string):Promise<void> => {
    const query = `INSERT DATA {<TodoList> <TodoItem> <${text}>.}`

    const response = await fetch(file, {
      method: 'POST',
      headers: { 'Content-Type': 'application/sparql-update' },
      body: query
    })
    const low = 300
    const high = 600
    if (low < response.status && response.status < high) {
      console.log(` Error code is ${response.status} `)
    }

    // const indexUrl = getSourceUrl(todos)
    // const todoWithText = addStringNoLocale(createThing(), TEXT_PREDICATE, text)
    // console.log(createThing)
    // const todoWithDate = addDatetime(
    //   todoWithText,
    //   CREATED_PREDICATE,
    //   new Date()
    // )
    // const todoWithType = addUrl(todoWithDate, TODO_PROPERTY, TODO_VALUE)
    // const updatedTodoList = setThing(todos, todoWithType)

    // saveSolidDatasetAt(indexUrl, updatedTodoList, { fetch: session.fetch as any })
    //   .then((updatedDataset) => setTodos(updatedDataset))
    //   .catch((reason: any) => console.log(reason))
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    addTodo(todo)
    setTodo('')
  }

  return (
    <form className='my-4 flex flex-row w-full' id='input' onSubmit={(e) => {
      handleAdd(e)
      inputRef.current?.blur()
    }}>
      <input
        ref={inputRef}
        type="input"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder='Enter a to-do'
        className='rounded-full py-2 px-4 border-white flex-grow'
      />
      <button className='rounded-full py-2 px-3 ml-4 border transition-colors border-white hover:bg-foreground hover:text-white' type='submit'>GO</button>
    </form>
  )
}

export default InputField
