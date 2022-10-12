import { Session } from "@inrupt/solid-client-authn-browser";
import { QueryEngine } from "@comunica/query-sparql-link-traversal-solid";
import { Bindings, BindingsStream, QueryStringContext } from "@comunica/types";
import { Quad, Term, NamedNode, Literal } from "n3";
import { Todo } from "./model";

const engine: QueryEngine = new QueryEngine();
const sessionKey: string =
  "@comunica/actor-http-inrupt-solid-client-authn:session";
type BindingsHandler = (bindings: Bindings) => void;

function findObjectByPredicate(quads: Quad[], predicate: string): Term {
  const matchingQuad: Quad | undefined = quads.find(
    (quad: Quad) => quad.predicate.value === predicate
  );
  if (matchingQuad != null) {
    return matchingQuad.object;
  } else {
    throw new Error(`Predicate ${predicate} not found in quads`);
  }
}

async function execute(
  query: string,
  sources: string,
  session: Session | undefined,
  bindingsHandler: BindingsHandler
): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    const context: QueryStringContext = {
      sources: [sources],
      [sessionKey]: session,
      lenient: true,
    };
    engine
      .queryBindings(query, context)
      .then((bindingsStream: BindingsStream) => {
        bindingsStream
          .on("data", (bindings: Bindings) => bindingsHandler(bindings))
          .on("error", (error: Error) => reject(error))
          .on("end", () => resolve());
      })
      .catch((reason: any) => reject(reason));
  });
}

async function findTaskEntries(session: Session): Promise<Todo[]> {
  return await new Promise<Todo[]>((resolve, reject) => {
    const taskData: Map<NamedNode, Quad[]> = new Map<NamedNode, Quad[]>();
    const taskQuery: string = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX schema: <http://schema.org/>

      SELECT ?s ?p ?o WHERE {
        ?s rdf:type schema:TextDigitalDocument .
        ?s ?p ?o .
      }
    `;
    void execute(
      taskQuery,
      session.info.webId as string,
      session,
      (bindings: Bindings) => {
        const todoURI: NamedNode = bindings.get("s") as NamedNode;
        if (!taskData.has(todoURI)) {
          taskData.set(todoURI, new Array<Quad>());
        }
        taskData
          .get(todoURI)
          ?.push(
            new Quad(
              todoURI,
              bindings.get("p") as Term,
              bindings.get("o") as Term
            )
          );
      }
    )
      .catch((reason: any) => reject(reason))
      .then(() => {
        const taskList: Todo[] = new Array<Todo>();
        let index: number = 0;
        for (const quads of taskData.values()) {
          taskList.push({
            todo: findObjectByPredicate(quads, "http://schema.org/text").value,
            id: index++,
            isDone: false,
            iri: new URL(quads[0].subject.value),
          });
        }
        resolve(taskList);
      });
  });
}

async function findOidcIssuer(webId: URL): Promise<URL> {
  return await new Promise<URL>((resolve, reject) => {
    const issuerQuery: string = `
      PREFIX solid: <http://www.w3.org/ns/solid/terms#>

      SELECT ?s ?o WHERE {
        ?s solid:oidcIssuer ?o .
      }
    `;
    void execute(issuerQuery, webId.href, undefined, (bindings: Bindings) => {
      const issuer: NamedNode = bindings.get("o") as NamedNode;
      const issuerURL: URL = new URL(issuer.value);
      console.log(`Found webID issuer for ${webId.href} at ${issuerURL.href}`);
      // throw 'in the towel'
      resolve(issuerURL);
    });
  });
}

async function findName(webId: URL): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const nameQuery: string = `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>

      SELECT ?s ?o WHERE {
        ?s rdf:type foaf:Person .
        ?s (foaf:givenName|foaf:name) ?o .
      }
    `;
    void execute(nameQuery, webId.href, undefined, (bindings: Bindings) => {
      const name: Literal = bindings.get("o") as Literal;
      console.log(`Found name for ${webId.href} as ${name.value}`);
      // throw 'in the towel'
      resolve(name.value);
    });
  });
}

// void (async () => {
//       const myEngine = new QueryEngine();
//       const bindingsStream = await myEngine.queryBindings(
//         `SELECT ?o WHERE {
//            ?s <http://www.w3.org/ns/pim/space#storage> ?o.
//           }`,
//         {
//           sources: [`${session.info.webId as string}`],
//         }
//       );
//       const bindings = await bindingsStream.toArray();

//       const podUrl = bindings[0].get("o").value;
//       console.log("Login.tsx :: podUrl is " + podUrl);
//       setPodUrl(podUrl);

//       const containerUri: any =
//         (podUrl as string) + ("private/todosnew/" as string);
//       console.log("Login.tsx :: containerUri is " + containerUri);

//       const file: any =
//         (containerUri.split("Data")[0] as string) + ("todos.ttl" as string);
//       // const file: any = (containerUri.split('Data')[0] as string)
//       console.log("Login.tsx :: file is " + file);
//       setFile(file);

//       setWebId(session.info.webId ?? oidcIssuer);
//       //return file; // QUESTION? Why return this? Doesn't useEffect only run cleanup _functions_?

//     })();

async function queryPodUrl(webId: URL): Promise<URL> {
  return await new Promise<URL>((resolve, reject) => {
    const podUrlQuery: string = `
          SELECT ?o WHERE {
           ?s <http://www.w3.org/ns/pim/space#storage> ?o.
          }`;

    void execute(podUrlQuery, webId.href, undefined, (bindings: Bindings) => {
      const pod: NamedNode = bindings.get("o") as NamedNode;
		const podUrl : URL = new URL(pod.value)
      console.log(`Found podUrl for ${webId.href} as ${podUrl.href}`);
      resolve(podUrl);
    });

  });
}

export { findTaskEntries, findOidcIssuer, findName, queryPodUrl };
