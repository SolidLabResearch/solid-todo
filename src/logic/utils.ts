import { createSolidDataset, getSolidDataset, saveSolidDatasetAt } from '@inrupt/solid-client'

// Deprecated function component
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

export { getOrCreateTodoList }
