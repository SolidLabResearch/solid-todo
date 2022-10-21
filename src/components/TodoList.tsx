import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { Session } from '@inrupt/solid-client-authn-browser'

import { useEffect, useState } from 'react'
import { TheArr } from '../logic/model'
import SingleTodo from './SingleTodo'
import { QueryStringContext } from '@comunica/types'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'

const TodoList: React.FC<{
  todos: TheArr[]
  setTodos: React.Dispatch<React.SetStateAction<TheArr[]>>
  file: string
  session: Session
}> = ({ todos, setTodos, file, session }): any => {
  const readArray: any[] = []
  const readArray1: any[] = []
  let text1: any
  let text: any
  let text2: any
  let id: any
  let id1: any
  let id2: any
  let boo: string
  let dateCreated: string
  const [TheArray, setTheArray] = useState<TheArr[]>([])

  const display = async (): Promise<void> => {
    console.log('im in display')

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
    const bindings = await bindingsStream.toArray()

    // 2. Map bindings to a map of todos
    const podTodos = {}
    bindings.forEach((element) => {
      id = element.get('id').value
      id1 = id.split('/').pop()
      id2 = id1
      console.log(id2)
      text = element.get('todo').value
      text1 = text.split('/').pop()
      text2 = text1
      console.log(text1)
      boo = element.get('status').value
      //  boo1 = boo.split('/').pop()
      const boo2 = boo.toLowerCase() === 'true'
      console.log('The typeof boo is ', typeof (boo2))
      dateCreated = element.get('dateCreated').value
      // dateCreated1 = dateCreated.split('/').pop()
      console.log(boo)
      readArray.push(text2)
      readArray1.push(id2)
      const newTodo: TheArr = { id2, text2, boo2, dateCreated }
      podTodos[id2] = newTodo
      //  setTheArray(TheArray => TheArray.append(text2))
      //  console.log(TheArray1)
      //  setTheArray(readArray =>  [...readArray,text2])
    })
    // 3. update the current array with the pod todos.
    // I'm using a map to make sure I don't get duplicates
    setTheArray(TheArray => {
      let todoMap = {}
      TheArray.forEach(todo => {
        todoMap[todo.id2] = todo
      })
      todoMap = Object.assign(todoMap, podTodos)

      return Object.values(todoMap)
      // myEngine.invalidateHttpCache(id2, text2)

      //  setTheArray( [...TheArray, {text2, id2, boo2}])
    })
  }

  useEffect(() => {
    void display()
  }, [])

  const displaytodos = TheArray.map((entry) => {
    return (
      <div key={entry.id2}>
        <SingleTodo todo={entry} index={id1} todos={TheArray} setTodos={setTheArray} file={file} session={session}/>
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
