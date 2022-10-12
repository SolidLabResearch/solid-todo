interface Todo {
  id: number
  todo: string
  isDone: boolean
  iri?: URL
}

interface Task {
  id2: number
  text2: string
  boo2: boolean
  dateCreated: string
}

export { type Todo, type Task }
