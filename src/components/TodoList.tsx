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
      baseIRI: file,
      [ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name]: session
    }
    const bindingsStream = await myEngine.queryBindings(`
        SELECT ?id ?todo ?status ?dateCreated WHERE {
         ?id <http://sodo-example.com/label> ?todo .
         ?id <http://sodo-example.com/status> ?status .  
         ?id  <http://sodo-example.com/dateCreated> ?dateCreated .
        }`, context
    )
      .catch(() => { alert('Sorry! Couldnt fetch the data!') })
    const bindings = await bindingsStream.toArray()

    // 2. Map bindings to a map of todos
    const podTodos = {}
    bindings.forEach((element) => {
      const id = element.get('id').value
      const text = element.get('todo').value
      const statusFromPod = element.get('status').value
      const status = statusFromPod.toLowerCase() === 'true'
      const dateCreated = element.get('dateCreated').value
      const newTodo: TodoItem = { id, text, status, dateCreated }
      podTodos[id] = newTodo
      console.log(newTodo)
    })

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
