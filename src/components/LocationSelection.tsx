import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { QueryStringContext } from '@comunica/types'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import React, { useEffect, useRef, useState } from 'react'
import { Session } from '@inrupt/solid-client-authn-browser'
import InputField from './InputField'
import TodoList from './TodoList'
import { TodoItem } from '../logic/model'
import { AiFillDelete } from 'react-icons/ai'

const LocationSelection: React.FC<{
  todos: TodoItem[]
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>
  session: Session
  webID: string
}> = ({ todos, setTodos, session, webID }): any => {
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [showhide, setShowhide] = useState('')
  const [file, setFile] = useState('')
  let existingList: any
  const listArray: any[] = []
  const [existingListArray, setExistingListArray] = useState<any>([])
  const [multipleListSelected, setMultipleListSelected] = useState<string>('')
  const [taskListName, setTaskListName] = useState<string>('')
  const [displayInput, setDisplayInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const myEngine = new QueryEngine()
  const context: QueryStringContext = {
    sources: [`${webID}`],
    lenient: true,
    baseIRI: `${webID}`,
    [ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name]: session
  }

  // Function to handle user's location selection -> single list or multiple list
  const setLocation = async (selectedLocation): Promise<any> => {
    const bindingsStream = await myEngine.queryBindings(`SELECT ?o WHERE {
    ?s <http://www.w3.org/ns/pim/space#storage> ?o.
    }`, context)
    const bindings = await bindingsStream.toArray()
    const baseUrl = bindings[0]?.get('o').value
    //  If the location selected is single list, it is stored in /private/todos/todos.ttl in user's pod.
    if (selectedLocation === 'SingleList') {
      const bindingsStream = await myEngine.queryBindings(`
    SELECT ?o WHERE{
                ?s <http://sodo-example.com/SingleList> ?o
            }`, context)
      const bindings = await bindingsStream.toArray()
      if (bindings[0] as unknown as string !== '') {
        alert('There exists a file to store your todos!')
        setFile(bindings[0]?.get('o').value)
        console.log(file)
        // <><InputField todos={todos} setTodos={setTodos} file={file} session={session} /><TodoList todos={todos} setTodos={setTodos} file={file} session={session} /></>
      } else {
        alert('Sorry! No place to store your todos and hence it will be created!')
        const location = baseUrl as string + 'private/todos/todos'
        await myEngine.queryVoid(`
        PREFIX sodo: <http://sodo-example.com/>
    
        INSERT DATA{
        <#me> sodo:SingleList <${location}> .
        }`, context
        ).then(() => {
          console.log('success')
          setFile(location)
          console.log(file)
        })
          .catch((error) => console.log('failed', error))
      }
    } else if (selectedLocation === 'MultipleList') {
      const bindingsStream = await myEngine.queryBindings(`
      SELECT ?o WHERE{
      ?s <http://sodo-example.com/todoMultipleList> ?o
      }`, context)
      const bindings = await bindingsStream.toArray()

      bindings.forEach((element) => {
        existingList = element.get('o').value
        listArray.push(existingList)
        setExistingListArray(listArray)
      })
    }
    setShowhide(selectedLocation)
  }

  // Function setting state for user's location selection.
  function handleSelectedLocation(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    console.log(selectedLocation)
    void setLocation(selectedLocation)
    setSelectedLocation('')
  }

  // Function setting state for new tasklist with multiple todos stored
  function onChangeNewList(event): void {
    event.preventDefault()
    const multipleListValueSelected = event.target.value
    setMultipleListSelected(multipleListValueSelected)
  }

  // Function creating new task list to store multiple todos
  async function handleNewTaskList(event): Promise<void> {
    event.preventDefault()
    const bindingsStream = await myEngine.queryBindings(`SELECT ?o WHERE {
    ?s <http://www.w3.org/ns/pim/space#storage> ?o.
    }`, context)
    const bindings = await bindingsStream.toArray()
    const baseUrl = bindings[0]?.get('o').value
    const id = Date.now()
    const location = `${String(baseUrl)} private/todos/ ${String(taskListName)}`
    setFile(location)
    await myEngine.queryVoid(`
        PREFIX sodo: <http://sodo-example.com/>

        INSERT DATA{
        <#me> sodo:todoMultipleList <${location}> .
        <${location}> sodo:taskListId <${id}> .
        }`, context
    ).then(() => {
      console.log('success')
      setFile(location)
    })
      .catch(() => console.log('failed'))
    setDisplayInput(true)
  }

  useEffect(() => {
    console.log(file)
  }, [file])

  // Function setting file with the selected list value
  const onChangeExistingList = (event): any => {
    const multipleListValueSelected = event.target.value
    setMultipleListSelected(multipleListValueSelected)
    console.log(multipleListValueSelected)
    setFile(multipleListValueSelected)
    setDisplayInput(true)
  }

  // mapping array to display already existing multiple lists
  const displayMultipleLists = existingListArray.map((entry) => {
    return (<><div>
      <div>
        <input type='radio' id='multipleListSelected' name='multipleListSelected' value={entry} checked={multipleListSelected === entry} onChange= {(e) => onChangeExistingList(e)}/>
        {entry}
      </div>
    </div>
    </>)
  })

  function handleDeleteSingleLists(): void {

  }
  return (
    <><form onSubmit={(e) => {
      handleSelectedLocation(e)
    } }>
      <div>
        <h1>Select a storage strategy for your todolists:</h1>
        <div>
          <input type='radio' id='singleList' name='location' value='SingleList' checked={selectedLocation === 'SingleList'} onChange={(e) => setSelectedLocation(e.target.value)} />
                  Store all todos in a single list
          <span className='icon' onClick={() => handleDeleteSingleLists() as unknown}>
            <AiFillDelete />
          </span>
        </div>
        <div>
          <input type='radio' id='multipleList' name='location' value='MultipleList' checked={selectedLocation === 'MultipleList'} onChange={(e) => setSelectedLocation(e.target.value)} />
                  Store todos in multiple lists
        </div>

        <button type='submit'>Submit</button>
      </div>
    </form>
    {showhide === 'SingleList' && (
      <>
        {/* //   <><Routes>
      //       <Route path='/' element={<Login />}></Route>
      //       <Route path='/inputField' element={<InputField />}/>
      //   </Routes></> */}
        <InputField todos={todos} setTodos={setTodos} file={file} session={session} />
        <TodoList todos={todos} setTodos={setTodos} file={file} session={session} /></>
    )}
    {showhide === 'MultipleList' && (
      displayMultipleLists
    )}
    {showhide === 'MultipleList' && (
      <div>
        <input type='radio' id='multipleListSelected' name='multipleListSelected' value='newMultipleList' checked={multipleListSelected === 'newMultipleList'} onChange={(e) => onChangeNewList(e)}/>
        Create a new tasklist
      </div>
    )}
    {multipleListSelected === 'newMultipleList' && (
      <><div>Please enter the name of the new tasklist</div>
        <form className='my-4 flex flex-row w-full' id='taskListInput' onSubmit={(e) => {
          void handleNewTaskList(e)
          inputRef.current?.blur()
        } }>
          <input
            type='input'
            value={taskListName}
            onChange={(e) => setTaskListName(e.target.value)}
            placeholder='Enter a name for your tasklist'
            className='rounded-full py-2 px-4 border-white flex-grow' />
          <button className='rounded-full py-2 px-3 ml-4 border transition-colors border-white hover:bg-foreground hover:text-white' type='submit'>GO</button>
        </form>
      </>
    )}
    {displayInput && (
      <><InputField todos={todos} setTodos={setTodos} file={file} session={session} />
        <TodoList todos={todos} setTodos={setTodos} file={file} session={session} /></>
    )}
    </>
  )
}

export default LocationSelection
