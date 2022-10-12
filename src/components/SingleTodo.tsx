import React, { useEffect, useState, useRef } from 'react'
import { type Task } from '../logic/model'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import './style.css'
import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { QueryStringContext } from '@comunica/types'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'

const SingleTodo: React.FC<{
  index: number
  todo: Task
  todos: Task[]
  setTodos: React.Dispatch<React.SetStateAction<Task[]>>
  file: string
  session: any
}> = ({ index, todo, todos, setTodos, file, session }): any => {
  const [edit, setEdit] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [edit])
  const myEngine = new QueryEngine()
  const context: QueryStringContext = {
    sources: [file],
    lenient: true,
    baseIRI: file
  }
  context[ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name] = session

  const deleteTodo = async (id2): Promise<any> => {
    console.log(id2)

    setTodos(todos.filter((todo) => todo.id2 !== id2))

    if (todo.id2 === id2) console.log(todo.text2, todo.id2, todo.boo2)

    console.log('Deleting todos')
    const queryBoo: string = todo.boo2 as unknown as string
    await myEngine.queryVoid(`
    PREFIX tod: <>
      PREFIX tur: <http://www.w3.org/ns/iana/media-types/text/turtle#>
      PREFIX sodo: <http://sodo-example.com/>
      PREFIX ex: <http://www.example.com/> 

      DELETE DATA {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}"; <http://sodo-example.com/status> "${queryBoo}"; <http://sodo-example.com/dateCreated> "${todo.dateCreated}".}`, context)
  }

  const editTheTodo = async (e: React.FormEvent, id2: number): Promise<any> => {
    e.preventDefault()
    setTodos(
      todos.map((todo) => (todo.id2 === id2 ? { ...todo, todo: editTodo } : todo))
    )
    console.log(editTodo)
    const createdDate: string = new Date(Date.now()) as unknown as string
    setEdit(false)
    await myEngine.queryVoid(`
    PREFIX tod: <>
      PREFIX tur: <http://www.w3.org/ns/iana/media-types/text/turtle#>
      PREFIX sodo: <http://sodo-example.com/>
      PREFIX ex: <http://www.example.com/> 
      DELETE {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}".}
      INSERT {<${todo.id2}> <http://sodo-example.com/label> "${editTodo}"; <http://sodo-example.com/dateModified> "${createdDate}".}
      WHERE  {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}".}`, context)
  }

  const doneTodo = async (id2): Promise<void> => {
    setTodos(
      todos.map((todo) =>
        todo.id2 === id2 ? { ...todo, boo2: !todo.boo2 } : todo
      )
    )
    const queryBoo: string = todo.boo2 as unknown as string
    const queryBooNew: string = !todo.boo2 as unknown as string
    await myEngine.queryVoid(`
    PREFIX tod: <>
      PREFIX tur: <http://www.w3.org/ns/iana/media-types/text/turtle#>
      PREFIX sodo: <http://sodo-example.com/>
      PREFIX ex: <http://www.example.com/> 
      
      DELETE {<${todo.id2}> <http://sodo-example.com/status> "${queryBoo}".}
                    INSERT {<${todo.id2}> <http://sodo-example.com/status> "${queryBooNew}".}
                    WHERE  {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}".}`, context)
  }

  function handleEdit(e, id2): any {
    void editTheTodo(e, id2)
  }

  function handleDelete(id2): any {
    void deleteTodo(id2)
  }

  function handleDone(id2): any {
    void doneTodo(id2)
  }

  return (
    <form className="todos__single" onSubmit={(e) => handleEdit(e, todo.id2)}>
      {edit
        ? (
          <input
            value={editTodo}
            onChange={(e) => setEditTodo(e.target.value)}
            className="todos__single--text"
            ref={inputRef}
          />)
        : todo.boo2
          ? (
            <s className="todos__single--text">{todo.text2} {todo.boo2}</s>)
          : (
            <span className="todos__single--text">{todo.text2} {todo.boo2}</span>)}

      <div>
        <span className='icon'
          onClick={() => {
            if (!edit) {
              setEdit(!edit)
            }
          }}>
          <AiFillEdit />
        </span>

        <span className='icon' onClick={() => handleDelete(todo.id2)}>
          <AiFillDelete />
        </span>

        <span className='icon' onClick={() => handleDone(todo.id2)}>
          <MdDone />
        </span>
      </div>
    </form>
  )
}

export default SingleTodo
