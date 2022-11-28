import { type ITask } from './model'
import { find, update } from './engine'
import { session, login, logout } from './session'

async function findStorage(webId: string): Promise<string | undefined> {
  const query = `
    PREFIX pim: <http://www.w3.org/ns/pim/space#>

    SELECT ?storage WHERE {
      <${webId}> pim:storage ?storage .
    }
  `
  const bindingsArray = await find(query, { sources: [webId] })
  const storage = bindingsArray.at(0)?.get('storage')?.value

  return storage
}

async function findOidcIssuer(webId: string): Promise<string> {
  const query = `
    PREFIX solid: <http://www.w3.org/ns/solid/terms#>

    SELECT ?oidcIssuer WHERE {
      <${webId}> solid:oidcIssuer ?oidcIssuer .
    }
  `
  const bindingsArray = await find(query, { sources: [webId] })
  const issuer = bindingsArray.at(0)?.get('oidcIssuer')?.value

  if (issuer == null) {
    throw new Error('No OIDC issuer found on WebID')
  }

  return issuer
}

async function findName(webId: string): Promise<string> {
  const query = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?name WHERE {
      <${webId}> (foaf:givenName|foaf:name) ?name .
    }
  `
  const bindingsArray = await find(query, { sources: [webId] })
  const name = bindingsArray.at(0)?.get('name')?.value
  return name ?? webId
}

async function findTasks(webId: string, defaultLocation: string): Promise<ITask[]> {
  const query = `
    PREFIX todo: <http://example.org/todolist/>

    SELECT * WHERE {
      ?id a todo:Task ;
        todo:title ?title ;
        todo:status ?status ;
        todo:dateCreated ?dateCreated ;
        todo:dateModified ?dateModified ;
        todo:createdBy ?createdBy .
    }
  `

  const bindingsArray = await find(query, { sources: [defaultLocation.length > 0 ? defaultLocation : webId] })
  const tasks = new Map<string, ITask>()

  for (const bindings of bindingsArray) {
    const task: ITask = {
      id: bindings.get('id')?.value as string,
      createdBy: bindings.get('createdBy')?.value as string,
      dateCreated: bindings.get('dateCreated')?.value as string,
      dateModified: bindings.get('dateModified')?.value as string,
      status: bindings.get('status')?.value === 'true',
      title: bindings.get('title')?.value as string
    }
    tasks.set(task.id, task)
  }

  return [...tasks.values()]
}

async function deleteTask(id: string, url: string): Promise<void> {
  const query = `
    DELETE WHERE {
      <${id}> ?p ?o .
    }
  `
  await update(query, { sources: [url] })
}

async function updateTaskTitle(task: ITask, newTitle: string, url: string): Promise<ITask> {
  const currentTime = new Date().toISOString()
  const query = `
    PREFIX todo: <http://example.org/todolist/>

    DELETE {
      ?id todo:dateModified ?modified .
      ?id todo:title "${task.title}" .
    }
    INSERT {
      ?id todo:title "${newTitle}" .
      ?id todo:dateModified "${currentTime}" .
    }
    WHERE {
      ?id a todo:Task .
      FILTER( ?id = <${task.id}> ) .
    }
  `
  await update(query, { sources: [url] })
  task.title = newTitle
  task.dateModified = currentTime
  return task
}

async function toggleTaskStatus(task: ITask, url: string): Promise<ITask> {
  const currentTime = new Date().toISOString()
  const query = `
    PREFIX todo: <http://example.org/todolist/>

    DELETE {
      ?id todo:dateModified ?modified .
      ?id todo:status "${task.status ? 'true' : 'false'}" .
    }
    INSERT {
      ?id todo:dateModified "${currentTime}" .
      ?id todo:status "${task.status ? 'false' : 'true'}" .
    }
    WHERE {
      ?id a todo:Task .
      FILTER( ?id = <${task.id}> ) .
    }
  `
  await update(query, { sources: [url] })
  task.status = !task.status
  task.dateModified = currentTime
  return task
}

async function createTask(taskTitle: string, url: string): Promise<ITask> {
  const currentTime = new Date()
  const task: ITask = {
    id: `${url}#${currentTime.getTime()}`,
    dateCreated: currentTime.toISOString(),
    dateModified: currentTime.toISOString(),
    createdBy: session.info.webId as string,
    status: false,
    title: taskTitle
  }
  const query = `
    PREFIX todo: <http://example.org/todolist/> 
      
    INSERT DATA{
      <${task.id}> a todo:Task ;
        todo:title "${task.title}" ;
        todo:status "${task.status ? 'true' : 'false'}" ;
        todo:dateCreated "${task.dateCreated}" ;
        todo:createdBy <${task.createdBy}> ;
        todo:dateModified "${task.dateModified}" ;
        todo:isPartOf <#default> .
    }
  `
  await update(query, { sources: [url], baseIRI: url })
  return task
}

async function registerDefaultTaskList(url: string): Promise<void> {
  const query = `
    PREFIX todo: <http://example.org/todolist/>

    INSERT DATA {
      <#default> a todo:TaskList ;
        todo:title "DefaultTaskList" .
    }
  `
  try {
    await update(query, { sources: [url], baseIRI: url })
  } catch (error) {
    console.log('Registering default tasklist failed:', error)
  }
}

async function handleLogin(webId: string): Promise<void> {
  const issuer = await findOidcIssuer(webId)
  await login(issuer)
}

async function handleLogout(): Promise<void> {
  await logout()
}

export { findStorage, findName, findOidcIssuer, findTasks, deleteTask, createTask, toggleTaskStatus, updateTaskTitle, handleLogin, handleLogout, registerDefaultTaskList }
