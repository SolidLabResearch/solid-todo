import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import { Bindings, BindingsStream, QueryStringContext } from '@comunica/types'
import { Session } from '@inrupt/solid-client-authn-browser'

const queryEngine: QueryEngine = new QueryEngine()

function mergeContext(context: QueryStringContext, session?: Session): QueryStringContext {
  if (session != null) {
    context[ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name] = session
  }
  context.lenient = true
  return context
}

async function find(query: string, context: QueryStringContext, session?: Session): Promise<Bindings[]> {
  const bindingsStream: BindingsStream = await queryEngine.queryBindings(query, mergeContext(context, session))
  const bindings: Bindings[] = await bindingsStream.toArray()
  console.log('Query:', query)
  console.log('Context:', context)
  console.log('Bindings:', bindings)
  return bindings
}

async function update(query: string, context: QueryStringContext, session?: Session): Promise<void> {
  await queryEngine.queryVoid(query, mergeContext(context, session))
}

export { find, update }
