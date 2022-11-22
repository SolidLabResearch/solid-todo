import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { Session } from '@inrupt/solid-client-authn-browser'
import { useEffect } from 'react'
import { TodoItem } from '../logic/model'
import SingleTodo from './SingleTodo'
import { QueryStringContext } from '@comunica/types'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'

const TodoList: React.FC<{
  todos: TodoItem[]
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>
  file: string
  session: Session
}> = ({ todos, setTodos, file, session }): any => {
  const display = async (): Promise<void> => {
    // 1. query my pod for my existing todos
    const myEngine = new QueryEngine()
    const context: QueryStringContext = {
      sources: [file],
      lenient: true,
      [ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name]: session
    }
    const query = `
      PREFIX todo: <http://example.org/todolist/>
      SELECT * WHERE {
        ?id a todo:Task ;
          todo:title ?todo ;
          todo:status ?status ;
          todo:dateCreated ?dateCreated ;
          todo:createdBy ?createdBy .
      }`

    const bindingsStream = await myEngine.queryBindings(query, context)
    const bindings = await bindingsStream.toArray()

    // 2. Map bindings to a map of todos
    const podTodos: Record<string, object> = {}

    for (const binding of bindings) {
      const id = binding.get('id')?.value as string
      const text = binding.get('todo')?.value as string
      const statusFromPod = binding.get('status')?.value
      const status = statusFromPod?.toLowerCase() === 'true'
      const dateCreated = binding.get('dateCreated')?.value as string
      const createdBy = binding.get('createdBy')?.value as string
      const newTodo = { id, text, status, dateCreated, createdBy }
      podTodos[id] = newTodo
    }

    // 3. update the current array with the pod todos.
    // I'm using a map to make sure I don't get duplicates
    let todoMap = {}
    todos.forEach(todo => {
      todoMap[todo.id] = todo
    })
    todoMap = Object.assign(todoMap, podTodos)
    setTodos(Object.values(todoMap))
  }

  useEffect(() => {
    void display()
  }, [])

  const displaytodos = todos.map((entry) => {
    return (
      <div key={entry.id}>
        <SingleTodo todo={entry} todos={todos} setTodos={setTodos} file={file} session={session}/>
      </div>

    )
  })

  return (
    <>
      {displaytodos}
    </>

  )
}

export default TodoList
