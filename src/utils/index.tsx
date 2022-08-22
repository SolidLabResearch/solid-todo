import {
    createSolidDataset,
    getSolidDataset,
    saveSolidDatasetAt,
  } from "@inrupt/solid-client";
  
  export async function GetOrCreateTodoList(containerUri: any, fetch: any) {
    const indexUrl = `${containerUri}index.ttl`;
    
    try {
      const todoList = await getSolidDataset(indexUrl, { fetch });
      return todoList;
    } catch (error: any) {
      if (error.statusCode === 404) {
        const todoList = await saveSolidDatasetAt(
          indexUrl,
          createSolidDataset(),
          {
            fetch,
          }
        );
        return todoList;
      }
    }
  }

  export default GetOrCreateTodoList
  