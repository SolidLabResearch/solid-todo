import { useState } from 'react'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { MdDone } from 'react-icons/md'
import { type ITask } from '../logic/model'
import { deleteTask, updateTaskTitle, toggleTaskStatus } from '../logic/utils'

interface SingleTodoProps {
  task: ITask
  tasks: ITask[]
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>
  taskLocation: string
}

const SingleTodo: React.FC<SingleTodoProps> = ({ task, tasks, setTasks, taskLocation }) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')

  function replaceUpdatedTaskInList(updatedTask: ITask): void {
    setTasks([...tasks.filter((t) => t.id !== task.id), updatedTask].sort((a, b) => a.title.localeCompare(b.title)))
  }

  function deleteHandler(task: ITask): void {
    deleteTask(task.id, taskLocation)
      .then(() => setTasks(tasks.filter((t) => t.id !== task.id)))
      .catch((error) => { alert(`Unable to delete todo: ${String(error.message)}`) })
  }

  function editHandler(task: ITask): void {
    setEditMode(false)
    updateTaskTitle(task, inputValue, taskLocation)
      .then((updatedTask) => replaceUpdatedTaskInList(updatedTask))
      .catch(() => alert('Update failed'))
  }

  function editModeHandler(task: ITask): void {
    setInputValue(!editMode ? task.title : '')
    setEditMode(!editMode)
  }

  function statusHandler(task: ITask): void {
    toggleTaskStatus(task, taskLocation)
      .then((updatedTask) => {
        replaceUpdatedTaskInList(updatedTask)
        // confirm('Todo status of ' + task.title + ' changed to ' + (updatedTask.status ? 'true' : 'false'))
      })
      .catch(() => { alert('Failed to change the status of the todo item') })
  }

  return (
    <form className="todo-card" onSubmit={(e) => { e.preventDefault(); editHandler(task) } }>
      {editMode
        ? (<input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />)
        : (<p className={task.status ? 'done' : ''}>{task.title}</p>)
      }
      <AiFillEdit className='ml-auto icon' onClick={() => editModeHandler(task) } />
      <AiFillDelete className='icon' onClick={() => deleteHandler(task) } />
      <MdDone className='icon' onClick={() => statusHandler(task)} />
    </form>
  )
}

export default SingleTodo
