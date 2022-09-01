import React, { useEffect, useState, useRef } from 'react'
import { type ITodo } from '../logic/model'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
// import "./style.css"

interface ISingleTodoProps {
  todo: ITodo
  todos: ITodo[]
  setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
}

const SingleTodo: React.FC<ISingleTodoProps> = ({ todo, todos, setTodos }: ISingleTodoProps): JSX.Element => {
  const [edit, setEdit] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<string>(todo.todo)

  const handleDone = (id: number): void => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, isDone: !todo.isDone } : todo)))
  }

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [edit])

  const handleEdit = (e: React.FormEvent, id: number): void => {
    e.preventDefault()
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, todo: editTodo } : todo)))
    console.log(todo)
    setEdit(false)
  }

  const handleDelete = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <form onSubmit={(e) => handleEdit(e, todo.id)} className="todos__single">
      {edit ? <input value={editTodo} onChange={(e) => setEditTodo(e.target.value)} className="todos__single--text" ref={inputRef} /> : todo.isDone ? <s className="todos_single--text">{todo.todo}</s> : <span className="todos_single--text">{todo.todo}</span>}

      <div>
        <span
          className="icon"
          onClick={() => {
            if (!edit && !todo.isDone) {
              setEdit(!edit)
            }
          }}
        >
          <AiFillEdit />
        </span>
        <span className="icon" onClick={() => handleDelete(todo.id)}>
          <AiFillDelete />
        </span>
        <span className="icon" onClick={() => handleDone(todo.id)}>
          <MdDone />
        </span>
      </div>
    </form>
  )
}

export default SingleTodo
