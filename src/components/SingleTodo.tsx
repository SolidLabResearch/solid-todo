import React, { useEffect, useState, useRef } from 'react'
import { type TheArr } from '../logic/model'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import './style.css'
// import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
// import { useSession } from '@inrupt/solid-ui-react'
import { fetch } from '@inrupt/solid-client-authn-browser'
// import TodoList from './TodoList'

// interface ISingleTodoProps {
//   todo: ITodo
//   todos: ITodo[]
//   setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
// }

const SingleTodo: React.FC<{
  index: number
  todo: TheArr
  todos: TheArr[]
  setTodos: React.Dispatch<React.SetStateAction<TheArr[]>>
  file: string
  name: string
}> = ({ index, todo, todos, setTodos, file, name }): any => {
  // console.log(todo)
  // console.log(todo.text2)
  // console.log(id)
  // console.log(isDone)
  // console.log(todos)
  // console.log(file)
  const [edit, setEdit] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<string>('')
  // const [newValue, setNewValue] = useState(todo.boo2)
  console.log(todos)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [edit])

  const deleteTodo = async (id2): Promise<void> => {
    console.log(id2)

    setTodos(todos.filter((todo) => todo.id2 !== id2))
    // console.log(todos)

    if (todo.id2 === id2) console.log(todo.text2, todo.id2, todo.boo2)

    console.log('Deleting todos')
    const queryBoo: string = todo.boo2 as unknown as string
    const query = `DELETE DATA {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}"; <http://sodo-example.com/status> "${queryBoo}"; <http://sodo-example.com/dateCreated> "${todo.dateCreated}".}`
    await fetch(file, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/sparql-update' },
      body: query,
      credentials: 'include'
    })
  }

  const editTheTodo = async (e: React.FormEvent, id2: number): Promise<any> => {
    e.preventDefault()
    setTodos(
      todos.map((todo) => (todo.id2 === id2 ? { ...todo, todo: editTodo } : todo))
    )
    console.log(editTodo)

    // setTodo([editTodo, todo.id2, todo.boo2])
    setEdit(false)
    const queryBoo: string = todo.boo2 as unknown as string
    const query = `DELETE DATA {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}";  <http://sodo-example.com/status> "${queryBoo}".} 
                    INSERT DATA {<${todo.id2}> <http://sodo-example.com/label> "${editTodo}"; <http://sodo-example.com/status> "${queryBoo}".}
                    WHERE  {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}".}`
    // const query = `DELETE DATA {<${todo.text2}>}`
    await fetch(file, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/sparql-update' },
      body: query,
      credentials: 'include'
    })
  }

  const doneTodo = async (id2): Promise<void> => {
    setTodos(
      todos.map((todo) =>
        todo.id2 === id2 ? { ...todo, boo2: !todo.boo2 } : todo
      )
    )
    const queryBoo: string = todo.boo2 as unknown as string
    let queryBooNew: string
    queryBoo === 'true' ? queryBooNew = 'false' : queryBooNew = 'true'
    // const notQueryBoo: string = !todo.boo2.valueOf as unknown as string
    const query = `DELETE DATA {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}";  <http://sodo-example.com/status> "${queryBoo}".}
                    INSERT DATA {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}"; <http://sodo-example.com/status> "${queryBooNew}".}
                    WHERE  {<${todo.id2}> <http://sodo-example.com/label> "${todo.text2}".}`
    // const query = `DELETE DATA {<${todo.text2}>}`
    await fetch(file, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/sparql-update' },
      body: query,
      credentials: 'include'
    })
  }

  function handleDelete(id2): any {
    void deleteTodo(id2)
  }

  function handleEdit(e, id2): any {
    void editTheTodo(e, id2)
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
