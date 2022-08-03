import { Session } from "@inrupt/solid-client-authn-browser"
import { QueryEngine } from "@comunica/query-sparql-link-traversal-solid"
import { Bindings, BindingsStream, QueryStringContext } from "@comunica/types"
import { Literal, NamedNode } from "rdf-js"
import { type ITodo } from "./model"

// This should preferably only be created once, from what I have understood?
const engine: QueryEngine = new QueryEngine()

// According to a quick GitHub repo search, this should be the one for the session?
const sessionKey: string = "@comunica/actor-http-inrupt-solid-client-authn:session"

// This exists so that there is a type for the callback function to handle bindings
type BindingsHandler = (bindings: Bindings) => void

/**
 * Horrible example function to help illustrate query execution.
 * @param query the SPARQL query to execute
 * @param initialDocument the document to begin link traversal from
 * @param session the Solid session
 * @param bindingsHandler callback function to process each binding
 * @returns promise that resolves itself when the query execution ends, if it ever does
 */
function execute(query: string, initialDocument: string, session: Session, bindingsHandler: BindingsHandler): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const context: QueryStringContext = {
      sources: [initialDocument],
      [sessionKey]: session,
      lenient: true
    }
    engine
      .queryBindings(query, context)
      .then((bindingsStream: BindingsStream) => {
        bindingsStream
          .on("data", (bindings: Bindings) => bindingsHandler(bindings))
          .on("error", (error: Error) => reject(error))
          .on("end", () => resolve())
      })
      .catch((reason: any) => reject(reason))
  })
}

/**
 * Another horrible example of how to probably not find todo entries
 * @param session the Solid session
 * @returns promise that resolves to an array of todo entries
 */
function findTodoEntries(session: Session): Promise<ITodo[]> {
  const todoQuery: string = `
    PREFIX todo: <https://example.org/todo/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    SELECT ?s ?o WHERE {
      ?s rdf:type todo:Task .
      ?s todo:title ?o .
    }
  `
  return new Promise<ITodo[]>((resolve, reject) => {
    const todoList: ITodo[] = new Array<ITodo>()
    let tempCounter: number = 0
    execute(todoQuery, session.info.webId as string, session, (bindings: Bindings) => {
      const todoURI: NamedNode = bindings.get("s") as NamedNode
      const todoTitle: Literal = bindings.get("o") as Literal
      console.log(`Found: ${todoURI.value} "${todoTitle.value}"`)
      todoList.push({
        id: tempCounter++,
        todo: todoTitle.value,
        isDone: false
      })
    })
      .catch((reason: any) => reject(reason))
      .then(() => resolve(todoList))
  })
}

export { findTodoEntries }
