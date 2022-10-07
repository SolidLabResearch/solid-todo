import { QueryEngine } from '@comunica/query-sparql' // TODO: should be '@comunica/query-sparql-link-traversal-solid'?
import { fetch } from '@inrupt/solid-client-authn-browser'
import { useEffect, useState } from 'react'
import { TheArr } from '../logic/model'
import SingleTodo from './SingleTodo'

const TodoList: React.FC<{
  todos: TheArr[]
  setTodos: React.Dispatch<React.SetStateAction<TheArr[]>>
  file: string
  name: string
}> = ({ todos, setTodos, file, name }): any => {
  const readArray: any[] = []
  const readArray1: any[] = []
  const readArray2: any[] = []
  let text1: any
  let text: any
  let text2: any
  let id: any
  let id1: any
  let id2: any
  let boo: string
  let dateCreated: string
  const [TheArray, setTheArray] = useState<TheArr[]>([])
  async function myfetchFunction(file): Promise<any> {
    return await fetch(file, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/sparql-update',
        'Cache-Control': 'no-cache'
      }
    })
  }

  const display = async (): Promise<void> => {
    console.log('im in display')
    const myEngine = new QueryEngine()

    const bindingsStream = await myEngine.queryBindings(`
        SELECT ?id ?todo ?status ?dateCreated WHERE {
         ?id <http://sodo-example.com/label> ?todo .
         ?id <http://sodo-example.com/status> ?status .  
         ?id  <http://sodo-example.com/dateCreated> ?dateCreated .
        }`, {
      sources: [`${file}`],
      fetch: myfetchFunction // TODO: why are you overriding this? I guess we should just pass the Solid session instead? (ask Jonni on how to do this)

    })

    // await myEngine.invalidateHttpCache()

    const bindings = await bindingsStream.toArray()
    bindings.forEach((element) => {
      // TODO: It looks like you're doing a lot of URL manipulation here, which is not considered good practise. Can we do it in another way?
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
      readArray2.push({ id2, text2, boo2, dateCreated })
      console.log(readArray2)
      // setTheArray1([readArray, readArray1, readArray2])
      // setTheArray([...TheArray,{text2:readArray, id2:readArray1, boo2:readArray2}])
      //  setTheArray(TheArray => TheArray.append(text2))
      //  console.log(TheArray1)
      //  setTheArray(readArray =>  [...readArray,text2])
      setTheArray([...TheArray, ...readArray2])
      // myEngine.invalidateHttpCache(id2, text2)

      //  setTheArray( [...TheArray, {text2, id2, boo2}])
    })
  }

  useEffect(() => {
    console.log('Im in useEffect')
    void display()
  }, [])

  const displaytodos = TheArray.map((entry) => {
    return (
      <div key={entry.id2}>
        {/* <span className="todos__single--text"> {entry.text2}: {entry.id2}: {entry.boo2}</span> */}
        <SingleTodo todo={entry} index={id1} todos={TheArray} setTodos={setTheArray} file={file} name={name}/>
      </div>

    )
  })

  return (
    <>

      {/* <button
  className="color bg p-2 rounded-md w-72"
  type="button"
  onClick={displaytodos()}
>
  Show
</button> */}
      {/* {todos1} */}
      {displaytodos}
      {/* <TodoList todos={todos} setTodos={setTodos} file={file} /> */}
      {/* <ul>{displaytodos1}</ul> */}

      {/* <SingleTodo todo={todos} todos={todos} setTodos={setTodos}/> */}
    </>

  )
}

export default TodoList
