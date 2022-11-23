import { useEffect, useState } from 'react'
import { type ITask } from '../logic/model'
import { findName, findStorage, findTasks, handleLogout, registerDefaultTaskList } from '../logic/utils'

import InputField from './InputField'
import SingleTodo from './SingleTodo'

interface TodoListProps {
  webId: string
}

const TodoList: React.FC<TodoListProps> = ({ webId }) => {
  const [userName, setUserName] = useState<string>('')
  const [taskLocation, setTaskLocation] = useState<string>('')
  const [tasks, setTasks] = useState<ITask[]>([])

  useEffect(() => {
    findTasks(webId, taskLocation)
      .then((tasks) => setTasks(tasks.sort((a, b) => a.title.localeCompare(b.title))))
      .catch(() => alert('Retrieving tasks failed'))

    findName(webId)
      .then((name) => setUserName(name))
      .catch(() => alert('Failed to find username')) // this will never happen because it falls back to WebID

    findStorage(webId)
      .then((storage) => {
        // By default, our base starts from the webId containing folder
        const defaultTaskLocation = (storage != null ? new URL(storage) : new URL('./', webId)).href + 'private/todos/todos'
        setTaskLocation(defaultTaskLocation)
        registerDefaultTaskList(defaultTaskLocation).catch(() => alert('Failed to register default task list'))
      })
      .catch(() => alert('Failed to find storage on WebID')) // this will occur when the logic fails, not the query
  }, [taskLocation])

  const logoutEventHandler = (): void => {
    handleLogout().catch(() => alert('Logout failed!'))
  }

  const taskElements = tasks.map((task) => (
    <div key={task.id}>
      <SingleTodo task={task} tasks={tasks} setTasks={setTasks} taskLocation={taskLocation} />
    </div>
  ))

  return (
    <div className="flex flex-col flex-grow gap-2">
      <div className="flex flex-row gap-4 items-center">
        <p>You are logged in as: {userName} </p>
        <input type="submit" className="todo-input-button" value="Logout" onClick={logoutEventHandler}></input>
      </div>
      <InputField tasks={tasks} setTasks={setTasks} taskLocation={taskLocation} />
      {taskElements}
    </div>
  )
}

export default TodoList
