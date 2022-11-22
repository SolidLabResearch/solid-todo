import React, { useEffect, useState, useRef } from 'react'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import { type ITask } from '../logic/model'
import { deleteTask, updateTaskTitle, toggleTaskStatus } from '../logic/utils'

import './style.css'

interface SingleTodoProps {
  todo: ITask
  todos: ITask[]
  setTodos: React.Dispatch<React.SetStateAction<ITask[]>>
  file: string
}

const SingleTodo: React.FC<SingleTodoProps> = ({ todo, todos, setTodos, file }) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [edit])

  // to delete
  const handleDelete = async (task: ITask): Promise<any> => {
    deleteTask(task.id, file)
      .then(() => { confirm('Deleting the selected todo entry!') })
      .catch((error) => { alert(`Unable to delete todo: ${String(error.message)}`) })
  }

  // to edit todo item
  const editTheTodo = async (e: React.FormEvent, id: string): Promise<any> => {
    e.preventDefault()
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, title: editTodo } : todo))
    )
    // Modified date for an edited todo item.
    setEdit(false)

    updateTaskTitle(todo, editTodo, file)
      .then(() => confirm('Updated the todo item from ' + todo.title + ' to ' + editTodo))
      .catch(() => alert('Update failed'))
  }

  // to set the todo status. false -> pending. true -> completed.
  const doneTodo = async (task: ITask): Promise<void> => {
    toggleTaskStatus(task, file)
      .then(() => confirm('Todo status of ' + todo.title + ' changed to ' + (todo.status ? 'true' : 'false')))
      .catch(() => { alert('Failed to change the status of the todo item') })
  }

  function handleEdit(e, id): any {
    void editTheTodo(e, id)
  }

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
            <s className="todos__single--text">{todo.title} </s>)
          : (
            <span className="todos__single--text">{todo.title} </span>)}

      <div>
        <span className='icon'
          onClick={() => {
            if (!edit) {
              setEdit(!edit)
            }
          }}>
          <AiFillEdit />
        </span>

        <span className='icon' onClick={() => handleDelete(todo) as unknown}>
          <AiFillDelete />
        </span>

        <span className='icon' onClick={() => handleDone(todo)}>
          <MdDone />
        </span>
      </div>
    </form>
  )
}

export default SingleTodo
