import { useState } from 'react'
import { type ITask } from '../logic/model'
import { createTask } from '../logic/utils'

interface InputFieldProps {
  tasks: ITask[]
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>
  taskLocation: string
}

const InputField: React.FC<InputFieldProps> = ({ tasks, setTasks, taskLocation }) => {
  const [inputValue, setInputValue] = useState<string>('')

  function handleAdd(event: React.FormEvent): void {
    event.preventDefault()
    if (inputValue.length > 0) {
      createTask(inputValue, taskLocation)
        .then((createdTask) => setTasks([...tasks, createdTask].sort((a, b) => a.title.localeCompare(b.title))))
        .catch(() => alert('Inserting new task failed'))
      setInputValue('')
    }
  }

  return (
    <form className='my-4 flex flex-row w-full gap-2' id='input' onSubmit={handleAdd}>
      <input
        type='input'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='Enter a to-do'
        className='todo-input-text' />
      <button className='todo-input-button' type='submit'>GO</button>
    </form>
  )
}

export default InputField
