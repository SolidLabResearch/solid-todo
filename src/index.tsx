import App from "./App";
import "./index.css"
import { SessionProvider } from "@inrupt/solid-ui-react";
import { createRoot } from "react-dom/client"

// ReactDOM.render(
//   <SessionProvider>
//     <App />
//   </SessionProvider>,
//   document.getElementById("root")
// );

const root = createRoot(document.getElementById("root")!)
root.render(<SessionProvider> <App /> </SessionProvider>)

// import React from 'react';
// import ReactDOM from 'react-dom';
// import "./index.css"
// import App from "./App"
// import { createRoot } from "react-dom/client"
//import InputField from './Components/InputField';

// import {
//   getSolidDataset,
//   getThing,
//   setThing,
//   getStringNoLocale,
//   setStringNoLocale,
//   saveSolidDatasetAt
// } from "@inrupt/solid-client";
//import { Session } from "@inrupt/solid-client-authn-browser"
//import { VCARD } from "@inrupt/vocab-common-rdf";

// for testing purposes
//import { findTodoEntries } from "./query"
//import { ITodo } from "./model"

//const NOT_ENTERED_WEBID ="...not logged in yet - but enter any WebID to read from its profile...";

// const session = new Session()
// //console.log(session);
// const buttonLogin = document.getElementById("btnLogin")

//const writeForm = document.getElementById("input") as HTMLInputElement;
//const readForm = document.getElementById("readForm");

// 1a. Start Login Process. Call session.login() function.
// async function login() {
//   if (!session.info.isLoggedIn) {
//     const identityProviderSelection: HTMLSelectElement = document.getElementById("identityProviderSelection") as HTMLSelectElement
//     console.log(`Login with ${identityProviderSelection.value}`)
//     await session.login({
//       oidcIssuer: identityProviderSelection.value,
//       clientName: "Inrupt tutorial client app",
//       redirectUrl: window.location.href
//     })
//   }
// }

// // 1b. Login Redirect. Call session.handleIncomingRedirect() function.
// // When redirected after login, finish the process by retrieving session information.
// async function handleRedirectAfterLogin() {
//   await session.handleIncomingRedirect(window.location.href)
//   if (session.info.isLoggedIn) {
//     // Update the page with the status.
//     document.getElementById("labelStatus")!.innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`
//     document.getElementById("labelStatus")!.setAttribute("role", "alert")

    //document.getElementById("webID")! as HTMLElement = session.info.webId;

    // for testing purposes only
    // findTodoEntries(session)
    //   .then((todos: ITodo[]) => {
    //     console.log(JSON.stringify(todos))
    //   })
    //   .catch((reason: any) => console.log(reason))

    // const root = createRoot(document.getElementById("root")!)
    // root.render(<App />)
//   }
// }

// handleRedirectAfterLogin()

//Write to profile
// async function writeProfile() {

//   if (!session.info.isLoggedIn) {
//     // You must be authenticated to write.
//     document.getElementById("labelWriteStatus")!.textContent = `...you can't make a to-do list until you first login!`;
//     document.getElementById("labelWriteStatus")!.setAttribute("role", "alert");
//     return;

//const webID = session.info.webId;
//console.log(webID);
//const profileDocumentUrl : URL = new URL(webID as string);

//profileDocumentUrl.hash = "";

// let myProfileDataset = await getSolidDataset(profileDocumentUrl.href, {fetch: session.fetch});

// // The profile data is a "Thing" in the profile dataset.
// let profile = getThing(myProfileDataset, webID as string) ;

//   }

// }
//buttonLogin!.addEventListener("click", login)

// writeForm.addEventListener("submit", (event) => {
//    event.preventDefault();
//    writeProfile();
//   });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
