import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';



// const root = ReactDOM.createRoot(
//     document.getElementById('root') as HTMLElement
// );
 
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

import {
  getSolidDataset,
  getThing,
  setThing,
  getStringNoLocale,
  setStringNoLocale,
  saveSolidDatasetAt
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-browser";
import { VCARD } from "@inrupt/vocab-common-rdf";

// If your Pod is *not* on `solidcommunity.net`, change this to your identity provider.
const SOLID_IDENTITY_PROVIDER = "https://solidcommunity.net";
document.getElementById("solid_identity_provider")!.innerHTML = `[<a target="_blank" href="${SOLID_IDENTITY_PROVIDER}">${SOLID_IDENTITY_PROVIDER}</a>]`;

const NOT_ENTERED_WEBID ="...not logged in yet - but enter any WebID to read from its profile...";

const session = new Session();
console.log(session);
const buttonLogin = document.getElementById("btnLogin");
//const writeForm = document.getElementById("writeForm");
//const readForm = document.getElementById("readForm");

// 1a. Start Login Process. Call session.login() function.
async function login() {
  if (!session.info.isLoggedIn) {
    await session.login({
      oidcIssuer: SOLID_IDENTITY_PROVIDER,
      clientName: "Inrupt tutorial client app",
      redirectUrl: window.location.href
    });
  }
}

// 1b. Login Redirect. Call session.handleIncomingRedirect() function.
// When redirected after login, finish the process by retrieving session information.
async function handleRedirectAfterLogin() {
  await session.handleIncomingRedirect(window.location.href);
  if (session.info.isLoggedIn) {
    // Update the page with the status.
    document.getElementById("labelStatus")!.innerHTML = `Your session is logged in with the WebID [<a target="_blank" href="${session.info.webId}">${session.info.webId}</a>].`;
    document.getElementById("labelStatus")!.setAttribute("role", "alert");
    //(document.getElementById("webID")as HTMLElement).value = session.info.webId;
  
    
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
    }
}

handleRedirectAfterLogin();


buttonLogin!.onclick = function () {
  login();
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
