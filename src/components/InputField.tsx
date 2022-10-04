import { useRef, useState } from 'react'
// import { useSession } from '@inrupt/solid-ui-react'
import { fetch } from '@inrupt/solid-client-authn-browser'
import { QueryEngine } from '@comunica/query-sparql'
import { useSession } from '@inrupt/solid-ui-react'
// import { OidcProviderError } from '../../node_modules/@inrupt/solid-client-authn-core/dist/errors/OidcProviderError'
import TodoList from './TodoList'
// import { Todo } from '../logic/model'
// import { render } from 'react-dom'
// import Storage from './Storage'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { addDatetime, addStringNoLocale, addUrl, createThing, getSourceUrl, saveSolidDatasetAt, setThing } from '@inrupt/solid-client'

// interface IInputFieldProps {
//   todos: any
//   setTodos: any
// }

const InputField = ({ todos, setTodos, file }: any): any => {
  // const { session } = useSession()
  const inputRef = useRef<HTMLInputElement>(null)
  const [todo, setTodo] = useState<string>('')
  const { session } = useSession()
  let name: string = ''
  const addTodo = async (todo: string): Promise<void> => {
    const myEngine = new QueryEngine()
    const bindingsStream = await myEngine.queryBindings(`SELECT ?o WHERE {
      ?s  <http://www.w3.org/ns/pim/space#storage> ?o .
    }`, {
      sources: [`${session.info.webId ?? ''}`]
    })
    const bindings = await bindingsStream.toArray()
    const name1: string = bindings[0].get('o').value
    name = (name1) + ('profile/card#me')
    console.log(name)

    const id = Date.now()
    const createdDate: string = new Date(Date.now()) as unknown as string
    const status: string = 'false'

    const query1 = `INSERT DATA {
    
    @prefix tod: <>.
    @prefix tur: <http://www.w3.org/ns/iana/media-types/text/turtle#>.
    @prefix sodo: <http://sodo-example.com/>.
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
    @prefix owl: <http://www.w3.org/2002/07/owl#> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix schema: <https://schema.org/> .
    @prefix ex: <http://www.example.com/> .

   
<#${id}>
    a sodo:Task;
    sodo:label "${todo}";
    sodo:status "${status}";
    sodo:dateCreated "${createdDate}";
    sodo:createdBy <${name}> .
    }`

    const low = 300
    const high = 600

    // const response1 = await fetch(file, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'text/turtle' },
    //   body: body
    // })

    const response = await fetch(file, {
      method: 'POST',
      headers: { 'Content-Type': 'application/sparql-update' },
      body: query1

    })

    if (low < response.status && response.status < high) {
      console.log(` Error code is ${response.status} `)
      // console.log(` Error code is ${response1.status} `)
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

    console.log(todos)
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    void addTodo(todo)
    setTodo('')
  }

  // useEffect(() => {
  //   <TodoList todos={todos} setTodos={setTodos} file={file} name={name}/>
  // },[todo])

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

    <TodoList todos={todos} setTodos={setTodos} file={file} name={name}/>
    </>

  )
}

export default InputField
