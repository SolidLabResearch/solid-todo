import { useEffect } from 'react'
import { type ITask } from '../logic/model'
import { session } from '../logic/session'
import { findTasks } from '../logic/utils'

import SingleTodo from './SingleTodo'

interface TodoListProps {
  todos: ITask[]
  setTodos: React.Dispatch<React.SetStateAction<ITask[]>>
  file: string
}

const TodoList: React.FC<TodoListProps> = ({ todos, setTodos, file }) => {
  const display = async (): Promise<void> => {
    // 1. query my pod for my existing todos
    const tasks = await findTasks(session.info.webId as string, file)
    setTodos(tasks)
  }

  useEffect(() => {
    void display()
  }, [file])

  const displaytodos = todos.map((entry) => {
    return (
      <div key={entry.id}>
        <SingleTodo todo={entry} todos={todos} setTodos={setTodos} file={file} />
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
