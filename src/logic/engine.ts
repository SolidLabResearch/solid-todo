import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import { Bindings, BindingsStream, QueryStringContext } from '@comunica/types'
import { session } from './session'

const queryEngine: QueryEngine = new QueryEngine()

function configureContext(context: QueryStringContext): QueryStringContext {
  if (session.info.isLoggedIn) {
    context[ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name] = session
  }
  context.lenient = true
  return context
}

async function find(query: string, context: QueryStringContext): Promise<Bindings[]> {
  const finalContext: QueryStringContext = configureContext(context)
  const bindingsStream: BindingsStream = await queryEngine.queryBindings(query, finalContext)
  const bindingsArray: Bindings[] = await bindingsStream.toArray()
  return bindingsArray
}

async function update(query: string, context: QueryStringContext): Promise<void> {
  const finalContext: QueryStringContext = configureContext(context)
  await queryEngine.queryVoid(query, finalContext)
}

export { find, update }
