interface Todo {
  id: number
  todo: string
  isDone: boolean
  iri?: URL
}

interface TheArr { // TODO: what does this interface mean? Can the name and fields be renamed to something more descriptive?
  id2: number
  text2: string
  boo2: boolean
  dateCreated: string
}

export { type Todo, type TheArr }
