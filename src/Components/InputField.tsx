import  { FormEvent, useRef, useState } from 'react'
import { useSession } from "@inrupt/solid-ui-react";
import {
  addDatetime,
  addStringNoLocale,
  addUrl,
  createThing,
  getSourceUrl,
  saveSolidDatasetAt,
  setThing,
} from "@inrupt/solid-client";
import './style.css'

const InputField = ({ todos, setTodos }) => {

  const { session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const [todo, setTodo] = useState<string>("");

const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://schema.org/dateCreated";
const TODO_VALUE = "http://schema.org/TextDigitalDocument";
const TODO_PROPERTY = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";


  const addTodo = async (text: string) => {
    const indexUrl = getSourceUrl(todos);
    const todoWithText = addStringNoLocale(createThing(), TEXT_PREDICATE, text);
    console.log(createThing);
    const todoWithDate = addDatetime(
      todoWithText,
      CREATED_PREDICATE,
      new Date()
    );
    const todoWithType = addUrl(todoWithDate, TODO_PROPERTY, TODO_VALUE);
    const updatedTodoList = setThing(todos, todoWithType);
    const updatedDataset = await saveSolidDatasetAt(indexUrl, updatedTodoList, {
      fetch: session.fetch as any,
    });
    setTodos(updatedDataset);
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    addTodo(todo);
    setTodo("");
  };

  // const handleChange
  
  return (
    <form className='input' id= 'input' onSubmit= {(e) =>{handleAdd(e)
    inputRef.current?.blur();}}>
        <input
        ref={inputRef}
        type="input" 
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder='Enter a to-do' 
        className='input_box' 
        />
        <button className='input_submit' type='submit'>GO</button>
    </form>
  )
}

export default InputField