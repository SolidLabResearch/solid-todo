import { getDatetime, getThingAll, getUrl } from '@inrupt/solid-client';
import { DatasetProvider, Table, TableColumn, Text, ThingProvider, useSession, Value } from '@inrupt/solid-ui-react';
import React, { useEffect } from 'react'
import SingleTodo from './SingleTodo';
import "./style.css";

const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://schema.org/dateCreated";
const COMPLETED_PREDICATE = "http://schema.org/dateCreated";
const TODO_VALUE = "http://schema.org/TextDigitalDocument";
const TODO_PROPERTY = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";


const TodoList = ({ todos, setTodos }) => {

  const { session } = useSession();

  var webID = session.info.webId as any


  const availtodo = todos ? getThingAll(todos) : [];
  availtodo.sort((a, b) => {
    return (getDatetime(a, CREATED_PREDICATE) as any - (getDatetime(b, CREATED_PREDICATE) as unknown as number));
  });

  const { fetch } = useSession();

  const thingsArray = availtodo.filter((t) => getUrl(t, TODO_PROPERTY) === TODO_VALUE).map((t) => {
      return { dataset: todos, thing: t };
    });
  if (!thingsArray.length) return null;


    return (
    <div className='todos'>
      
      {/* <Text className='todos__single'  property={session.info.webId} edit={TEXT_PREDICATE}/> */}
      {/* <DatasetProvider datasetUrl={webID}>
      <ThingProvider thing={thingsArray as any}>
      <Value
      dataType="string"
      inputProps={{
        className: 'test-class',
        name: 'test-name'
      }}
      property={TEXT_PREDICATE}
      />
      </ThingProvider>
      </DatasetProvider> */}
      <span className='todos_single--text'>  
      <Table className='todos_single--text' things={thingsArray as unknown as any} >
       
        <TableColumn  header="TO-DO" property={TEXT_PREDICATE} />  
        
        <TableColumn dataType='datetime' property={CREATED_PREDICATE} />
       
      </Table> 
        
      </span> 
    </div>
  )
}

export default TodoList;