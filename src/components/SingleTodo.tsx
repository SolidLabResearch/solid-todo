import React, { useEffect, useState, useRef } from 'react'
import { type TodoItem } from '../logic/model'
import { update } from '../logic/engine'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import './style.css'

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

  // to delete
  const handleDelete = async (id): Promise<any> => {
    setTodos(todos.filter((todo) => todo.id !== id))

    const query = `
      DELETE WHERE {
        <${todo.id}> ?p ?o .
      }
    `
    update(query, { sources: [file], baseIRI: file }, session)
      .then(() => { confirm('Deleting the selected todo entry!') })
      .catch((error) => { alert(`Unable to delete todo: ${String(error.message)}`) })
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

    const query = `
      PREFIX todo: <http://example.org/todolist/>

      DELETE {
        <${todo.id}> todo:title "${todo.text}" .
      }
      INSERT {
        <${todo.id}> todo:title "${editTodo}" ;
          todo:dateModified "${createdDate}" .
      }
      WHERE {
        <${todo.id}> todo:title "${todo.text}" .
      }
    `

    update(query, { sources: [file], baseIRI: file }, session)
      .then(() => { confirm('Updated the todo item from ' + todo.text + ' to ' + editTodo) })
      .catch((error) => { alert(`Sorry! Update failed! : ${String(error.message)}`) })
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

    const query = `
      PREFIX todo: <http://example.org/todolist/>
      
      DELETE {
        <${todo.id}> todo:status "${oldStatus}" .
      }
      INSERT {
        <${todo.id}> todo:status "${newStatus}" .
      }
      WHERE {
        <${todo.id}> todo:title "${todo.text}" .
      }
    `
    update(query, { sources: [file], baseIRI: file }, session)
      .then(() => { confirm('Todo status of ' + todo.text + ' changed to ' + currentStatus) })
      .catch((error) => { alert(`Sorry! Failed to change the status of the todo item : ${String(error.message)}`) })
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
