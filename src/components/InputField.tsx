import { useRef, useState } from 'react'
import { createTask } from '../logic/utils'

const InputField = ({ todos, setTodos, file }: any): any => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [todo, setTodo] = useState<string>('')

  // Inserts new todo item to the pod.
  const addTodo = async (todo: string): Promise<any> => {
    createTask(todo, file)
      .then((task) => setTodos([...todos, task]))
      .catch(() => alert('Inserting new task failed'))
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    void addTodo(todo)
    setTodo('')
  }

  return (
    <><form className='my-4 flex flex-row w-full' id='input' onSubmit={(e) => {
      handleAdd(e)
      inputRef.current?.blur()
    } }>
      <input
        ref={inputRef}
        type="input"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder='Enter a to-do'
        className='rounded-full py-2 px-4 border-white flex-grow' />
      <button className='rounded-full py-2 px-3 ml-4 border transition-colors border-white hover:bg-foreground hover:text-white' type='submit'>GO</button>
    </form>
    </>

  )
}

export default InputField
