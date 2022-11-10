import React, { useEffect, useState, useRef } from 'react'
import { type TodoItem } from '../logic/model'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import './style.css'
import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { QueryStringContext } from '@comunica/types'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'

const SingleTodo: React.FC<{
  todo: TodoItem
  todos: TodoItem[]
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>
  file: string
  session: any
}> = ({ todo, todos, setTodos, file, session }): any => {
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

  // to delete
  const handleDelete = async (id): Promise<any> => {
    setTodos(todos.filter((todo) => todo.id !== id))

    if (todo.id === id) console.log(todo.text, todo.id, todo.status)
    await myEngine.queryVoid(`
    PREFIX tod: <>
      PREFIX tur: <http://www.w3.org/ns/iana/media-types/text/turtle#>
      PREFIX sodo: <http://sodo-example.com/>
      PREFIX ex: <http://www.example.com/> 

      DELETE WHERE {<${todo.id}> ?p ?o.}`, context)
      .then(() => { confirm('Deleting the selected todo entry!') })
      .catch(() => { alert('Sorry! Cant delete the ' + todo.text + ' todo item!') })
  }

  // to edit todo item
  const editTheTodo = async (e: React.FormEvent, id: number): Promise<any> => {
    e.preventDefault()
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: editTodo } : todo))
    )
    // Modified date for an edited todo item.
    const createdDate: string = new Date(Date.now()) as unknown as string
    setEdit(false)

    await myEngine.queryVoid(`
    PREFIX tod: <>
      PREFIX tur: <http://www.w3.org/ns/iana/media-types/text/turtle#>
      PREFIX sodo: <http://sodo-example.com/>
      PREFIX ex: <http://www.example.com/> 

      DELETE {<${todo.id}> <http://sodo-example.com/label> "${todo.text}".}
      INSERT {<${todo.id}> <http://sodo-example.com/label> "${editTodo}"; <http://sodo-example.com/dateModified> "${createdDate}".}
      WHERE  {<${todo.id}> <http://sodo-example.com/label> "${todo.text}".}`, context)
      .then(() => { confirm('Updated the todo item from ' + todo.text + ' to ' + editTodo) })
      .catch(() => { alert('Sorry! Update failed!') })
  }

  // to set the todo status. false -> pending. true -> completed.
  const doneTodo = async (id): Promise<void> => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: !todo.status } : todo
      )
    )

    const oldStatus: string = todo.status as unknown as string
    const newStatus: string = !todo.status as unknown as string

    let currentStatus: string

    newStatus as unknown as boolean ? currentStatus = 'completed' : currentStatus = 'pending'

    await myEngine.queryVoid(`
    PREFIX tod: <>
      PREFIX tur: <http://www.w3.org/ns/iana/media-types/text/turtle#>
      PREFIX sodo: <http://sodo-example.com/>
      PREFIX ex: <http://www.example.com/> 
      
      DELETE {<${todo.id}> <http://sodo-example.com/status> "${oldStatus}".}
      INSERT {<${todo.id}> <http://sodo-example.com/status> "${newStatus}".}
      WHERE  {<${todo.id}> <http://sodo-example.com/label> "${todo.text}".}`, context)
      .then(() => { confirm('Todo status of ' + todo.text + ' changed to ' + currentStatus) })
      .catch(() => { alert('Sorry! Failed to change the status of the todo item!!') })
  }

  function handleEdit(e, id): any {
    void editTheTodo(e, id)
  }

  // function handleDelete(id): any {
  //   void deleteTodo(id)
  // }

  function handleDone(id): any {
    void doneTodo(id)
  }

  return (
    <form className="todos__single" onSubmit={(e) => handleEdit(e, todo.id)}>
      {edit
        ? (
          <input
            value={editTodo}
            onChange={(e) => setEditTodo(e.target.value)}
            className="todos__single--text"
            ref={inputRef}
          />)
        : todo.status
          ? (
            <s className="todos__single--text">{todo.text} </s>)
          : (
            <span className="todos__single--text">{todo.text} </span>)}

      <div>
        <span className='icon'
          onClick={() => {
            if (!edit) {
              setEdit(!edit)
            }
          }}>
          <AiFillEdit />
        </span>

        <span className='icon' onClick={() => handleDelete(todo.id) as unknown}>
          <AiFillDelete />
        </span>

        <span className='icon' onClick={() => handleDone(todo.id)}>
          <MdDone />
        </span>
      </div>
    </form>
  )
}

export default SingleTodo
