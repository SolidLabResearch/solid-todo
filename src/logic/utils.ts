import { createSolidDataset, getSolidDataset, saveSolidDatasetAt } from '@inrupt/solid-client'
import { Session } from '@inrupt/solid-client-authn-browser'
import { findTaskEntries } from './query'
import { ITodo } from './model'

async function getOrCreateTodoList(containerUri: string, fetch: any): Promise<any> {
  const indexUrl = `${containerUri}index.ttl`
  try {
    return await getSolidDataset(indexUrl, { fetch })
  } catch (error: any) {
    if (error.statusCode === 404) {
      return await saveSolidDatasetAt(indexUrl, createSolidDataset(), { fetch })
    }
    throw error
  }
}

async function getTodoListViaQuery(session: Session): Promise<ITodo[]> {
  return await findTaskEntries(session)
}

export { getOrCreateTodoList, getTodoListViaQuery }
