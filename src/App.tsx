import React from 'react';
import './App.css';
import { UrlString } from '@inrupt/solid-client';
import { Session } from '@inrupt/solid-client-authn-browser';
import Login from './login'

interface AppProps  {
  weburl ?: UrlString;
  ses ?: Session;
}

const App: React.FC<AppProps> = (props):JSX.Element => {  
  return (
    <div className='App'>
      
      <span className='heading'>Solid-To-Do</span>

      <Login />
</div>   
  );
  }

export default App;