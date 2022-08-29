import { getDatetime, getThingAll, getUrl } from '@inrupt/solid-client'
import { Table, TableColumn } from '@inrupt/solid-ui-react'

const TEXT_PREDICATE = 'http://schema.org/text'
const CREATED_PREDICATE = 'http://schema.org/dateCreated'
// const COMPLETED_PREDICATE = 'http://schema.org/dateCreated'
const TODO_VALUE = 'http://schema.org/TextDigitalDocument'
const TODO_PROPERTY = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'

interface ITodoListProps {
  todos: any | undefined
  setTodos: any
}

const TodoList: React.FC<ITodoListProps> = ({ todos, setTodos }: ITodoListProps): JSX.Element => {
  // const { session } = useSession()

  // const webID: string = session.info.webId as any

  const availtodo = todos != null ? getThingAll(todos) : []
  availtodo.sort((a, b) => {
    return (getDatetime(a, CREATED_PREDICATE) as any - (getDatetime(b, CREATED_PREDICATE) as unknown as number))
  })

  // const { fetch } = useSession()

  const thingsArray = availtodo.filter((t) => getUrl(t, TODO_PROPERTY) === TODO_VALUE).map((t) => {
    return { dataset: todos, thing: t }
  })

  if (thingsArray.length < 1) return (<p>No todos!</p>)

  return (
    <div className='flex flex-col flex-grow'>
      <span className='shadow-sm py-2 px-4 bg-white'>
        <Table things={thingsArray as unknown as any} >
          <TableColumn header="Title" property={TEXT_PREDICATE} />
          <TableColumn header="Created" dataType='datetime' property={CREATED_PREDICATE} />
        </Table>
      </span>
    </div>
  )
}

export default TodoList
